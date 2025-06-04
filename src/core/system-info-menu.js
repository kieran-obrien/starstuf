const planetCountRangeInput = document.getElementById("planet-count");
import { planetsArray } from "../main";

planetCountRangeInput.addEventListener("change", () => {
  updatePlanetListTable(planetsArray);
});

const updatePlanetListTable = (planets) => {
  for (let i = 1; i < planets.length + 1; i++) {
    let planetListTableRow = document.getElementById(
      `planets-list-table-r${i}`
    );
    if (!planetListTableRow) {
      console.warn("Couldn't find #planets-list-table-r1 in the DOM");
      return;
    }
    console.log("updating...");
    planetListTableRow.children[1].textContent = planets[i - 1].name;
    planetListTableRow.children[2].textContent = planets[i - 1].size;
    planetListTableRow.children[3].textContent = planets[i - 1].inOrbit;
  }
};

export { planetCountRangeInput, updatePlanetListTable };
