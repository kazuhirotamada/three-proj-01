import { createSketchTemplate } from "./sketch-template/index.js";
import { createSketchBasic } from "./sketch-basic/index.js";
import { createSketchParticles } from "./sketch-particles/index.js";
import { createSketchFlow } from "./sketch-flow/index.js";

export const sketches = {
  "sketch-template": {
    name: "Template",
    category: "template",
    description: "量産するテンプレート 空の状態からスタート",
    create: createSketchTemplate,
  },
  "sketch-basic": {
    name: "Basic Box",
    category: "test",
    description: "Box表示のテスト",
    create: createSketchBasic,
  },
  "sketch-particles": {
    name: "Particles",
    category: "performance",
    description: "GPU負荷テスト用",
    create: createSketchParticles,
  },
  "sketch-flow": {
    name: "Flow",
    category: "performance",
    description: "流体モニョモニョ",
    create: createSketchFlow,
  },
};
