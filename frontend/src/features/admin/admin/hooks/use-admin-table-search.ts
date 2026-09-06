import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { NavigateFn } from "@admin/hooks/use-table-url-state";

function parseNumber(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseArray(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

const ARRAY_FILTER_KEYS = new Set([
  "status",
  "role",
  "gender",
  "priority",
  "department",
  "shift",
  "recordType",
  "type",
]);

export function parseAdminSearchParams(
  searchParams: URLSearchParams
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    page: parseNumber(searchParams.get("page"), 1),
    pageSize: parseNumber(searchParams.get("pageSize"), 10),
  };

  searchParams.forEach((value, key) => {
    if (key === "page" || key === "pageSize") return;
    result[key] = ARRAY_FILTER_KEYS.has(key) ? parseArray(value) : value;
  });

  return result;
}

function serializeSearchRecord(record: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(record).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(","));
      return;
    }

    if (typeof value === "number" && value === 1 && key === "page") return;
    if (typeof value === "number" && value === 10 && key === "pageSize") return;

    params.set(key, String(value));
  });

  return params;
}

export function useAdminTableSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = useMemo(
    () => parseAdminSearchParams(searchParams),
    [searchParams]
  );

  const navigate: NavigateFn = useCallback(
    ({ search: updater, replace }) => {
      setSearchParams(
        (prev) => {
          const current = parseAdminSearchParams(prev);
          const next =
            updater === true
              ? current
              : typeof updater === "function"
                ? { ...current, ...updater(current) }
                : { ...current, ...updater };

          return serializeSearchRecord(next);
        },
        { replace: replace ?? false }
      );
    },
    [setSearchParams]
  );

  return { search, navigate };
}
