//import { imgLoader, textureLoader } from "./main";
import TextureObj from "./classes/TextureObj";

// Load the textures/imgs
let imgsLoaded = false;
const loadThreeJsTextures = (
  counter,
  planetTextures,
  imgLoader,
  textureLoader,
  imgs
) => {
  return new Promise((resolve, reject) => {
    const texturePath = `./textures/${counter}.png`;
    textureLoader.load(
      texturePath,
      (texture) => {
        // On successful load
        //console.log("Texture loaded successfully:", texturePath);
        loadTextureImages(texturePath, imgLoader, imgs); // Images for selection menu
        const pathNum = texturePath.split("/")[2].split(".")[0];
        const textureObj = new TextureObj(pathNum); // Obj for selection menu
        planetTextures.push([texture, textureObj]);

        // Recursively load the next texture
        loadThreeJsTextures(
          counter + 1,
          planetTextures,
          imgLoader,
          textureLoader,
          imgs
        )
          .then(resolve) // Resolve when all textures are loaded
          .catch(reject); // Reject if an error occurs
      },
      undefined, // On progress, not needed
      (err) => {
        // On error (e.g., texture not found, no more to load)
        console.log("Textures and images loaded, continue.")
        resolve([planetTextures, imgs]); // Resolve with the final state
      }
    );
  });
};

const loadTextureImages = (path, imgLoader, imgs) => {
  imgLoader.load(
    path,
    (image) => {
      // On successful load
      imgs.push(image);
    },
    undefined, // On progress, not needed
    (err) => {
      // On error (e.g., img not found, no more to load)
      console.log("Finished loading images");
    }
  );
};

export { loadThreeJsTextures };
