import type { Camp } from "@widgets/camp-listing";
import { CAMP_SEED_DATA } from "./seed";
import type { CampAdminRecord, CampFormValues, CampStatus, CampType } from "./types";

const STORAGE_KEY = "snm-camp-records";
export const CAMP_STORE_CHANGED_EVENT = "camp-store-changed";

function dispatchStoreChange() {
  window.dispatchEvent(new Event(CAMP_STORE_CHANGED_EVENT));
}

function readStore(): CampAdminRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...CAMP_SEED_DATA];
    const parsed = JSON.parse(raw) as CampAdminRecord[];
    return Array.isArray(parsed) ? parsed : [...CAMP_SEED_DATA];
  } catch {
    return [...CAMP_SEED_DATA];
  }
}

function writeStore(records: CampAdminRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  dispatchStoreChange();
}

function toCamp(record: CampAdminRecord): Camp {
  const { campType: _campType, status: _status, createdAt: _c, updatedAt: _u, ...camp } =
    record;
  return camp;
}

function createId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug}-${Date.now()}`;
}

export function getCampsByType(campType: CampType): CampAdminRecord[] {
  return readStore().filter((record) => record.campType === campType);
}

export function getPublishedCampsByType(campType: CampType): Camp[] {
  return getCampsByType(campType)
    .filter((record) => record.status === "published")
    .map(toCamp);
}

export function createCamp(
  campType: CampType,
  values: CampFormValues
): CampAdminRecord {
  const timestamp = new Date().toISOString();
  const record: CampAdminRecord = {
    id: createId(values.title),
    campType,
    ...values,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeStore([...readStore(), record]);
  return record;
}

export function updateCamp(id: string, values: CampFormValues): CampAdminRecord | null {
  const records = readStore();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;

  const updated: CampAdminRecord = {
    ...records[index],
    ...values,
    updatedAt: new Date().toISOString(),
  };

  records[index] = updated;
  writeStore(records);
  return updated;
}

export function deleteCamp(id: string): boolean {
  const records = readStore();
  const next = records.filter((record) => record.id !== id);
  if (next.length === records.length) return false;
  writeStore(next);
  return true;
}

export function setCampStatus(id: string, status: CampStatus): CampAdminRecord | null {
  const records = readStore();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  writeStore(records);
  return records[index];
}

export function toggleCampPublish(id: string): CampAdminRecord | null {
  const records = readStore();
  const record = records.find((item) => item.id === id);
  if (!record) return null;
  const nextStatus: CampStatus = record.status === "published" ? "draft" : "published";
  return setCampStatus(id, nextStatus);
}
