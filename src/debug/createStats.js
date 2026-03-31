import Stats from "stats.js";

export function createStats() {
  const stats = new Stats();
  stats.showPanel(0); // 0: FPS

  stats.dom.style.position = "fixed";
  stats.dom.style.top = "0";
  stats.dom.style.left = "0";
  stats.dom.style.zIndex = "100";

  document.body.appendChild(stats.dom);

  return stats;
}
