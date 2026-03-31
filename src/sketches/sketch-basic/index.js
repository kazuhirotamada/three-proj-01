import * as THREE from "three";

export function createSketchBasic({ scene, gui }) {
  const params = {
    rotateX: 0.5,
    rotateY: 0.8,
    rotateZ: 0.5,
  };

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  if (gui) {
    const folder = gui.addFolder("box");
    folder.add(params, "rotateX").min(0).max(5).step(0.01);
    folder.add(params, "rotateY").min(0).max(5).step(0.01);
    folder.add(params, "rotateZ").min(0).max(5).step(0.01);
    folder.open();
  }

  return {
    update: (time) => {
      mesh.rotation.x = time * params.rotateX;
      mesh.rotation.y = time * params.rotateY;
      mesh.rotation.z = time * params.rotateZ;
    },
  };
}
