import lightingSetup from "../src/lighting-setup";
import { scene, previewScene } from "../src/main";

describe("lightingSetup", () => {
    test("should return array", () => {
        expect(lightingSetup(scene, previewScene).toEqual([]));
    });
});
