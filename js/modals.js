document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    scheduleModal.classList.remove("modal--open");
    pinnedModal.classList.remove("modal--open");
    closeSettingsModal();
  }
});
