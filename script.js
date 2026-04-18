const footerYear = document.querySelector("[data-year]");
const revealNodes = document.querySelectorAll(".reveal");
const nav = document.querySelector("[data-nav]");
const skipLink = document.querySelector(".skip-link");
const mainContent = document.getElementById("main-content");

if (skipLink && mainContent) {
  skipLink.addEventListener("click", () => {
    window.requestAnimationFrame(() => {
      mainContent.focus({ preventScroll: true });
    });
  });
}

if (nav) {
  let scheduled = false;
  const syncNav = () => {
    nav.dataset.scrolled = window.scrollY > 14 ? "true" : "false";
    scheduled = false;
  };

  const onScroll = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(syncNav);
    }
  };

  syncNav();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("[data-copy-email]").forEach((btn) => {
  const email = btn.getAttribute("data-copy-email");
  const feedbackId = btn.getAttribute("data-copy-feedback");
  const feedback = feedbackId ? document.getElementById(feedbackId) : null;
  const defaultLabel = btn.textContent?.trim() || "Copy";
  let resetTimer = 0;

  if (!email) {
    return;
  }

  btn.addEventListener("click", async () => {
    window.clearTimeout(resetTimer);

    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = "Copied";
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = "Address copied to clipboard.";
      }
      resetTimer = window.setTimeout(() => {
        btn.textContent = defaultLabel;
        if (feedback) {
          feedback.hidden = true;
          feedback.textContent = "";
        }
      }, 2600);
    } catch {
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = "Could not copy automatically—select the address above.";
      }
      resetTimer = window.setTimeout(() => {
        if (feedback) {
          feedback.hidden = true;
          feedback.textContent = "";
        }
      }, 5500);
    }
  });
});
