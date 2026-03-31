import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createStats } from "./debug/createStats.js";

import { config } from "./config.js";
import { sketches } from "./sketches/index.js";
import { getSketchName } from "./utils/getSketchName.js";

import { createScene } from "./app/createScene.js";
import { createCamera } from "./app/createCamera.js";
import { createRenderer } from "./app/createRenderer.js";
import { setupResize } from "./app/setupResize.js";
import { setupLoop } from "./app/setupLoop.js";

export class Experience {
  constructor(canvas) {
    this.canvas = canvas;

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.scene = createScene();
    this.camera = createCamera(this.sizes);
    this.scene.add(this.camera);

    this.renderer = createRenderer(this.canvas, this.sizes);

    this.clock = new THREE.Clock();

    this.controls = null;
    if (config.orbit) {
      this.controls = new OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;
    }

    this.gui = null;
    if (config.gui) {
      this.gui = new GUI();
    }

    this.stats = null;
    if (config.stats) {
      this.stats = createStats();
    }

    const sketchName = getSketchName();
    const sketchEntry = sketches[sketchName] || sketches["sketch-basic"];

    this.sketch = sketchEntry.create({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      gui: this.gui,
    });

    setupResize({
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
    });

    setupLoop({
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      controls: this.controls,
      sketch: this.sketch,
      clock: this.clock,
      stats: this.stats,
    });
  }
}
