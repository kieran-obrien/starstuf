import TextureObj from "./classes/TextureObj";

// Load the textures/planetImages
let planetImagesLoaded = false;
const loadThreeJsTextures = (
  counter,
  planetTextures,
  imgLoader,
  textureLoader,
  planetImages
) => {
  return new Promise((resolve, reject) => {
    const texturePath = `./textures/${counter}.png`;
    textureLoader.load(
      texturePath,
      (texture) => {
        // On successful load
        //console.log("Texture loaded successfully:", texturePath);
        loadTextureImages(texturePath, imgLoader, planetImages); // Images for selection menu
        const pathNum = texturePath.split("/")[2].split(".")[0];
        const textureObj = new TextureObj(pathNum); // Obj for selection menu
        planetTextures.push([texture, textureObj]);

        // Recursively load the next texture
        loadThreeJsTextures(
          counter + 1,
          planetTextures,
          imgLoader,
          textureLoader,
          planetImages
        )
          .then(resolve) // Resolve when all textures are loaded
          .catch(reject); // Reject if an error occurs
      },
      undefined, // On progress, not needed
      (err) => {
        // On error (e.g., texture not found, no more to load)
        console.log("Textures and images loaded, continue.")
        resolve([planetTextures, planetImages]); // Resolve with the final state
      }
    );
  });
};

const loadTextureImages = (path, imgLoader, planetImages) => {
  imgLoader.load(
    path,
    (image) => {
      // On successful load
      planetImages.push(image);
    },
    undefined, // On progress, not needed
    (err) => {
      // On error (e.g., img not found, no more to load)
      console.log("Finished loading images");
    }
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

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.opacity = "0"; // Fade out effect
  setTimeout(() => {
    loadingScreen.style.display = "none"; // Remove from view
  }, 500); // Wait for fade-out animation
}

export { loadThreeJsTextures, initImgTextureMenu, hideLoadingScreen };
