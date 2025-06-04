import { planetImages } from "../core/texture-img-loader";
import { updatePlanetTexture } from "./off-canvas-controls";

// Planet control texture menu functionality
let textureOptions = document.querySelectorAll(".texture-option");
textureOptions = Array.from(textureOptions).map((option) =>
  option.querySelector("button")
);

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
        img.src = planetImages[i].src;
      }
      break;
    case "hospitable":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = planetImages[i + 4].src;
      }
      break;
    case "inhospitable":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = planetImages[i + 8].src;
      }
      break;
    case "terrestrial":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = planetImages[i + 12].src;
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
    let imgIndex = option.firstElementChild.src.split("/").pop().split(".")[0];
    console.log(imgIndex);
    updatePlanetTexture(imgIndex - 1);
  });
  option.addEventListener("mouseup", () => {
    option.style.backgroundColor = "#303030";
  });
});

const nameInput = document.getElementById("planet-name-input");
nameInput.addEventListener("input", () => {
  const offCanvasTitle = document.getElementById("offcanvasTitle");
  if (nameInput.value === "") {
    offCanvasTitle.innerHTML = `Planet ${currentControlPlanet.index}`;
    return;
  }
  currentControlPlanet.name = nameInput.value;
  offCanvasTitle.innerHTML = currentControlPlanet.name;
});

export default updateTextureControls;
