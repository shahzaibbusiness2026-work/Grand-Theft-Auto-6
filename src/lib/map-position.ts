function parsePercentage(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value >= 0 && value <= 100 ? value : null;
  }
  const text = value?.trim() ?? "";
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)%?$/.test(text)) return null;
  const parsed = parseFloat(text);
  return parsed >= 0 && parsed <= 100 ? parsed : null;
}

export function parseCanvasPosition(
  top: string | number | null | undefined,
  left: string | number | null | undefined,
) {
  const y = parsePercentage(top);
  const x = parsePercentage(left);
  return x === null || y === null ? null : { top: y, left: x };
}

export function planningLocationHref(location: {
  id: string;
  top: string;
  left: string;
}) {
  const position = parseCanvasPosition(location.top, location.left);
  if (!position) return null;
  const params = new URLSearchParams({
    edition: "legacy",
    poi: location.id,
    top: String(position.top),
    left: String(position.left),
  });
  return `/map?${params}`;
}
