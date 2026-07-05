const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const currentYear = document.querySelector("#current-year");
const siteHeader = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");
const screenshotsTrack = document.querySelector(".screenshots-track");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");

document.documentElement.classList.add("js-enabled");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (screenshotsTrack && carouselPrev && carouselNext) {
  const scrollScreenshots = (direction) => {
    const scrollAmount = screenshotsTrack.clientWidth * 0.82;
    screenshotsTrack.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });
  };

  carouselPrev.addEventListener("click", () => scrollScreenshots(-1));
  carouselNext.addEventListener("click", () => scrollScreenshots(1));
}
