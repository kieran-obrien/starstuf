import * as THREE from "three";

const initThreeJsAssets = () => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const previewScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // field of view, aspect ratio, near, far

    const renderer = new THREE.WebGLRenderer({
        // Create the renderer
        canvas: document.querySelector("#bg"),
    });

    const previewRenderer = new THREE.WebGLRenderer({
        // Create the little renderer
        canvas: document.querySelector("#planet-preview-canvas"),
    });
    // Set the renderer size to match the canvas size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Set the renderer size to match the canvas size
    const canvas = document.querySelector("#planet-preview-canvas");
    const camera2 = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000); // field of view, aspect ratio, near, far
    console.log(canvas.clientWidth, canvas.clientHeight);
    previewRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    previewRenderer.setPixelRatio(window.devicePixelRatio);

    // Set the renderer size and camera position
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(50);
    camera2.position.setZ(10);

    return [scene, previewScene, camera, camera2, renderer, previewRenderer]
};

export { initThreeJsAssets };
