import { isCameraHelio, planetsArray, camera } from "../main";

const isSetToPlanetCameraMode = () => {
    if (!isCameraHelio) {
        for (let p of planetsArray) {
            if (p.cameraFollow) {
                // console.log("Camera following planet");
                camera.lookAt(p.mesh.position);
            }
        }
    }
};

export { isSetToPlanetCameraMode };
