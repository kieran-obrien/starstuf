import * as THREE from "three";
import { stars, generateStars } from "../src/stars";

const mockScene = new THREE.Scene();
const mockGeometry = new THREE.SphereGeometry(1, 1, 1);
const mockMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

describe("generateStars", () => {
    test("returns a THREE mesh object", () => {
        expect(generateStars(mockScene, mockGeometry, mockMaterial)).toEqual(expect.any(THREE.Mesh));
    });
});
