export default function adjustOffcanvasPosition() {
  console.log("ADJUST canvas pos");
  const planetMenu = document.getElementById("offcanvas-planet-menu");
  const systemMenu = document.getElementById("offcanvas-system-menu");

  // Remove any previous positioning classes
  planetMenu.classList.remove(
    "offcanvas-start",
    "offcanvas-end",
    "offcanvas-top",
    "offcanvas-bottom"
  );
  systemMenu.classList.remove(
    "offcanvas-start",
    "offcanvas-end",
    "offcanvas-top",
    "offcanvas-bottom"
  );
  if (window.innerWidth <= 768) {
    // For mobile: show from bottom
    planetMenu.classList.add("offcanvas-bottom");
    systemMenu.classList.add("offcanvas-bottom");
  } else {
    // For desktop: show from right
    planetMenu.classList.add("offcanvas-start");
    systemMenu.classList.add("offcanvas-start");
  }
}
