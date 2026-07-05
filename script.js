const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const currentYearElements = document.querySelectorAll("#current-year");
const siteHeader = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");
const counterElements = document.querySelectorAll("[data-counter]");
const screenshotCarousels = document.querySelectorAll(".screenshots-carousel");

document.documentElement.classList.add("js-enabled");

currentYearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

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

const animateCounter = (element) => {
  const target = Number(element.dataset.target || "0");
  const suffix = element.dataset.suffix || "";
  const duration = 900;
  const startTime = performance.now();

  const update = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * easedProgress);

    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

if (counterElements.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((element) => counterObserver.observe(element));
} else {
  counterElements.forEach((element) => {
    const suffix = element.dataset.suffix || "";
    element.textContent = `${element.dataset.target || "0"}${suffix}`;
  });
}

screenshotCarousels.forEach((carousel) => {
  const screenshotsTrack = carousel.querySelector(".screenshots-track");
  const carouselPrev = carousel.querySelector(".carousel-prev");
  const carouselNext = carousel.querySelector(".carousel-next");

  if (!screenshotsTrack || !carouselPrev || !carouselNext) {
    return;
  }

  const scrollScreenshots = (direction) => {
    const scrollAmount = screenshotsTrack.clientWidth * 0.86;
    screenshotsTrack.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });
  };

  carouselPrev.addEventListener("click", () => scrollScreenshots(-1));
  carouselNext.addEventListener("click", () => scrollScreenshots(1));
});
