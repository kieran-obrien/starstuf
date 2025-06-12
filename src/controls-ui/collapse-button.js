document.addEventListener("DOMContentLoaded", () => {
  const collapseElement = document.getElementById("user-interface");
  const iconElement = document.getElementById("main-menu-button");

  collapseElement.addEventListener("show.bs.collapse", () => {
    iconElement.classList.add("rotate");
  });

  collapseElement.addEventListener("hide.bs.collapse", () => {
    iconElement.classList.remove("rotate");
  });
});
