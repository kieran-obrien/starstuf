import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MapControls } from "three/addons/controls/MapControls.js";
import { select, texture } from "three/tsl";

let readyToStart = false;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const previewScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
); // field of view, aspect ratio, near, far

camera.layers.enable(1);

const renderer = new THREE.WebGLRenderer({
    // Create the renderer
    canvas: document.querySelector("#bg"),
});

const littleRenderer = new THREE.WebGLRenderer({
    // Create the renderer
    canvas: document.querySelector("#planet-preview-canvas"),
});
// Set the renderer size to match the canvas size
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Set the renderer size to match the canvas size
const canvas = document.querySelector("#planet-preview-canvas");
const camera2 = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
); // field of view, aspect ratio, near, far
console.log(canvas.clientWidth, canvas.clientHeight);
littleRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
littleRenderer.setPixelRatio(window.devicePixelRatio);

// Set the renderer size and camera position
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera2.position.setZ(10);
renderer.render(scene, camera);

// Add orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enablePan = false;

// Setting intial geometry and material for the sun and planets
const geometrySun = new THREE.SphereGeometry(10, 32, 32);
const materialSun = new THREE.MeshStandardMaterial({ color: 0xffaa0d });
const material = new THREE.MeshStandardMaterial({ color: 0x006600 });
const geometryPlanet = new THREE.SphereGeometry(4, 15, 15);

