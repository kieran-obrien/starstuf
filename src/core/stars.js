import * as THREE from "three";

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

// Generate random star effect
const stars = (scene, camera) => {
  // Define the star geometry and material once
  const geometryStar = new THREE.SphereGeometry(0.8, 24, 24);
  const materialStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
  // Enable seperate layers (for stars)
  camera.layers.enable(1);
  Array(1000)
    .fill()
    .forEach(() => {
      generateStars(scene, geometryStar, materialStar); // Set star amount
    });
};

export { stars, generateStars };
