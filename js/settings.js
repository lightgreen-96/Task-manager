// Модалка настроек
document.querySelectorAll("[data-settings-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.settingsTab;
    setActiveSettingsTab(tabName);
  });
});

function setActiveSettingsTab(tabName) {
  document.querySelectorAll("[data-settings-tab]").forEach((tab) => {
    tab.classList.remove("settingButton--active");
  });
  document.querySelectorAll("[data-settings-panel]").forEach((panel) => {
    panel.classList.remove("settingPanel--active");
  });

  document
    .querySelector(`[data-settings-tab="${tabName}"]`)
    .classList.add("settingButton--active");

  document
    .querySelector(`[data-settings-panel="${tabName}"]`)
    .classList.add("settingPanel--active");
}

//Открытие и закрытие модалки настроек
const settingsBtn = document.getElementById("settings");
const closeSettingBtn = document.querySelector(".settingsCloseButton");
const settingsOverlay = document.querySelector(".settingsModal__overlay");

settingsBtn.addEventListener("click", () => {
  openSettingsModal();
});

closeSettingBtn.addEventListener("click", () => {
  closeSettingsModal();
});

settingsOverlay.addEventListener("click", () => {
  closeSettingsModal();
});

function openSettingsModal() {
  document.getElementById("settingsModal").classList.add("settingsModal--open");
}

function closeSettingsModal() {
  document
    .getElementById("settingsModal")
    .classList.remove("settingsModal--open");
}
