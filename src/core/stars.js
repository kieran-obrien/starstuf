import * as THREE from "three";
import { camera, scene } from "./three-setup";

const generateStars = (scene, geometry, material) => {
  const star = new THREE.Mesh(geometry, material);
  star.layers.set(1); // Keeps them unselectable
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(5000));
  star.position.set(x, y, z);
  scene.add(star);
  return star;
};

const stars = (scene, camera) => {
  const geometryStar = new THREE.SphereGeometry(0.8, 24, 24);
  const materialStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
  camera.layers.enable(1);
  Array(1000)
    .fill()
    .forEach(() => {
      generateStars(scene, geometryStar, materialStar);
    });
};

stars(scene, camera);
