export function setupLoop({
  camera,
  scene,
  renderer,
  controls,
  sketch,
  clock,
  stats,
}) {
  const tick = () => {
    if (stats) stats.begin();

    const elapsedTime = clock.getElapsedTime();

    if (controls) {
      controls.update();
    }

    if (sketch?.update) {
      sketch.update(elapsedTime);
    }

    renderer.render(scene, camera);

    if (stats) stats.end();

    window.requestAnimationFrame(tick);
  };

  tick();
}
