import { planetsArray } from "../main";
import { updateSystemTable } from "./system-table";

const focusCameraOnPlanet = (event) => {
  if (!planetsArray[event.target.id - 1].inOrbit === false) {
    // Only switch cam if selected planet in system
    for (let p of planetsArray) {
      p.cameraFollow = false;
      console.log(event.target.id);
      console.log(p.index);
      if (p.index === Number(event.target.id) && p.inOrbit)
        p.cameraFollow = true;
      console.log(p.cameraFollow);
      updateSystemTable();
    }
  }
};

export default focusCameraOnPlanet;
