const planetCountRangeInput = document.getElementById("planet-count");
import { planetsArray } from "../main";

planetCountRangeInput.addEventListener("change", () => {
  updatePlanetListTable(planetsArray);
});

const updatePlanetListTable = () => {
  for (let i = 1; i < planetsArray.length + 1; i++) {
    let planetListTableRow = document.getElementById(
      `planets-list-table-r${i}`
    );
    if (!planetListTableRow) {
      console.warn("Couldn't find #planets-list-table-r1 in the DOM");
      return;
    }
    console.log("updating...");
    planetListTableRow.children[1].textContent = planetsArray[i - 1].name;
    console.log(planetsArray[i - 1].name);
    planetListTableRow.children[2].textContent = planetsArray[i - 1].size;
    const isInOrbit = planetsArray[i - 1].inOrbit ? "✓" : "✗";
    planetListTableRow.children[3].textContent = isInOrbit;
    const cameraFocusIconClass = planetsArray[i - 1].cameraFollow
      ? "ri-video-on-fill icon system-icon"
      : "ri-video-off-fill icon system-icon";
    planetListTableRow.children[4].children[0].className = cameraFocusIconClass;
  }
};

export { planetCountRangeInput, updatePlanetListTable };
