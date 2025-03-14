import * as THREE from "three";
import lightingSetup from "../src/lighting-setup";

const mockScene = new THREE.Scene();
const mockPreviewScene = new THREE.Scene();

describe("lightingSetup", () => {
    test("returns an array with two light objects, a PointLightHelper and a GridHelper", () => {
        expect(lightingSetup(mockScene, mockPreviewScene)).toEqual([
            expect.any(THREE.AmbientLight),
            expect.any(THREE.AmbientLight),
            expect.any(THREE.PointLightHelper),
            expect.any(THREE.GridHelper),
        ]);
    });
});
