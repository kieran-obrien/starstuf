import { planetsArray } from "./main";

const updatePlanetOrbitPosition = (planetsArray) => {
    // If not paused, update the planets
    const currentTime = Date.now();
    let distanceCounter = 0;
    planetsArray.forEach((p) => {
        // Calculate the change in angle based on the speed and elapsed time
        const deltaAngle = (currentTime - p.lastUpdateTime) * p.speed;
        p.currentAngle += deltaAngle;
        p.lastUpdateTime = currentTime;

        // Set the new position based on the current angle
        p.mesh.position.set(
            Math.cos(p.currentAngle) * (p.distance + distanceCounter),
            0,
            Math.sin(p.currentAngle) * (p.distance + distanceCounter)
        );
        distanceCounter += 90;
        // Rotate the planet
        p.mesh.rotation.y += p.spinSpeed;
    });
};

export { updatePlanetOrbitPosition };
