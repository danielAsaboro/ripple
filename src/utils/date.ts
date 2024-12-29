// File: /utils/date.ts
export function createISOTimestamp(): string {
  return new Date().toISOString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}
