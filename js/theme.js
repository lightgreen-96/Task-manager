//Смена темы (темная/светлая)
document.querySelectorAll("[data-theme-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.themeTarget;
    if (document.documentElement.dataset.theme === target) return;
    document.documentElement.dataset.theme = target;
    localStorage.setItem("theme", target);
    updateActiveThemeButton();
  });
});

function updateActiveThemeButton() {
  const currentTheme = document.documentElement.dataset.theme;
  document.querySelectorAll("[data-theme-target]").forEach((btn) => {
    const target = btn.dataset.themeTarget;
    if (target === currentTheme) {
      btn.classList.add("theme--active");
    } else {
      btn.classList.remove("theme--active");
    }
  });
}