// Add lighting to the scene
const pointLight = new THREE.PointLight(0xffffff, 1000, 1000);
pointLight.position.set(5, 20, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
const ambientLight2 = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
previewScene.add(ambientLight2);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
previewScene.add(lightHelper, gridHelper);

// RAYCASTER
const imgLoader = new THREE.ImageLoader();

// Load the planet textures
const textureLoader = new THREE.TextureLoader();
let textureCounter = 1;
const planetTextures = [];

let planetsArray = [];
let planetMaterials = [];
let sun;

class TextureObj {
    constructor(path) {
        this.pathNum = path;

        this.type = this.init(Number(this.pathNum));
    }

    init(pathNum) {
        const gaseous = [1, 2, 3, 4]; // Gaseous planets
        const hospitable = [5, 6, 7, 8]; // Hospitable planets
        const inhospitable = [9, 10, 11, 12]; // Inhospitable planets
        const terrestrial = [13, 14, 15, 16]; // Terrestrial planets

        if (gaseous.includes(pathNum)) {
            this.name = `Gaseous ${pathNum}`;
            return "Gaseous";
        } else if (hospitable.includes(pathNum)) {
            this.name = `Hospitable ${pathNum}`;
            return "Hospitable";
        } else if (inhospitable.includes(pathNum)) {
            this.name = `Inhospitable ${pathNum}`;
            return "Inhospitable";
        } else if (terrestrial.includes(pathNum)) {
            this.name = `Terrestrial ${pathNum}`;
            return "Terrestrial";
        }
    }
}

const imgs = [];

const loadImages = (path) => {
    imgLoader.load(
        path,
        (image) => {
            // On successful load
            console.log(image);
            imgs.push(image);
        },
        undefined,
        (err) => {
            // On error (e.g., texture not found)
            console.log("Finished loading images");
        }
    );
};

// Load the textures/imgs
let imgsLoaded = false;
const loadTexture = (counter) => {
    const texturePath = `./textures/${counter}.png`;

    textureLoader.load(
        texturePath,
        (texture) => {
            // On successful load
            loadImages(texturePath);
            const pathNum = texturePath.split("/")[2].split(".")[0];
            const textureObj = new TextureObj(pathNum);
            planetTextures.push([texture, textureObj]);
            loadTexture(counter + 1); // Load the next texture
        },
        undefined,
        (err) => {
            // On error (e.g., texture not found)
            console.log("Finished loading textures");
            console.log(planetTextures);
            console.log(imgs);
            imgsLoaded = true;
            [planetsArray, planetMaterials, sun] = createPlanets(); // Create planets after loading all textures
        }
    );
};

// Start loading textures
loadTexture(textureCounter);

// Set planet class
class Planet {
    constructor(size, orbitSpeed, mesh) {
        this.size = size;
        // Initial distance from sun
        this.distance = 90;
        // Values for min and max distance range calc
        this.minmaxdist = [0, 0];
        this.speed = orbitSpeed;
        this.spinSpeed = 0.00125;
        this.mesh = mesh;
        // Not in use atm
        this.inOrbit = false;
        this.name = "";
        // For texture code, retreive the last character of the texture path from mesh material
        this.textureCode = 5; //too fancy   //this.mesh.material.map.source.data.currentSrc.split(".png")[0].slice(-1);
        this.currentAngle = 0;
        // For pause functionality
        this.lastUpdateTime = Date.now();
        // For raycasting
        this.raySelected = false;
        // For camera follow
        this.cameraFollow = false;
        // For controls selection
        this.controlsSelected = false;
    }
    updatePlanetSize(size) {
        this.size = size;
        this.mesh.scale.set(size, size, size);
        console.log(`Updated planet size: ${this.size}`);
    }
    updatePlanetSpeed(speed) {
        console.log(this.speed);
        this.speed = speed / 8000;
        console.log(this.speed);
    }
    updatePlanetSpinSpeed(spinSpeed) {
        this.spinSpeed = spinSpeed / 800;
        console.log(this.spinSpeed);
    }
    updatePlanetDistance(distance) {
        this.distance = distance * 10;
    }
}

// Create and populate array of ten planet objects
// Also create array of planet materials

function getPlanet() {
    let planetMaterialInit = new THREE.MeshPhongMaterial({
        map: planetTextures[4][0],
    });
    return new Planet(
        1,
        0.000125,
        new THREE.Mesh(geometryPlanet, planetMaterialInit)
    );
}

function createPlanets() {
    let materialCounter = 0;
    planetMaterials = Array(planetTextures.length)
        .fill()
        .map(() => {
            console.log(planetTextures[materialCounter][0]);
            let material = new THREE.MeshPhongMaterial({
                map: planetTextures[materialCounter][0],
            });
            materialCounter++;
            return material;
        });
    const planetsArray = Array(10).fill().map(getPlanet);
    let distanceFromLast = 180;
    for (let i = 1; i < planetsArray.length + 1; i++) {
        planetsArray[i - 1].mesh.name = `Planet ${i}`;
        planetsArray[i - 1].name = `Planet ${i}`;
        planetsArray[i - 1].distance = distanceFromLast;
        distanceFromLast += 180;
        planetsArray[i - 1].minmaxdist = [
            distanceFromLast - 270,
            distanceFromLast - 90,
        ];
        console.log(planetsArray[i - 1].distance);
    }
    console.log(planetMaterials[3]);
    const sun = new THREE.Mesh(geometrySun, planetMaterials[3]);
    console.log(sun, "HELLO");

    // Add the initial sun
    scene.add(sun);
    sun.position.set(0, 0, 0);

    readyToStart = true;
    console.log("Planets created");
    console.log(planetsArray);
    return [planetsArray, planetMaterials, sun];
}

// Add planet functionality
let planetCount = 0;
function handlePlanets(planets) {
    // *TODO FUTURE WORK - EDIT THESE FUNCTIONS OUT OF GLOBAL SCOPE
    // Update planet size
    const updatePlanetSize = (index) => {
        console.log(index);
        const size = document.getElementById(`planet-size-${index}`).value;
        console.log(size);
        planets[index].updatePlanetSize(size);
    };
    window.updatePlanetSize = updatePlanetSize;

    // Update planet orbit speed
    const updatePlanetSpeed = (index) => {
        const speed = document.getElementById(`orbit-speed-${index}`).value;
        planets[index].updatePlanetSpeed(speed);
    };
    window.updatePlanetSpeed = updatePlanetSpeed;

    // Update planet spin speed
    const updatePlanetSpinSpeed = (index) => {
        const spin = document.getElementById(`planet-spin-${index}`).value;
        planets[index].updatePlanetSpinSpeed(spin);
    };
    window.updatePlanetSpinSpeed = updatePlanetSpinSpeed;

    // Update planet distance
    const updatePlanetDistance = (index) => {
        const distance = document.getElementById(
            `planet-distance-${index}`
        ).value;
        planets[index].updatePlanetDistance(distance);
    };
    window.updatePlanetDistance = updatePlanetDistance;
    // *TODO -------------------------------------------------------*/

    // Add planet control forms
    let planetCountCheck = planetCount;
    planetCount = document.getElementById("planet-count").value;
    // Add the planets
    for (let i = 0; i < planets.length; i++) {
        if (scene.children.includes(planets[i].mesh)) {
            planets[i].inOrbit = false;
            scene.remove(planets[i].mesh);
        }
        if (i < planetCount) {
            planets[i].inOrbit = true;
            scene.add(planets[i].mesh);
        }
    }
}

// Update planet texture
const updatePlanetTexture = (index) => {
    for (let p of planetsArray) {
        if (p.controlsSelected) {
            p.mesh.material = planetMaterials[index];
            p.textureCode = index + 1;
            planetMaterials[index].map.needsUpdate = true;
            console.log(`Updated planet texture: ${p.textureCode}`);
        }
    }
};

// Arrow orbit effect
const arrow = () => {
    const dir = planetsArray[0].mesh.position.clone();
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const origin = planetsArray[0].mesh.position.clone();
    const length = 2;
    const hex = 0xffff00;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 0, 0);
    scene.add(arrowHelper);
    setTimeout(() => scene.remove(arrowHelper), 20000);
};

