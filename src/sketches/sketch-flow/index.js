import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export function createSketchFlow({ scene, gui }) {
  const params = {
    count: 20000,
    spread: 20,
    size: 0.03,
    speed: 0.01,
    noiseScale: 0.08,
    strength: 0.15,
    color: '#66ccff',
    colors: [
        '#66ccff',
        '#88aaff',
        '#aaddff',
        '#ffffff',
    ]
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
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const colors = new Float32Array(params.count * 3);

    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        const x = positions[i3 + 0];

        const color = new THREE.Color();

        color.setHSL(
            (x / params.spread) + 0.5,
            0.8,
            0.6
        );

        colors[i3 + 0] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


  const randomColor = params.colors[Math.floor(Math.random() * params.colors.length)];

  const material = new THREE.PointsMaterial({
    size: params.size,
    vertexColors: true,
    // color: randomColor,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  if (gui) {
    const folder = gui.addFolder('flow');
    folder.add(params, 'count').min(1000).max(100000).step(1000);
    folder.add(params, 'size').min(0.001).max(0.2).step(0.001);
    folder.add(params, 'speed').min(0.001).max(0.05).step(0.001);
    folder.add(params, 'noiseScale').min(0.001).max(0.3).step(0.001);
    folder.add(params, 'strength').min(0.01).max(1.0).step(0.01);
    folder.open();
  }

  return {
    update: (time) => {
  const positionAttribute = geometry.attributes.position;
  const colorAttribute = geometry.attributes.color;

  const positionsArray = positionAttribute.array;
  const colorsArray = colorAttribute.array;

  const tempColor = new THREE.Color();

  for (let i = 0; i < params.count; i += 1) {
    const i3 = i * 3;

    const x = positionsArray[i3 + 0];
    const y = positionsArray[i3 + 1];
    const z = positionsArray[i3 + 2];

    const angle = noise3D(
      x * params.noiseScale,
      y * params.noiseScale,
      time * params.speed
    ) * Math.PI * 2;

    positionsArray[i3 + 0] += Math.cos(angle) * params.strength * 0.02;
    positionsArray[i3 + 1] += Math.sin(angle) * params.strength * 0.02;

    const limit = params.spread * 0.6;

    if (positionsArray[i3 + 0] > limit) positionsArray[i3 + 0] = -limit;
    if (positionsArray[i3 + 0] < -limit) positionsArray[i3 + 0] = limit;
    if (positionsArray[i3 + 1] > limit) positionsArray[i3 + 1] = -limit;
    if (positionsArray[i3 + 1] < -limit) positionsArray[i3 + 1] = limit;
    if (positionsArray[i3 + 2] > limit) positionsArray[i3 + 2] = -limit;
    if (positionsArray[i3 + 2] < -limit) positionsArray[i3 + 2] = limit;

    const hue =
      ((positionsArray[i3 + 0] / params.spread) + 0.5 + time * 0.05) % 1;

    tempColor.setHSL(hue, 0.8, 0.6);

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