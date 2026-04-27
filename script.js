(() => {
  // Highlight the active nav link for the current path.
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('a[data-nav="true"]').forEach((a) => {
    try {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path || (path === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    } catch {
      // If any malformed link, just skip.
    }
  });

  const supported = new Set(["en", "zh"]);
  const getLangFromUrl = () => {
    try {
      const lang = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
      return supported.has(lang) ? lang : null;
    } catch {
      return null;
    }
  };

  const getInitialLang = () => {
    // Highest priority: explicit URL parameter (works across pages even on file://).
    const urlLang = getLangFromUrl();
    if (urlLang) return urlLang;

    const saved = (localStorage.getItem("site_lang") || "").toLowerCase();
    if (supported.has(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("zh") ? "zh" : "en";
  };

  const setPressed = (lang) => {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
  };

  const applyTitle = (lang) => {
    const t = document.querySelector("title");
    if (!t) return;
    const key = lang === "zh" ? "data-title-zh" : "data-title-en";
    const next = t.getAttribute(key);
    if (next) document.title = next;
  };

  const updateInternalLinks = (lang) => {
    // Ensure navigation keeps the chosen language when changing pages.
    // We only rewrite same-site HTML links (index/projects/documents + footer).
    document.querySelectorAll('a[href]').forEach((a) => {
      const raw = a.getAttribute("href") || "";
      if (!raw) return;
      if (raw.startsWith("#")) return;
      if (/^https?:\/\//i.test(raw)) return;
      if (/^mailto:/i.test(raw)) return;
      if (!/\.html(\?|#|$)/i.test(raw)) return;

      try {
        const url = new URL(raw, location.href);
        url.searchParams.set("lang", lang);
        a.setAttribute("href", url.pathname.split("/").pop() + "?" + url.searchParams.toString());
      } catch {
        // Ignore malformed URLs.
      }
    });
  };

  const applyLang = (lang) => {
    if (!supported.has(lang)) lang = "en";
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
    document.documentElement.setAttribute("data-lang", lang);
    setPressed(lang);
    applyTitle(lang);

    updateInternalLinks(lang);
  };

  const initial = getInitialLang();
  // If language is specified via URL, also persist it for later.
  try {
    const urlLang = getLangFromUrl();
    if (urlLang) localStorage.setItem("site_lang", urlLang);
  } catch {
    // ignore
  }
  applyLang(initial);

  document.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target.closest("[data-lang]") : null;
    if (!target) return;
    const lang = (target.getAttribute("data-lang") || "").toLowerCase();
    if (!supported.has(lang)) return;
    localStorage.setItem("site_lang", lang);
    applyLang(lang);
  });
})();

/* ===== Personal Interests embeds ===== */

