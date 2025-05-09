export function isValidId(id) {
  return (
    (typeof id === "string" || typeof id === "number") &&
    String(id).trim().length > 0
  );
}

export function isValidValue(value) {
  return typeof value === "number" && Number.isFinite(value);
}
