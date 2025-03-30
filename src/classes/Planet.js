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
    this.uuid = mesh.uuid;
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
    this.index = 0;
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

export default Planet;
