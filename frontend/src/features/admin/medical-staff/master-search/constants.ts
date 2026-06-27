/** Server-side export requests all matching rows; not used for client pagination. */
export const MASTER_SEARCH_EXPORT_LIMIT = 1_000_000;

export const MASTER_SEARCH_DEFAULT_PAGE_LIMIT = 10;

export const MASTER_SEARCH_DEFAULT_SORT = {
  column: "fullName",
  direction: "ASC" as const,
};
