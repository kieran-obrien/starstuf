const getIcons = () => {
  const icons = document.querySelectorAll(".icon");
  icons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      icon.style.color = "#808080";
    });
    icon.addEventListener("mouseout", () => {
      icon.style.color = "#ffffff";
    });
    icon.addEventListener("mousedown", () => {
      icon.style.color = "#444444";
    });
    icon.addEventListener("mouseup", () => {
      icon.style.color = "#808080";
    });
  });
  const creditsHelpIcons = document.querySelectorAll(".credits-help-icon");
  creditsHelpIcons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      icon.style.color = "#808080";
    });
    icon.addEventListener("mouseout", () => {
      icon.style.color = "#ffffff";
    });
    icon.addEventListener("mousedown", () => {
      icon.style.color = "#444444";
    });
    icon.addEventListener("mouseup", () => {
      icon.style.color = "#808080";
    });
  });
};

getIcons();
 