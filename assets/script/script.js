// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Light / dark theme, remembered between visits
const THEME_KEY = "portfolio-theme";
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function currentTheme() {
  return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function renderThemeToggle() {
  const dark = currentTheme() === "dark";
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

themeToggle.addEventListener("click", function () {
  const next = currentTheme() === "dark" ? "light" : "dark";
  if (next === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {
    // Storage blocked; the choice just won't persist.
  }
  renderThemeToggle();
});
renderThemeToggle();

// Highlight the nav link for the section on screen
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [];
navLinks.forEach(function (link) {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) {
    sections.push({ link: link, section: section });
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        sections.forEach(function (item) {
          if (item.section === entry.target) {
            item.link.setAttribute("aria-current", "true");
          } else {
            item.link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  sections.forEach(function (item) {
    observer.observe(item.section);
  });
}

// Hero signal trace: a steady signal with one outlier flagged
(function drawSignal() {
  const signal = document.getElementById("signal");
  const path = document.getElementById("signal-path");
  if (!signal || !path) {
    return;
  }

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(393);
  const W = 1200;
  const H = 240;
  const N = 140;
  const OUTLIER = 70;

  const points = [];
  for (let i = 0; i < N; i++) {
    let y =
      150 +
      16 * Math.sin(i / 9) +
      9 * Math.sin(i / 3.7 + 1) +
      (rand() - 0.5) * 14;
    if (i === OUTLIER - 1) {
      y = 96;
    } else if (i === OUTLIER) {
      y = 36;
    } else if (i === OUTLIER + 1) {
      y = 104;
    }
    points.push([(i / (N - 1)) * W, y]);
  }

  path.setAttribute(
    "d",
    points
      .map(function (p, i) {
        return (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      })
      .join(" ")
  );

  const flag = points[OUTLIER];
  signal.style.setProperty("--fx", ((flag[0] / W) * 100).toFixed(2) + "%");
  signal.style.setProperty("--fy", ((flag[1] / H) * 100).toFixed(2) + "%");
  signal.style.setProperty("--reach", (flag[0] / W).toFixed(3));
  signal.classList.add("is-ready");

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      signal.classList.add("is-drawn");
    });
  });
})();
