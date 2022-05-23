// Component Accordion
(function () {
  const animate_options = { easing: "ease-in-out", duration: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? 200 : 0 };

  const openAccordion = (el) => {
    window.requestAnimationFrame(() => {
      el.style.height = 0;
      el.style.overflow = "hidden";
      el.parentNode.setAttribute("aria-expanded", true);
      el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options).onfinish = () => {
        el.style.height = el.style.overflow = "";
      };
    });
  };

  const closeAccordion = (el) => {
    window.requestAnimationFrame(() => {
      // el.parentNode.open = true;
      el.style.overflow = "hidden";
      el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options).onfinish = () => {
        el.style.height = el.style.overflow = "";
        el.parentNode.removeAttribute("aria-expanded");
      };
    });
  };

  const toggleAccordion = (e) => {
    let el = e.target.parentNode;

    if (!el.getAttribute('aria-expanded')) {
      openAccordion(e.target.nextElementSibling);
    } else {
      closeAccordion(e.target.nextElementSibling);
    }
    let container = el.closest(".n-accordion__popin");
    if (el.parentNode.classList.contains("n-accordion__group") || container) {
      el.parentNode.querySelectorAll(":scope > .n-accordion[aria-expanded]").forEach((el2) => {
        if (el2 !== el) {
          closeAccordion(el2.querySelector(":scope > .n-accordion__content"));
        }
      });
    }
    if (container) {
      let row = Math.floor(([...container.children].indexOf(el) / getComputedStyle(container).getPropertyValue("--n-popin-columns")) * 1) + 2;
      container.style.setProperty("--n-popin-open-row", row);
    }
  };

  function init(host) {
    host.querySelectorAll(".n-accordion:not([data-ready]) > .n-accordion__label").forEach((el) => {
      el.addEventListener("click", toggleAccordion);
      el.parentElement.querySelector(":scope > input")?.remove(); // Remove CSS-only solution
      el.parentNode.dataset.ready = true;
    });
  }

  registerComponent("accordion", init);
})();
