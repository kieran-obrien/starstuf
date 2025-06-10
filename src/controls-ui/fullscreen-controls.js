document.getElementById("fullscreen-btn").addEventListener("click", () => {
  const elem = document.documentElement; // Fullscreen the whole page

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err) => {
      console.error(`Fullscreen request failed: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});
