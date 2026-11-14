// Preloader
window.addEventListener("load", function () {
  const preloader = document.querySelector(".preloader");
  preloader.classList.add("opacity-0");
  setTimeout(function () {
    preloader.style.display = "none";
  }, 1000);
});

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Aside Navbar
const nav = document.querySelector(".nav"),
  navList = nav.querySelectorAll("li"),
  totalNavList = navList.length,
  allSection = document.querySelectorAll(".section"),
  totalSection = allSection.length,
  navTogglerBtn = document.querySelector(".nav-toggler"),
  aside = document.querySelector(".aside");

function showSection(element) {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("active");
  }
  const target = element.getAttribute("href").split("#")[1];
  document.querySelector("#" + target).classList.add("active");
}

function activateSection(link) {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("back-section");
  }
  for (let j = 0; j < totalNavList; j++) {
    const a = navList[j].querySelector("a");
    if (a.classList.contains("active")) {
      allSection[j].classList.add("back-section");
    }
    a.classList.remove("active");
  }
  link.classList.add("active");
  showSection(link);
}

function linkForHash(hash) {
  for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    if (a.getAttribute("href") === hash) {
      return a;
    }
  }
  return null;
}

for (let i = 0; i < totalNavList; i++) {
  const a = navList[i].querySelector("a");
  a.addEventListener("click", function (e) {
    e.preventDefault();
    if (!this.classList.contains("active")) {
      activateSection(this);
      try {
        history.pushState(null, "", this.getAttribute("href"));
      } catch (err) {
        // History API unavailable; navigation still works.
      }
    }
    if (window.innerWidth < 1200 && aside.classList.contains("open")) {
      asideSectionTogglerBtn();
    }
  });
}

// Open the section named in the URL hash, and follow back/forward buttons
const initialLink = linkForHash(window.location.hash);
if (initialLink && !initialLink.classList.contains("active")) {
  activateSection(initialLink);
}
window.addEventListener("popstate", function () {
  const link = linkForHash(window.location.hash) || navList[0].querySelector("a");
  if (!link.classList.contains("active")) {
    activateSection(link);
  }
});

navTogglerBtn.addEventListener("click", () => {
  asideSectionTogglerBtn();
});

function asideSectionTogglerBtn() {
  aside.classList.toggle("open");
  navTogglerBtn.classList.toggle("open");
  navTogglerBtn.setAttribute("aria-expanded", aside.classList.contains("open"));
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.toggle("open");
  }
}
