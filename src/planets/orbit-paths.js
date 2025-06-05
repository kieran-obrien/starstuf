import * as THREE from "three";

function createOrbitCircle(radius, segments = 128, color = 0xffffff) {
  const orbitGeometry = new THREE.BufferGeometry();
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    points.push(new THREE.Vector3(x, 0, z)); // Orbit in XZ plane
  }

  orbitGeometry.setFromPoints(points);

  const orbitMaterial = new THREE.LineBasicMaterial({
    color: color,
    opacity: 0.5,
    transparent: true,
  });

  const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  return orbit;
}

export default createOrbitCircle;