// Generate random star effect
function stars() {
    // Define the star geometry and material once
    const geometryStar = new THREE.SphereGeometry(0.8, 24, 24);
    const materialStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const generateStars = () => {
        // Nested function for generating stars
        const star = new THREE.Mesh(geometryStar, materialStar);
        star.layers.set(1);
        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(2000));
        star.position.set(x, y, z);
        scene.add(star);
    };
    Array(1000).fill().forEach(generateStars); // Set star amount
}
stars();

// Pause and play functionality
let isPaused = false;
function pausePlay() {
    for (let i = 0; i < planetsArray.length; i++) {
        // Update the last update time for each planet
        planetsArray[i].lastUpdateTime = Date.now();
    }
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.className = "bi bi-play-btn-fill";
    } else {
        pauseButton.className = "bi bi-pause-btn-fill";
    }
}

const pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("click", pausePlay);

pauseButton.addEventListener("mouseover", () => {
    pauseButton.style.color = "#808080";
});
pauseButton.addEventListener("mouseout", () => {
    pauseButton.style.color = "#ffffff";
});
pauseButton.addEventListener("mousedown", () => {
    pauseButton.style.color = "#444444";
});
pauseButton.addEventListener("mouseup", () => {
    pauseButton.style.color = "#808080";
});

// Camera Select Test functionality
let isCameraHelio = true;
function setToHelioCameraMode() {
    isCameraHelio = true;
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);
    console.log(isCameraHelio);
}
const helioButton = document.getElementById("helio-button");
helioButton.addEventListener("click", setToHelioCameraMode);

function setToPlanetCameraMode() {
    if (!isCameraHelio) {
        for (let p of planetsArray) {
            if (p.cameraFollow) {
                console.log("Camera following planet");
                camera.lookAt(p.mesh.position);
            }
        }
    }
}

// Function to animate the scene/loop
function animate() {
    // arrow(); // Arrow orbit effect
    handlePlanets(planetsArray); // Handle planet controls
    if (!isPaused) {
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
    }
    sun.rotation.y += 0.0005;
    updateSelectedPlanetColor();
    controls.update();
    setToPlanetCameraMode();
    requestAnimationFrame(animate);
    updatePlanetPreviewScene();
    renderer.render(scene, camera);
}

