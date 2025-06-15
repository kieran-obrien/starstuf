import TextureObj from "../classes/TextureObj";
import { imgLoader, textureLoader } from "./three-setup";

async function loadTextures() {
  const { planetTextures, planetImages } = await loadThreeJsTextures(
    imgLoader,
    textureLoader
  );
  console.log(
    "TextureTHREEjs and Texture HTML planetImages arrays:",
    planetTextures,
    planetImages
  );
  return { planetTextures, planetImages };
}

async function loadThreeJsTextures(imgLoader, textureLoader) {
  const planetTextures = [];
  const planetImages = [];
  const textureAmount = 16;

  for (let i = 1; i <= textureAmount; i++) {
    const texturePath = `./textures/${i}.png`;

    try {
      const texture = await new Promise((resolve, reject) => {
        textureLoader.load(texturePath, resolve, undefined, reject);
      });

      loadTextureImages(texturePath, imgLoader, planetImages); // for selection menu
      const pathNum = texturePath.split("/")[2].split(".")[0];
      const textureObj = new TextureObj(pathNum);
      planetTextures.push([texture, textureObj]);
    } catch (err) {
      console.log("Textures and images loaded, continue.");
      break;
    }
  }

  return { planetTextures, planetImages };
}

const loadTextureImages = (path, imgLoader, planetImages) => {
  imgLoader.load(
    path,
    (image) => {
      // On successful load
      planetImages.push(image);
    },
    undefined, // On progress, not needed
    (err) => {}
  );
};

// Init texture menu with initial "hospitable" value
function initImgTextureMenu(planetImages) {
  const textureOptions = document.querySelectorAll(".texture-img");
  for (let i = 0; i < textureOptions.length; i++) {
    if (textureOptions[i].hasChildNodes()) {
      textureOptions[i].removeChild(textureOptions[i].firstChild);
    }
    const img = document.createElement("img");
    textureOptions[i].appendChild(img);
    img.src = planetImages[i + 4].src;
  }
}

const startButton = document.getElementById("start-button");
startButton.style.display = "none";
startButton.addEventListener("click", hideLoadingScreen);
const loadingSpinner = document.getElementById("loader");

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 800);
}

function showStartButton() {
  loadingSpinner.style.display = "none";
  startButton.style.display = "block";
}

const { planetImages, planetTextures } = await loadTextures();
initImgTextureMenu(planetImages);

export { showStartButton, planetTextures, planetImages };
