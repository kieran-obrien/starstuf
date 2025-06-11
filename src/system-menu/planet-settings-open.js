import { planetsArray } from "../main";
import { showControls } from "../planet-menu/off-canvas-controls";

const openPlanetSettings = (event) => {
  const planetIndex = event.target.id - 1;
  for (let p of planetsArray) {
    p.controlsSelected = false;
  }
  planetsArray[planetIndex].controlsSelected = true;
  showControls(planetsArray[planetIndex], planetIndex);
};

export default openPlanetSettings;
