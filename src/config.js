export const config = {
  debug: import.meta.env.VITE_DEBUG === "true",
  stats: import.meta.env.VITE_STATS === "true",
  gui: import.meta.env.VITE_GUI === "true",
  orbit: import.meta.env.VITE_ORBIT === "true",
};
