export function getSketchName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("sketch") || "sketch-basic";
}
