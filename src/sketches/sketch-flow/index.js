import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

export function createSketchFlow({ scene, gui }) {
  const params = {
    count: 20000,
    spread: 20,
    size: 0.045,
    speed: 0.12,
    noiseScale: 0.035,
    strength: 0.08,
    drift: 0.003,
    respawnChance: 0.002,
    opacity: 0.35,
    saturation: 0.55,
    lightness: 0.65,
  };

  const noise3D = createNoise3D();

  const positions = new Float32Array(params.count * 3);
  const seeds = new Float32Array(params.count * 3);

  for (let i = 0; i < params.count; i += 1) {
    const i3 = i * 3;

    positions[i3 + 0] = (Math.random() - 0.5) * params.spread;
    positions[i3 + 1] = (Math.random() - 0.5) * params.spread;
    positions[i3 + 2] = (Math.random() - 0.5) * params.spread;

    seeds[i3 + 0] = Math.random() * 1000;
    seeds[i3 + 1] = Math.random() * 1000;
    seeds[i3 + 2] = Math.random() * 1000;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const colors = new Float32Array(params.count * 3);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    const x = positions[i3 + 0];
    const color = new THREE.Color();

    color.setHSL(x / params.spread + 0.5, params.saturation, params.lightness);

    colors[i3 + 0] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: params.size,
    vertexColors: true,
    transparent: true,
    opacity: params.opacity,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  if (gui) {
    const folder = gui.addFolder("flow");
    folder.add(params, "count").min(1000).max(100000).step(1000);
    folder.add(params, "size").min(0.001).max(0.2).step(0.001);
    folder.add(params, "speed").min(0.01).max(0.5).step(0.001);
    folder.add(params, "noiseScale").min(0.005).max(0.2).step(0.001);
    folder.add(params, "strength").min(0.001).max(0.3).step(0.001);
    folder.add(params, "drift").min(0.0).max(0.02).step(0.0005);
    folder.add(params, "respawnChance").min(0.0).max(0.01).step(0.0001);
    folder
      .add(params, "opacity")
      .min(0.05)
      .max(1.0)
      .step(0.01)
      .onChange((v) => {
        material.opacity = v;
      });
    folder.add(params, "saturation").min(0.0).max(1.0).step(0.01);
    folder.add(params, "lightness").min(0.0).max(1.0).step(0.01);
    folder.open();
  }

  return {
    update: (time) => {
      const positionAttribute = geometry.attributes.position;
      const colorAttribute = geometry.attributes.color;

      const positionsArray = positionAttribute.array;
      const colorsArray = colorAttribute.array;

      const tempColor = new THREE.Color();
      const limit = params.spread * 0.6;

      for (let i = 0; i < params.count; i += 1) {
        const i3 = i * 3;

        let x = positionsArray[i3 + 0];
        let y = positionsArray[i3 + 1];
        let z = positionsArray[i3 + 2];

        const angle =
          noise3D(
            x * params.noiseScale,
            y * params.noiseScale,
            time * params.speed,
          ) *
          Math.PI *
          2;

        const angleZ =
          noise3D(
            y * params.noiseScale,
            z * params.noiseScale,
            time * params.speed,
          ) *
          Math.PI *
          2;

        positionsArray[i3 + 0] += Math.cos(angle) * params.strength;
        positionsArray[i3 + 1] += Math.sin(angle) * params.strength;
        positionsArray[i3 + 2] += Math.sin(angleZ) * params.strength * 0.4;

        positionsArray[i3 + 0] += (Math.random() - 0.5) * params.drift;
        positionsArray[i3 + 1] += (Math.random() - 0.5) * params.drift;
        positionsArray[i3 + 2] += (Math.random() - 0.5) * params.drift * 0.5;

        if (Math.random() < params.respawnChance) {
          positionsArray[i3 + 0] = (Math.random() - 0.5) * params.spread;
          positionsArray[i3 + 1] = (Math.random() - 0.5) * params.spread;
          positionsArray[i3 + 2] = (Math.random() - 0.5) * params.spread;
        }

        if (positionsArray[i3 + 0] > limit) positionsArray[i3 + 0] = -limit;
        if (positionsArray[i3 + 0] < -limit) positionsArray[i3 + 0] = limit;
        if (positionsArray[i3 + 1] > limit) positionsArray[i3 + 1] = -limit;
        if (positionsArray[i3 + 1] < -limit) positionsArray[i3 + 1] = limit;
        if (positionsArray[i3 + 2] > limit) positionsArray[i3 + 2] = -limit;
        if (positionsArray[i3 + 2] < -limit) positionsArray[i3 + 2] = limit;

        x = positionsArray[i3 + 0];
        y = positionsArray[i3 + 1];
        z = positionsArray[i3 + 2];

        const hue = (((x + y * 0.5) / params.spread) * 0.5 + 0.5) % 1;

        tempColor.setHSL(hue, params.saturation, params.lightness);

        colorsArray[i3 + 0] = tempColor.r;
        colorsArray[i3 + 1] = tempColor.g;
        colorsArray[i3 + 2] = tempColor.b;
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
    },
    destroy: () => {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    },
  };
}
