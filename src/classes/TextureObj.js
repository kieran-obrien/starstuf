class TextureObj {
  constructor(path) {
    this.pathNum = +path; // Index for texture png in textures dir
    this.type = this.init(this.pathNum); // Type of planetary texture e.g. Terrestrial
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

export default TextureObj;
