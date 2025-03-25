import { isCameraHelio, planetsArray, camera, renderer } from "../main";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";

const initCameraControls = () => {
    // const controls = new OrbitControls(camera, renderer.domElement); Alternative controls
    const controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.enablePan = false;
    return controls;
};

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

export { isSetToPlanetCameraMode, initCameraControls };
