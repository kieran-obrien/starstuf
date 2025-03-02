import * as THREE from "three";

// Generate random star effect
export default function stars(scene, camera) {
    // Define the star geometry and material once
    const geometryStar = new THREE.SphereGeometry(0.8, 24, 24);
    const materialStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
    // Enable seperate layers (for stars)
    camera.layers.enable(1);
    const generateStars = () => {
        const star = new THREE.Mesh(geometryStar, materialStar);
        star.layers.set(1); // Keeps them unselectable
        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(2000));
        star.position.set(x, y, z);
        scene.add(star);
    };
    Array(1000).fill().forEach(generateStars); // Set star amount
}
