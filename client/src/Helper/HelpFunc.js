export function bytesToMB(bytes) {
  if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) {
    throw new Error("Please provide a valid non-negative number for bytes.");
  }
  return (bytes / (1024 * 1024)).toFixed(2);
}
