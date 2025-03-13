import * as THREE from "three";
import { planetsArray, scene, camera, renderer, isCameraHelio, setIsCameraHelio, showControls } from "./main";

const raycaster = new THREE.Raycaster();

const raycasterInit = () => {
    document.addEventListener("mousemove", onMouseMove);

    function onMouseMove(event) {
        console.log("Here?");
        //console.log('Mouse Down Event');
        const mouseCoords = new THREE.Vector2(
            (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
            -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouseCoords, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            //console.log(intersects);
            const intersectedObject = intersects[0].object;
            //console.log(intersectedObject.name);
            for (let p of planetsArray) {
                if (p.name === intersectedObject.name) {
                    //console.log(`Selected ${p.name}`);
                    p.raySelected = true;
                }
            }
        } else {
            for (let p of planetsArray) {
                p.raySelected = false;
            }
            //console.log('No intersections found');
        }
    }

    document.addEventListener("mousedown", onMouseDown);

    function onMouseDown(event) {
        const mouseCoords = new THREE.Vector2(
            (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
            -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouseCoords, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            //console.log(intersects);
            const intersectedObject = intersects[0].object;
            //console.log(intersectedObject.name);
            for (let p of planetsArray) {
                if (p.name === intersectedObject.name) {
                    console.log(`Selected ${p.name}`);
                    setIsCameraHelio(false);
                    p.cameraFollow = true;
                    console.log(isCameraHelio);
                    const index = planetsArray.indexOf(p);
                    p.controlsSelected = true;
                    showControls(p, index);
                } else {
                    p.controlsSelected = false;
                    p.cameraFollow = false;
                }
            }
        }
    }
};

const updateRaycastSelectPlanetColor = () => {
    const rColor = new THREE.Color(0xff0000);
    if (planetsArray) {
        for (let p of planetsArray) {
            if (p.raySelected) {
                p.mesh.material.color = rColor;
            } else {
                p.mesh.material.color = new THREE.Color(0xffffff);
            }
        }
    }
};

export { raycasterInit, updateRaycastSelectPlanetColor };
