import type { Dossier, Document } from "./index.mjs";
export function normalizeRge(
  rows: Record<string, unknown>[],
  options?: {
    source?: string;
    date?: string;
    domainMap?: Record<string, string>;
  },
): { qualifications: Record<string, unknown>[]; documents: Document[] };
export function fetchRge(
  siret: string,
  options?: {
    fetchImpl?: typeof fetch;
    signal?: AbortSignal;
    domainMap?: Record<string, string>;
    maxPages?: number;
  },
): Promise<ReturnType<typeof normalizeRge>>;
