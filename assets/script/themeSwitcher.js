// Theme Switch (colour + light/dark), remembered between visits
const links = document.querySelectorAll(".alternate-style");
const totalLinks = links.length;
const COLOR_KEY = "portfolio-color";
const MODE_KEY = "portfolio-mode";

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Storage blocked (private mode, etc.); the setting just won't persist.
  }
}

function loadSetting(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function setActiveStyle(color) {
  for (let i = 0; i < totalLinks; i++) {
    if (color === links[i].getAttribute("title")) {
      links[i].removeAttribute("disabled");
    } else {
      links[i].setAttribute("disabled", "true");
    }
  }
  saveSetting(COLOR_KEY, color);
}

const swatches = document.querySelectorAll(".theme-swatch");
for (let i = 0; i < swatches.length; i++) {
  swatches[i].addEventListener("click", function () {
    setActiveStyle(this.dataset.theme);
  });
}

// Light / Dark Mode switch
const modeSwitch = document.querySelectorAll(".mode-switch");
const totalModeSwitch = modeSwitch.length;

function setMode(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  for (let i = 0; i < totalModeSwitch; i++) {
    modeSwitch[i].checked = modeSwitch[i].value === mode;
  }
  saveSetting(MODE_KEY, mode);
}

for (let i = 0; i < totalModeSwitch; i++) {
  modeSwitch[i].addEventListener("change", function () {
    setMode(this.value);
  });
}

// Theme panel open/close
const themeToggle = document.querySelector(".toggle-theme-switcher");
themeToggle.addEventListener("click", () => {
  const panel = document.querySelector(".theme-switch");
  panel.classList.toggle("open");
  themeToggle.setAttribute("aria-expanded", panel.classList.contains("open"));
});

// Restore saved choices
const savedColor = loadSetting(COLOR_KEY);
if (savedColor) {
  for (let i = 0; i < totalLinks; i++) {
    if (links[i].getAttribute("title") === savedColor) {
      setActiveStyle(savedColor);
      break;
    }
  }
}
if (loadSetting(MODE_KEY) === "dark") {
  setMode("dark");
}
