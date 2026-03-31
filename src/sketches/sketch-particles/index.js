import * as THREE from "three";

export function createSketchParticles({ scene, gui }) {
  // 👇これが「sketch固有設定」
  const params = {
    count: 60000,
    size: 0.03,
    spread: 10,
    speed: 0.15,
    transparent: false,
    opacity: 1,
  };

  const positions = new Float32Array(params.count * 3);

  for (let i = 0; i < params.count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * params.spread;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: params.size,
    transparent: params.transparent,
    opacity: params.opacity,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  if (gui) {
    const folder = gui.addFolder("particles");
    folder.add(params, "count").min(1000).max(1000000).step(1000);
    folder.add(params, "size").min(0.01).max(2).step(0.01);
    folder.add(params, "speed").min(0).max(2).step(0.01);
    folder.open();
  }

  return {
    update: (time) => {
      points.rotation.y = time * params.speed;
    },
  };
}
