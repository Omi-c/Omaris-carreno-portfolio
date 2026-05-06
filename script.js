gsap.registerPlugin(ScrollTrigger);

/* Animations */
gsap.from(".hero-title, .project-hero-title", {
  y: 100,
  opacity: 0,
  duration: 1
});

gsap.from(".hero-subtitle, .project-hero-subtitle", {
  y: 50,
  opacity: 0,
  duration: 1,
  delay: 0.5
});

gsap.utils.toArray(".fade").forEach(section => {
  gsap.from(section, {
    scrollTrigger: section,
    y: 100,
    opacity: 0,
    duration: 1
  });
});

/* Elements */
const toggleBtn = document.getElementById("toggleWebsitesBtn");
const hiddenSites = document.querySelectorAll(".hidden-site");
const menuToggle = document.getElementById("menuToggle");
const navRight = document.getElementById("navRight");
const navLinks = document.querySelectorAll(".nav-menu a");

let expanded = false;
let translationsCache = {};
let currentLang = localStorage.getItem("lang") || "en";
let i18nReady = false;

/* Translation helpers */
async function getTranslations(lang) {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  const response = await fetch(`locales/${lang}.json`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load locales/${lang}.json`);
  }

  const translations = await response.json();
  translationsCache[lang] = translations;
  return translations;
}

function updateContent() {
  if (!window.i18next || !i18nReady) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = i18next.t(key);

    if (value && value !== key) {
      el.textContent = value;
    }
  });

  if (toggleBtn) {
    toggleBtn.textContent = expanded
      ? i18next.t("showLessWebsites")
      : i18next.t("showMoreWebsites");
  }
}

function setActiveLangButton(lang) {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const targetBtn = document.querySelector(
    `.lang-btn[onclick*="changeLang('${lang}'"]`
  );

  if (targetBtn) {
    targetBtn.classList.add("active");
  }
}

async function initTranslations() {
  try {
    const translations = await getTranslations(currentLang);

    await i18next.init({
      lng: currentLang,
      fallbackLng: "en",
      resources: {
        [currentLang]: {
          translation: translations
        }
      }
    });

    i18nReady = true;
    updateContent();
    setActiveLangButton(currentLang);
  } catch (error) {
    console.error("Translation init error:", error);

    try {
      currentLang = "en";
      localStorage.setItem("lang", "en");

      const fallbackTranslations = await getTranslations("en");

      await i18next.init({
        lng: "en",
        fallbackLng: "en",
        resources: {
          en: {
            translation: fallbackTranslations
          }
        }
      });

      i18nReady = true;
      updateContent();
      setActiveLangButton("en");
    } catch (fallbackError) {
      console.error("Fallback translation init error:", fallbackError);
    }
  }
}

async function changeLang(lang, btn) {
  try {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    document.querySelectorAll(".lang-btn").forEach(b => {
      b.classList.remove("active");
    });

    if (btn) {
      btn.classList.add("active");
    }

    const translations = await getTranslations(lang);

    if (!i18nReady) {
      await i18next.init({
        lng: lang,
        fallbackLng: "en",
        resources: {
          [lang]: {
            translation: translations
          }
        }
      });

      i18nReady = true;
    } else {
      if (!i18next.hasResourceBundle(lang, "translation")) {
        i18next.addResourceBundle(lang, "translation", translations, true, true);
      }

      await i18next.changeLanguage(lang);
    }

    updateContent();
  } catch (error) {
    console.error(`Error changing language to "${lang}":`, error);
  }
}

/* Make function available to inline onclick */
window.changeLang = changeLang;

/* Init */
initTranslations();

/* Websites toggle */
if (toggleBtn && hiddenSites.length) {
  toggleBtn.addEventListener("click", () => {
    if (!expanded) {
      hiddenSites.forEach(site => {
        site.style.display = "flex";
      });
      expanded = true;
    } else {
      hiddenSites.forEach(site => {
        site.style.display = "none";
      });
      expanded = false;
    }

    if (window.i18next && i18nReady) {
      toggleBtn.textContent = expanded
        ? i18next.t("showLessWebsites")
        : i18next.t("showMoreWebsites");
    }
  });
}

/* Mobile menu */
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