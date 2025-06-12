document.addEventListener("DOMContentLoaded", () => {
  const collapseElement = document.getElementById("user-interface");
  const iconElement = document.getElementById("main-menu-button");

  collapseElement.addEventListener("show.bs.collapse", () => {
    iconElement.classList.add("rotate");
    iconElement.classList.remove("unrotate");
    
  });

  collapseElement.addEventListener("hide.bs.collapse", () => {
    iconElement.classList.add("unrotate");
    iconElement.classList.remove("rotate");
  });
});
