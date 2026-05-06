gsap.registerPlugin(ScrollTrigger);

/* Animations */
gsap.from(".hero-title", {
  y: 100,
  opacity: 0,
  duration: 1
});

gsap.from(".hero-subtitle", {
  y: 50,
  opacity: 0,
  duration: 1,
  delay: 0.4
});

gsap.utils.toArray(".fade").forEach(section => {
  gsap.from(section, {
    scrollTrigger: section,
    y: 80,
    opacity: 0,
    duration: 1
  });
});

/* Mobile menu */
const menuToggle = document.getElementById("menuToggle");
const navRight = document.getElementById("navRight");
const navLinks = document.querySelectorAll(".nav-menu a");

if (menuToggle && navRight) {
  menuToggle.addEventListener("click", () => {
    navRight.classList.toggle("active");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (navRight) {
      navRight.classList.remove("active");
    }
  });
});

/* Counter animation */
const statNumbers = document.querySelectorAll(".stat-number");

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "+";

  let obj = { value: 0 };

  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = Math.floor(obj.value) + suffix;
    }
  });
}

if (document.querySelector(".stats-section")) {
  ScrollTrigger.create({
    trigger: ".stats-section",
    start: "top 80%",
    once: true,
    onEnter: () => {
      statNumbers.forEach(animateCounter);
    }
  });
}

/* Translations */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`);
    const translations = await response.json();

    i18next.init(
      {
        lng: lang,
        resources: {
          [lang]: {
            translation: translations
          }
        }
      },
      updateContent
    );
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.innerText = i18next.t(key);
  });
}

function changeLang(lang, btn) {
  loadTranslations(lang);

  document.querySelectorAll(".lang-btn").forEach(b => {
    b.classList.remove("active");
  });

  if (btn) {
    btn.classList.add("active");
  }
}

/* Default language */
loadTranslations("en");