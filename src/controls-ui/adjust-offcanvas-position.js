export default function adjustOffcanvasPosition() {
  console.log("ADJUST canvas pos");
  const planetMenu = document.getElementById("offcanvas-planet-menu");
  const systemMenu = document.getElementById("offcanvas-system-menu");

  // Remove any previous positioning classes
  planetMenu.classList.remove(
    "offcanvas-start",
    "offcanvas-end",
    "offcanvas-top",
    "offcanvas-bottom",
    "mobile-offcanvas"
  );
  systemMenu.classList.remove(
    "offcanvas-start",
    "offcanvas-end",
    "offcanvas-top",
    "offcanvas-bottom",
    "mobile-offcanvas"
  );
  if (window.innerWidth <= 768) {
    // For mobile: show from bottom
    planetMenu.classList.add("offcanvas-bottom", "mobile-offcanvas");
    systemMenu.classList.add("offcanvas-bottom", "mobile-offcanvas");
  } else {
    // For desktop: show from right
    planetMenu.classList.add("offcanvas-start");
    systemMenu.classList.add("offcanvas-start");
  }
}
