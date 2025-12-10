// Convert Date to yyyyMMddHHmm format
export function formatDate(date) {
  const pad = (num, size = 2) => num.toString().padStart(size, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes())
  );
}