const checkReadyToStart = setInterval(() => {
    if (readyToStart) {
        animate();
        clearInterval(checkReadyToStart);
    }
}, 100);

const raycaster = new THREE.Raycaster();

document.addEventListener("mousemove", onMouseMove);
function onMouseMove(event) {
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
                isCameraHelio = false;
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

function updateSelectedPlanetColor() {
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
}

function showControls(planet, i) {
    console.log(planet);
    updateTextureControls(planet.textureCode);
    const header = document.getElementById("offcanvasExampleLabel");
    header.innerHTML = `${planet.name} Controls`;
    const offcanvasElement = document.getElementById("offcanvasExample");
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
    if (offcanvasElement.lastElementChild.nodeName === "FORM") {
        -offcanvasElement.removeChild(offcanvasElement.lastElementChild);
    }
    const planetHTML = `<label for="planet-size">Mass</label>
            <input oninput="updatePlanetSize(${i})"
                type="range"
                class = "form-range"
                id="planet-size-${i}"
                name="planet-size"
                min=".5"
                max="4"
                step="0.1"
                value="${planetsArray[i].size}"
            />
            <label for="orbit-speed">Orbit Speed</label>
            <input oninput="updatePlanetSpeed(${i})"
                type="range"
                class = "form-range"
                id="orbit-speed-${i}"
                name="orbit-speed"
                min="1"
                max="10"
                step="0.1"
                value="${planetsArray[i].speed}"
            />
            <label for="planet-spin">Spin Speed</label>
            <input oninput="updatePlanetSpinSpeed(${i})"
                type="range"
                class = "form-range"
                id="planet-spin-${i}"
                name="planet-spin"
                min="1"
                max="12"
                step="0.1"
                value="${planetsArray[i].spinSpeed}"
            />
            <label for="planet-distance">Distance</label>
            <input oninput="updatePlanetDistance(${i})"
                type="range"
                class = "form-range"
                id="planet-distance-${i}"
                name="planet-distance"
                min="${planet.minmaxdist[0] / 10}"
                max="${planet.minmaxdist[1] / 10}"
                step="0.1"
                value="${planetsArray[i].distance / 10}"
            />`;
    const form = document.createElement("form");
    form.innerHTML = planetHTML;
    offcanvasElement.appendChild(form);
    bsOffcanvas.show();
}

const updatePlanetPreviewScene = () => {
    //! Lets try to minimise the amount of work done here
    //! We only want to update the preview scene when a new planet is raySelected
    // Remove only the planets from the previewScene
    previewScene.children = previewScene.children.filter((child) => {
        if (child.isMesh) {
            previewScene.remove(child);
            return false;
        }
        return true;
    });
    let previewPlanet;
    let selectedPlanet = planetsArray.find((p) => p.cameraFollow);
    if (selectedPlanet) {
        selectedPlanet = selectedPlanet.mesh;
        previewPlanet = selectedPlanet.clone();
    }
    if (previewPlanet) {
        previewPlanet.position.set(0, 0, 0);
        previewPlanet.scale.set(1.2, 1.2, 1.2);
        camera2.lookAt(previewPlanet.position);
        previewScene.add(previewPlanet);
    }
    littleRenderer.render(previewScene, camera2);
};

// Planet control texture menu functionality
let textureOptions = document.querySelectorAll(".texture-option");
textureOptions = Array.from(textureOptions).map((option) =>
    option.querySelector("button")
);

// Init texture menu with initial "hospitable" value
const checkImgsLoaded = setInterval(() => {
    if (imgsLoaded) {
        initImgTextureMenu();
        clearInterval(checkImgsLoaded);
        imgsLoaded = false; // Done with this now
    }
}, 100);

const initImgTextureMenu = () => {
    const textureOptions = document.querySelectorAll(".texture-img");
    for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
            textureOptions[i].removeChild(textureOptions[i].firstChild);
        }
        console.log("onit");
        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = imgs[i + 4].src;
    }
};

