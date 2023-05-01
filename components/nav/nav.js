// Component Nav – start
(function() {
  /* Nav – start */
  function closeDropNavClickedOutside(e) {
    // Close the nav when clicking outside
    if (!e.target.closest(".n-nav li")) {
      document.querySelectorAll(".n-nav li").forEach((el) => {
        el.removeAttribute("aria-expanded");
      });
      if (document.querySelector(".n-nav :focus")) {
        document.querySelector(".n-nav :focus").blur();
      }
    }
  }

  function isDesktop(nav) {
    // Checks the UL sub nav element
    return !!getComputedStyle(nav).getPropertyValue("--desktop");
  }
  let navAnimating = false;

  function dropNavBlur(e) {
    var this_nav = e.target.closest(".n-nav");
    if (navAnimating || !e.relatedTarget) {
      return;
    }
    e.stopPropagation();
    let el = e.target;
    let item = el.tagName === "LI" ? el.querySelector("ul") : el.parentElement.querySelector("ul");
    if (!this_nav.contains(e.relatedTarget) || (isDesktop(this_nav) && !!e.relatedTarget && !closestElement(e.relatedTarget, this_nav))) {
      // if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
      this_nav.querySelectorAll("li").forEach((el) => {
        el.removeAttribute("aria-expanded");
      });
      return;
    }
    if (item) {
      if (item.parentNode.parentNode.querySelector("ul [aria-expanded]")) {
        // To do: Unless it's the first/last item and user has back/forward tabbed away from it?
        return;
      }
      item.parentElement.removeAttribute("aria-expanded");
    }
    // Close neighboring parent nav's sub navs.
    el = e.target;
    var target_parent = el.closest("[aria-haspopup]");
    if (target_parent) {
      // Skip if it's a top-level-only item
      target_parent.querySelectorAll("li[aria-expanded]").forEach((el) => {
        // Disable active grandchildren
        el.removeAttribute("aria-expanded");
      });
    }
    el = e.target.parentNode;
    if (!el.nextElementSibling && // last item
      el.parentNode.parentNode.nodeName === "LI" && // of third-level nav
      !el.parentNode.parentNode.nextElementSibling) {
      el.parentNode.parentNode.removeAttribute("aria-expanded");
    }
  }

  function dropNavFocus(e) {
    // Close focused third level child when focus moves to another top-level item
    e.stopPropagation();
    var el = e.target.closest(".n-nav > ul > li");
    // To do: on LI focus, make it aria-expanded and focus its a
    if (navAnimating) {
      return;
    }
    [
      [].slice.call(el.parentElement.children),
      [].slice.call(e.target.parentElement.parentElement.children),
      [].slice.call(e.target.parentElement.parentElement.parentElement.parentElement.children),
    ].forEach((el) => {
      el.forEach((el) => {
        el.removeAttribute("aria-expanded");
      });
    });
    el.setAttribute("aria-expanded", true);
    // 		openItem(el.querySelector('ul'));
    if (el.parentNode.parentNode.getAttribute("aria-haspopup")) {
      el.parentNode.parentNode.setAttribute("aria-expanded", true);
    }
    el.querySelectorAll("li[aria-expanded]").forEach((el) => {
      // Hide grandchildren
      el.removeAttribute("aria-expanded");
    });
    // Make current focused item's ancestors visible
    el = e.target;
    el.parentNode.setAttribute("aria-expanded", true);
    var grand_parent = el.parentElement.parentElement.parentElement;
    if (grand_parent.tagName === "LI") {
      grand_parent.setAttribute("aria-expanded", true);
    }
  }
  var closeDropNavClickedOutsideEnabled = false;
  
  const getDuration = () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? 200 : 0;
  
  let closeItem = (item) => {
    navAnimating = true;
    item.style.overflow = "hidden";
    item.parentElement.setAttribute("aria-expanded", true);
    item.animate([{ height: `${item.scrollHeight}px` }, { height: 0 }], getDuration()).onfinish = () => {
      item.removeAttribute("style");
      item.parentElement.removeAttribute("aria-expanded");
      navAnimating = false;
      item.querySelectorAll("[aria-expanded]").forEach((el) => {
        el.removeAttribute("aria-expanded");
      });
    };
  };
  let openItem = (item) => {
    navAnimating = true;
    item.style.overflow = "hidden";
    item.parentElement.setAttribute("aria-expanded", true);
    item.animate([{ height: 0 }, { height: `${item.scrollHeight}px` }], getDuration()).onfinish = () => {
      item.removeAttribute("style");
      navAnimating = false;
    };
  };
  let clickEvent = (e) => {
    e.stopPropagation();
    // To do: also ancestors, also close when open
    let el = e.target;
    var this_nav = el.closest(".n-nav");
    this_nav.removeEventListener("focusout", dropNavBlur);
    if (this_nav.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    let item = el.tagName === "LI" ? el.querySelector("ul") : el.parentElement.querySelector("ul");
    if (isDesktop(this_nav)) {
      if (el.getAttribute("aria-expanded")) {
        if (el.querySelector("a:focus")) {
          // 						el.querySelector('a:focus').blur();
        } else {
          if (isDesktop(this_nav)) {
            el.removeAttribute("aria-expanded");
          } else {
            closeItem(item);
          }
        }
      } else {
        [].slice.call(el.parentElement.children).forEach((item) => {
          item.removeAttribute("aria-expanded");
          let old_item_open_child = item.querySelector("[aria-expanded]");
          if (old_item_open_child) {
            old_item_open_child.removeAttribute("aria-expanded");
          }
        });
        el.setAttribute("aria-expanded", true);
        if (!isDesktop(this_nav)) {
          openItem(item);
        }
      }
    } else {
      if (item.parentNode.hasAttribute("aria-expanded")) {
        closeItem(item);
      } else {
        // If new item is top level, close another top level item, if any is open
        if (item.parentElement.parentElement.matches("ul")) {
          // It's top level, To do: also on secondary level, close open sibling
          let old_item = item.parentElement.closest("ul").querySelector('[aria-expanded="true"] > ul');
          if (old_item) {
            closeItem(old_item);
          }
        }
        openItem(item);
      }
    }
    this_nav.addEventListener("focusout", dropNavBlur);
  };

  function checkSides(ul, menubar) {
    if (getComputedStyle(ul).direction !== 'rtl') {
      ul.classList.remove("n-right-overflow");
      ul.style.removeProperty("--n-right-overflow");
      //		var rect = ul.getBoundingClientRect(); // Firefox doesn't preserve this var
      if (ul.getBoundingClientRect().left > document.body.offsetWidth - (ul.getBoundingClientRect().left + ul.getBoundingClientRect().width)) {
        if (ul.getBoundingClientRect().right > window.innerWidth) {
          ul.style.setProperty("--n-right-overflow", window.innerWidth - ul.getBoundingClientRect().right + "px");
          ul.classList.add("n-right-overflow");
        }
        ul.classList.add("n-left-side");
      } else {
        ul.classList.remove("n-left-side");
      }
    }
  }

  function initNav(el) {
    // Delete all trigger inputs, add tabindex=0 to each li
    el.querySelectorAll("input").forEach((el) => {
      el.outerHTML = "";
    });
    el.querySelectorAll("li > a").forEach((el) => {
      el.setAttribute("tabindex", 0);
    });
    if (!el.closest(".n-nav.n-nav--drop")) {
      // The rest is for drop nav only
      return;
    }
    if (!closeDropNavClickedOutsideEnabled) {
      window.addEventListener("touchend", closeDropNavClickedOutside);
      window.addEventListener("mouseup", closeDropNavClickedOutside);
      closeDropNavClickedOutsideEnabled = true;
    }
    el.addEventListener("keyup", (e) => {
      // Check for sibling or children to expand on control keys Left/Right/etc
      if (e.key === "Escape") {
        e.target.closest(".n-nav").querySelectorAll("li").forEach((el) => {
          el.removeAttribute("aria-expanded");
        });
        document.activeElement.blur();
      }
    });
    let menubar = el;
    el.querySelectorAll("li").forEach((el) => {
      let ul = el.querySelector("ul");
      if (ul) {
        el.setAttribute("aria-haspopup", true);
        if (el.children[0].nodeName === "UL") {
          el.insertBefore(el.children[1], el.children[0]); // Swap 'a' with 'ul'
        }
      }
    });
    el.addEventListener("mousedown", clickEvent);
    el.addEventListener("focusin", dropNavFocus);
    el.addEventListener("focusout", dropNavBlur);
    window.requestAnimationFrame(() => {
      // Give the browser time to update
      el.querySelectorAll("ul").forEach((ul) => {
        checkSides(ul, menubar);
      });
    });
  }
  window.addEventListener("resize", function(e) {
    document.querySelectorAll(".n-nav.n-nav--drop ul").forEach((menubar) => {
      menubar.querySelectorAll("ul").forEach((ul) => {
        checkSides(ul, menubar);
      });
    });
  });
  /* Nav – end */
  let init = (host) => {
    host.querySelectorAll(".n-nav:not([data-ready]) > ul:not([role])").forEach((el) => {
      initNav(el);
      el.closest(".n-nav").dataset.ready = true;
    });
  };
  nui.registerComponent("nav", init);
})();
// Component Nav – end