const setTextureGrid = (event) => {
    const selectedTexture = event.target.innerText;
    const textureGrid = document.querySelector(".row.row-cols-2.row.g-2");
    textureGrid.id = selectedTexture.toLowerCase(); // Set the id to the raySelected texture
    console.log(textureGrid.id);
    updateTextureControls();
};

for (let group of textureOptions) {
    group.addEventListener("click", setTextureGrid);
}

const updateTextureControls = (textureCode) => {
    const textureGrid = document.querySelector(".row.row-cols-2.row.g-2");
    const textureOptions = document.querySelectorAll(".texture-img");
    // Update texture menu to reflect current texture of raySelected planet, upon selection
    if (textureCode) {
        if (textureCode >= 1 && textureCode <= 4) {
            textureGrid.id = "gaseous";
        } else if (textureCode >= 5 && textureCode <= 8) {
            textureGrid.id = "hospitable";
        } else if (textureCode >= 9 && textureCode <= 12) {
            textureGrid.id = "inhospitable";
        } else if (textureCode >= 13 && textureCode <= 16) {
            textureGrid.id = "terrestrial";
        }
    }
    // Update the texture options based on the raySelected texture grid
    switch (textureGrid.id) {
        case "gaseous":
            for (let i = 0; i < textureOptions.length; i++) {
                if (textureOptions[i].hasChildNodes()) {
                    textureOptions[i].removeChild(textureOptions[i].firstChild);
                }

                const img = document.createElement("img");
                textureOptions[i].appendChild(img);
                img.src = imgs[i].src;
            }
            break;
        case "hospitable":
            for (let i = 0; i < textureOptions.length; i++) {
                if (textureOptions[i].hasChildNodes()) {
                    textureOptions[i].removeChild(textureOptions[i].firstChild);
                }

                const img = document.createElement("img");
                textureOptions[i].appendChild(img);
                img.src = imgs[i + 4].src;
            }
            break;
        case "inhospitable":
            for (let i = 0; i < textureOptions.length; i++) {
                if (textureOptions[i].hasChildNodes()) {
                    textureOptions[i].removeChild(textureOptions[i].firstChild);
                }

                const img = document.createElement("img");
                textureOptions[i].appendChild(img);
                img.src = imgs[i + 8].src;
            }
            break;
        case "terrestrial":
            for (let i = 0; i < textureOptions.length; i++) {
                if (textureOptions[i].hasChildNodes()) {
                    textureOptions[i].removeChild(textureOptions[i].firstChild);
                }

                const img = document.createElement("img");
                textureOptions[i].appendChild(img);
                img.src = imgs[i + 12].src;
            }
            break;
        default:
            break;
    }
};

// Selecting texture for planet
const textureImgOptions = document.querySelectorAll(".texture-img-select");
console.log(textureImgOptions);
textureImgOptions.forEach((option) => {
    option.addEventListener("mouseover", () => {
        option.style.backgroundColor = "#303030";
    });
    option.addEventListener("mouseout", () => {
        option.style.backgroundColor =
            "RGBA(var(--bs-dark-rgb), var(--bs-bg-opacity, 1))";
    });
    option.addEventListener("mousedown", () => {
        option.style.backgroundColor = "#1e1e1e";
        let imgIndex = option.firstElementChild.src
            .split("/")
            .pop()
            .split(".")[0];
        console.log(imgIndex);
        updatePlanetTexture(imgIndex - 1);
    });
    option.addEventListener("mouseup", () => {
        option.style.backgroundColor = "#303030";
    });
});

//! BOTH ORBIT AND SPIN SPEEDS RANGE INPUTS ARE SPAWNING IN AT 0 WHEN RESELECTING A PLANET
