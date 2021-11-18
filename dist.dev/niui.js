window.nui = (() => {
'use strict';

//→ niui-core.js:
'use strict';

/* niui by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */
document.body.dataset.nuiJs = true;
if (!!window["chrome"]) {
  document.body.dataset.nuiChrome = true;
}
if (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/)) {
  document.body.dataset.nuiSafari = true;
}
if (navigator.platform.match(/Mac/) || navigator.platform.match(/iPhone/) || navigator.platform.match(/iPod/) || navigator.platform.match(/iPad/)) {
  document.body.dataset.nuiApple = true; // Apple devices: left-hand ⤫ button, disappearing thin scrollbars
}
var is_iPad = !!navigator.platform.match(/iPad/);
// DOM functions – start
function q(selector) {
  return document.querySelector(selector);
}

function qa(selector) {
  return document.querySelectorAll(selector);
}

function addClass(el, className) {
  el.classList.add(className);
}

function removeClass(el, className) {
  // To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
  el.classList.remove(className);
}

function hasClass(el, className) {
  return el.classList.contains(className);
  // To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
}

function toggleClass(el, className) {
  if (hasClass(el, className)) {
    removeClass(el, className);
  } else {
    addClass(el, className);
  }
}

function toggleAttribute(el, attribute) {
  if (el.getAttribute(attribute)) {
    el.removeAttribute(attribute);
  } else {
    el.setAttribute(attribute, true);
  }
}
// DOM functions – end
function transferClass(el_origin, el_target, className) {
  let classes = typeof className === "string" ? new Array(className) : className;
  classes.forEach((el) => {
    if (hasClass(el_origin, el)) {
      addClass(el_target, el);
    }
  });
}

function parseHTML(str) {
  var tmp = document.implementation.createHTMLDocument("Parsed");
  tmp.body.innerHTML = str;
  // To do: destroy the HTMLDocument before returning
  return tmp.body;
}

function stopEvent(e) {
  if (!e) {
    if (!window.event) {
      return;
    }
  }
  if (!e) {
    return false;
  }
  //e.cancelBubble is supported by IE, this will kill the bubbling process.
  e.cancelBubble = true;
  e.returnValue = false;
  //e.stopPropagation works only in Firefox.
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

function thisIndex(el) {
  return [...el.parentNode.children].indexOf(el);
}

function getCookie(k) {
  // Thanks Simon Steinberger
  var v = document.cookie.match("(^|;) ?" + k + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

function wrap(toWrap, wrapper) {
  // Thanks yckart
  // 	observerOff();
  wrapper = wrapper || document.createElement("div");
  var sibling = toWrap.nextSibling;
  var parent = toWrap.parentNode;
  wrapper.appendChild(toWrap);
  if (parent) {
    // Already attached to DOM
    if (sibling) {
      // Attach the wrapper
      parent.insertBefore(wrapper, sibling);
    } else {
      parent.appendChild(wrapper);
    }
  }
  //     observerOn();
  return wrapper;
}

function removeHash() {
  history.pushState("", document.title, window.location.pathname + window.location.search);
}
/* ––– */
function getURLParameters() {
  // return all URL parameters in an array
  var res = {};
  var re = /[?&]([^?&]+)=([^?&]+)/g;
  location.href.replace(re, (_, k, v) => {
    res[k] = v;
  });
  return res;
}

function arrow_keys_handler(e) {
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40: // Arrow keys
    case 32:
      e.preventDefault();
      break; // Space
    default:
      break; // do not block other keys
  }
}
var external = RegExp("^((f|ht)tps?:)?//(?!" + location.host + ")");
var full_window_content = null;
var previousScrollOffset = 0;
var previouslyFocused = false;
/* Animate anchor links */
function getCumulativeOffset(obj) {
  // Offset from element to top of page
  var left, top;
  left = top = 0;
  if (obj.offsetParent) {
    do {
      left += obj.offsetLeft;
      top += obj.offsetTop;
      obj = obj.offsetParent;
    } while (obj);
  }
  return {
    x: left,
    y: top,
  };
}

// function animateAnchors(e) {
//   if (!e || q("html").clientHeight > document.body.clientHeight) {
//     return;
//   }
//   var el = e.target;
//   while (typeof el.href !== "string") {
//     // If a child of the link is clicked
//     el = el.parentNode;
//   }
//   if (el.href.split(/#|\?/)[0] != window.location.href.split(/#|\?/)[0]) {
//     // External page?
//     return;
//   }
//   var hash = null;
//   if (el.href.split("#").pop().length > 0) {
//     hash = document.getElementById(el.href.split("#").pop());
//   }
//   scrollToAnimated(hash === null ? 0 : getCumulativeOffset(hash).y, 0.5, (e) => {
//     // To do: fix jumping to new hash – is the fallback executed properly in animate()?
//     window.location = el.href.split("#")[0] + "#" + el.href.split("#").pop();
//   });
//   return false;
// }

function closestElement(el, target) {
  // Thanks http://gomakethings.com/ditching-jquery/ – Accepts either a selector string or an actual element
  for (; el && el !== document; el = el.parentNode) {
    if (el === target) {
      return el;
    }
  }
  return false;
}
// Add .n-target to the :target element now, because :target is available too late, after all page content is loaded
let setHashClass = () => {
  if (q(".n-target")) {
    removeClass(q(".n-target"), "n-target");
  }
  if (!!location.hash && q(location.hash)) {
    addClass(q(location.hash), "n-target");
  }
};
setHashClass();
window.addEventListener("hashchange", setHashClass);
/* Chainable animation specified as CSS Animation */
var temp = document.createElement("temp");
var animations = {
  animation: "animationend",
  MozAnimation: "animationend",
  WebkitAnimation: "webkitAnimationEnd",
};
var animationEndEvent = false;
for (var t in animations) {
  if (temp.style[t] !== "undefined") {
    animationEndEvent = animations[t];
  }
}

// Scroll the page to any position
function scrollToAnimated(to, duration, callback) {
  var difference = document.body.clientHeight - window.innerHeight;
  if (to > difference) {
    to = difference;
  }

  function scrollToCallback(callback) {
    q("html").scrollTop = document.body.scrollTop = to;
    if (typeof callback === "function") {
      callback();
    }
  }

  q("html").animate(
    [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(0, ${-1 * (to - (document.documentElement.scrollTop || document.body.scrollTop))}px, 0)` }],
    duration
  ).onfinish = () => {
    scrollToCallback(callback);
  };
}
// Scroll window to top, animated with easing
// To do: suport any element and direction. Use it to slide sliders on browsers where CSS transforms are slower. Replace the above scrollToAnimated()
let scrollToElement = (duration = 1000) => {
  let cosParameter = window.scrollY / 2;
  let scrollCount = 0;
  let oldTimestamp = performance.now();
  let step = (newTimestamp) => {
    scrollCount += Math.PI / (duration / (newTimestamp - oldTimestamp));
    if (scrollCount >= Math.PI) window.scrollTo(0, 0);
    if (window.scrollY === 0) return;
    window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};
// Clicking a button copies a target element's contents
function copyButton(el, target, echo) {
  el.addEventListener("click", (event) => {
    window.getSelection().removeAllRanges(); // Clear previous clipboard
    var range = document.createRange();
    range.selectNode(target);
    window.getSelection().addRange(range);
    try {
      document.execCommand("copy");
      if (!!echo && componentNotify) {
        componentNotify.notify("📋 " + target.textContent, "fixed timeout");
      }
    } catch (err) {}
  });
}
// Real time touch detection to support devices with both touch and mouse. http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
// To do: use an attribute instead of class
(function () {
  var isTouch = false; //var to indicate current input type (is touch versus no touch)
  var isTouchTimer;
  let addtouchclass = (e) => {
    clearTimeout(isTouchTimer);
    isTouch = true;
    addClass(q("html"), "can-touch");
    isTouchTimer = setTimeout(() => {
      isTouch = false;
    }, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
  };
  let removetouchclass = (e) => {
    if (!isTouch) {
      //remove 'can-touch' class if not triggered by a touch event and class is present
      isTouch = false;
      removeClass(q("html"), "can-touch");
    }
  };
  document.addEventListener("mouseover", removetouchclass, false); //this event gets called when input type is everything from touch to mouse/ trackpad
  document.addEventListener("touchstart", addtouchclass, false); //this event only gets called when input type is touch
  addtouchclass();
})();

function makeReady(el) {
  el.dataset.ready = true;
}

function focusWithin(selector) {
  var result = null;
  qa(selector).forEach((el) => {
    if (el.querySelector(":focus")) {
      result = el;
    }
  });
  return result;
}

function addComponent(host, el) {
  host.insertAdjacentHTML("afterbegin", el);
  // 	initComponents(host); // No need, observer does it automatically
}

var current_slider = q(".n-carousel__content");

var components = new Array();

function registerComponent(name, init) {
  components[name] = new Array();
  components[name].push({ init: init });
}

function initComponents(host) {
  observerOff();
  var _host = !host ? document.body : host;
  for (let key in components) {
    components[key][0].init(_host);
  }
  observerOn();
}
var observer = false;

function observerOn() {
  if (observer) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function observerOff() {
  if (observer) {
    observer.disconnect();
  }
}
if (typeof MutationObserver === "function") {
  observer = new MutationObserver((mutations, observer) => {
    observerOff();
    let mutation = mutations[0];
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      for (let el of mutation.addedNodes) {
        if (typeof el === "object" && el.nodeName !== "#text" && !el.dataset.ready && el.parentNode) {
          initComponents(el.parentNode);
        }
      }
    }
    observerOn();
  });
}
// initThreshold(document.body);
// Animate anchor link jumps
// qa('a[href^="#"]').forEach((el) => {
//   el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler
// });

//→ accordion.js:
'use strict';

// Component Accordion
(function () {
  const animate_options = { easing: "ease-in-out", duration: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? 200 : 0 };

  const openAccordion = (el) => {
    window.requestAnimationFrame(() => {
      el.style.height = 0;
      el.style.overflow = "hidden";
      el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options).onfinish = () => {
        el.style.height = el.style.overflow = "";
      };
    });
  };

  const closeAccordion = (el) => {
    window.requestAnimationFrame(() => {
      el.parentNode.open = true;
      el.style.overflow = "hidden";
      el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options).onfinish = () => {
        el.style.height = el.style.overflow = "";
        el.parentNode.removeAttribute("open");
      };
    });
  };

  const toggleAccordion = (e) => {
    let el = e.target.parentNode;

    if (!el.open) {
      openAccordion(e.target.nextElementSibling);
    } else {
      closeAccordion(e.target.nextElementSibling);
    }
    let container = el.closest(".n-accordion__popin");
    if (el.parentNode.classList.contains("n-accordion__group") || container) {
      el.parentNode.querySelectorAll(":scope > details[open]").forEach((el2) => {
        if (el2 !== el) {
          closeAccordion(el2.querySelector(":scope > :not(summary)"));
        }
      });
    }
    if (container) {
      let row = Math.floor(([...container.children].indexOf(el) / getComputedStyle(container).getPropertyValue("--n-popin-columns")) * 1) + 2;
      container.style.setProperty("--n-popin-open-row", row);
    }
  };

  function init(host) {
    host.querySelectorAll(".n-accordion:not([data-ready]) > summary").forEach((el) => {
      el.addEventListener("click", toggleAccordion);
      el.parentNode.dataset.ready = true;
    });
  }

  registerComponent("accordion", init);
})();

//→ form.js:
'use strict';

// Component Form – start
(function () {
  /* Form – start */
  function submitForm(e) {
    var el = e.target;
    var ready_to_submit = true;
    el.querySelectorAll(".n-form--mandatory:not([disabled])").forEach((el) => {
      if (
        (el.querySelector("input, select, textarea") && !el.querySelector("input, select, textarea").value) ||
        (el.querySelector("input[type=checkbox]") && !el.querySelector("input[type=checkbox]").checked) ||
        (el.querySelector("input[type=radio]") && !el.querySelector("input[type=radio]").checked) ||
        (el.querySelector("input[type=email]") && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector("input[type=email]").value)) ||
        (el.querySelector("input[type=url]") && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector("input[type=url]").value)) ||
        (el.querySelector("input[type=number]") && !RegExp(/^\d+$/).test(el.querySelector("input[type=number]").value)) ||
        (el.querySelector("input[type=number][data-digits]") &&
          el.querySelector("input[type=number]").value.length !== parseInt(el.querySelector("input[type=number]").dataset.digits))
      ) {
        ready_to_submit = false;
        el.querySelector("input").focus();
        addClass(el, "n-form--alert");
        // Margin animation, because transform animation hides neighbouring content on iPad
        let form = el.closest("form");
        form.animate([{ width: `${form.scrollWidth}px` }, { marginLeft: `-9px` }, { marginLeft: `18px` }, { width: `${form.scrollWidth}px`, marginLeft: 0 }], 250);
        return;
      } else {
        removeClass(el, "n-form--alert");
      }
    });
    return ready_to_submit;
  }

  function updateFileInput(e) {
    var el = e.target;
    el.parentNode.querySelector("span.n-form__file-name").innerHTML = el.value.substring(el.value.lastIndexOf("\\") + 1);
  }
  // if (q(".n-form--language")) {
  // 	// To do: make it universal .submitonchange and for more than 1 form
  // 	q(".n-form--language select").onchange = (e) => {
  // 		q(".n-form--language").submit();
  // 	};
  // 	q(".n-form--language noscript").remove();
  // }

  function toggleConditionalFieldset(e) {
    var el = e.target;
    var fieldset = el.closest(".n-form__condition").nextElementSibling;
    var attribute = "disabled";
    if (el.checked) {
      fieldset.removeAttribute(attribute);
    } else {
      fieldset.setAttribute(attribute, "disabled");
    }
  }
  /* Form – end */
  let init = (host) => {
    host.querySelectorAll("form.n-form").forEach((el, i) => {
      el.onsubmit = el.onsubmit || submitForm;
      el.querySelectorAll("input[type=file]").forEach((el, i) => {
        el.onchange = updateFileInput;
        el.parentNode.querySelector("span").insertAdjacentHTML("afterbegin", "<span class=n-form__file-name></span>");
      });
      // 	Conditional form fieldsets
      el.querySelectorAll(".n-form__check.n-form__condition input").forEach((el, i) => {
        el.onchange = toggleConditionalFieldset;
      });
      // Auto textarea height.
      el.querySelectorAll("textarea[data-auto]").forEach((el) => {
        el.onkeyup = (e) => {
          el = e.target;
          while (el.rows > 1 && el.scrollHeight < el.offsetHeight) {
            el.rows--;
          }
          while (el.scrollHeight > el.offsetHeight) {
            if (el.rows > 20) {
              break;
            }
            el.rows++;
          }
          el.rows++;
        };
      });
      makeReady(el);
    });
  };
  registerComponent("form", init);
})();
// Component Form – end

//→ disable-body-scroll-ios.js:
'use strict';

/**
 * This is a function where type checking is disabled.
 * @suppress {misplacedTypeAnnotation}
 */
window.nuiDisableBodyScroll = (function() {
	// Thanks Thijs Huijssoon https://gist.github.com/thuijssoon

	/**
	 * Private variables
	 */
	var _selector = false,
		_element = false,
		_clientY;

	/**
	 * Prevent default unless within _selector
	 *
	 * @param  event object event
	 * @return void
	 */
	var preventBodyScroll = (event) => {
		if (!_element || !event.target.closest || !_selector.contains(event.target)) {
			event.preventDefault();
		}
	};

	/**
	 * Cache the clientY co-ordinates for
	 * comparison
	 *
	 * @param  event object event
	 * @return void
	 */
	var captureClientY = (event) => {
		// only respond to a single touch
		if (event.targetTouches.length === 1) {
			_clientY = event.targetTouches[0].clientY;
		}
	};

	/**
	 * Detect whether the element is at the top
	 * or the bottom of their scroll and prevent
	 * the user from scrolling beyond
	 *
	 * @param  event object event
	 * @return void
	 */
	var preventOverscroll = (event) => {
		// only respond to a single touch
		if (event.targetTouches.length !== 1) {
			return;
		}

		var clientY = event.targetTouches[0].clientY - _clientY;

		// The element at the top of its scroll,
		// and the user scrolls down
		if (_element.scrollTop === 0 && clientY > 0) {
			event.preventDefault();
		}

		// The element at the bottom of its scroll,
		// and the user scrolls up
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
		if (_element.scrollHeight - _element.scrollTop <= _element.clientHeight && clientY < 0) {
			event.preventDefault();
		}
	};

	/**
	 * Disable body scroll. Scrolling with the selector is
	 * allowed if a selector is provided.
	 *
	 * @param  boolean allow
	 * @param  string selector Selector to element to change scroll permission
	 * @return void
	 */
	return function(allow, selector) {
		if (!!selector) {
			_selector = selector;
			_element = selector;
		}

		if (true === allow) {
			if (false !== _element) {
				_element.addEventListener("touchstart", captureClientY, { passive: false });
				_element.addEventListener("touchmove", preventOverscroll, { passive: false });
			}
			document.body.addEventListener("touchmove", preventBodyScroll, { passive: false });
		} else {
			if (false !== _element) {
				_element.removeEventListener("touchstart", captureClientY, { passive: false });
				_element.removeEventListener("touchmove", preventOverscroll, { passive: false });
			}
			document.body.removeEventListener("touchmove", preventBodyScroll, { passive: false });
		}
	};
})();

//→ modal.js:
'use strict';

var componentModal = (function () {
  /* Modal – start */

  const focusableElements = 'button, [href], input, select, textarea, details, summary, video, [tabindex]:not([tabindex="-1"])';
  const trapFocus = (modal) => {
    // FROM: https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
    // add all the elements inside modal which you want to make focusable
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
    document.addEventListener("keydown", function (e) {
      let isTabPressed = e.key === "Tab" || e.keyCode === 9;
      if (!isTabPressed) {
        return;
      }
      if (e.shiftKey) {
        // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else {
        // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    });
    firstFocusableElement.focus();
  };

  function adjustModal(e) {
    if (!!window.visualViewport) {
      document.body.style.setProperty("--overlay-top", `${window.visualViewport.offsetTop}px`);
      document.body.style.setProperty("--overlay-bottom", `${window.innerHeight - window.visualViewport.height}px`);
    }
  }

  function keyUpClose(e) {
    if ((e || window.event).keyCode === 27) {
      // Esc
      closeFullWindow();
    }
  }
  var previousScrollX = 0;
  var previousScrollY = 0;

  const animation_duration = window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? 200 : 0;

  function closeFullWindow() {
    let full_window = qa(".n-modal");
    full_window = full_window[full_window.length - 1];
    if (full_window) {
      window.scrollTo(previousScrollX, previousScrollY);
      let direction_option = "normal";
      var animation = full_window.querySelector(".n-modal__content > div").dataset.anim; // Custom animation?
      if (animation.length < 11) {
        // '', 'null' or 'undefined'?
        animation = '[{ "transform": "translate3d(0,0,0)" }, { "transform": "translate3d(0,-100%,0)" }]';
      } else {
        direction_option = "reverse";
      }

      full_window.animate(JSON.parse(animation), { duration: animation_duration, direction: direction_option, easing: "ease-in-out" }).onfinish = () => {
        nuiDisableBodyScroll(false, full_window.querySelector(".n-modal__content")); // Turn off and restore page scroll
        full_window.parentNode.removeChild(full_window);
        full_window_content = null;
        if (!q(".n-modal")) {
          // A single overlay is gone, leaving no overlays on the page
          window.removeEventListener("resize", adjustModal);
          window.removeEventListener("keydown", arrow_keys_handler); // To do: unglobal this and apply only to modal
          window.removeEventListener("keyup", keyUpClose);
          removeClass(q("html"), "no-scroll");
        } else {
          nuiDisableBodyScroll(true, full_window.querySelector(".n-modal__content"));
          adjustModal();
        }
        if (previouslyFocused) {
          previouslyFocused.focus();
        }
      };
    }
  }

  function openFullWindow(el, animation) {
    // el is an HTML string
    previouslyFocused = document.activeElement;
    full_window_content = document.createElement("div");
    if (typeof el === "string") {
      full_window_content.innerHTML = el;
    } else {
      full_window_content.appendChild(el);
    }
    full_window_content.dataset.anim = animation;
    var wrapper = document.createElement("div");
    addClass(wrapper, "n-modal");
    wrapper.insertAdjacentHTML("beforeend", "<div class=n-modal__content tabindex=0></div><div class=n-modal__bg></div>");
    wrapper.firstChild.appendChild(full_window_content);
    full_window_content = wrapper;
    full_window_content.insertAdjacentHTML("afterbegin", `<button class=n-modal__close> ← ${document.title}</button>`);
    full_window_content.onclick = (e) => {
      let modals = qa(".n-modal");
      if (modals) {
        let modal = modals[modals.length - 1];
        if (e.target === modal || e.target.parentNode === modal) {
          closeFullWindow();
        }
      }
    };
    full_window_content.querySelector(".n-modal__close").addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
    full_window_content.querySelector(".n-modal__bg").addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
    window.addEventListener("keyup", keyUpClose);
    document.body.appendChild(full_window_content);
    trapFocus(full_window_content);
    let full_window_container = full_window_content.querySelector(".n-modal__content");
    full_window_container.focus();
    nuiDisableBodyScroll(true, full_window_container); // Turn on and block page scroll
    if (qa(".n-modal").length === 1) {
      // Sole (first) modal
      addClass(q("html"), "no-scroll");
      previousScrollX = window.scrollX;
      previousScrollY = window.scrollY;
      window.addEventListener("resize", adjustModal);
      adjustModal();
    }
    if (full_window_content.querySelector(".n-full-screen")) {
      if (full_window_content.webkitRequestFullScreen) {
        full_window_content.webkitRequestFullScreen();
      }
      if (full_window_content.mozRequestFullScreen) {
        full_window_content.mozRequestFullScreen();
      }
      if (full_window_content.requestFullScreen) {
        full_window_content.requestFullScreen();
      }
    } else {
      full_window_content.animate(typeof animation === "string" ? JSON.parse(animation) : [{ transform: "translate3d(0,-100%,0)" }, { transform: "translate3d(0,0,0)" }], {
        duration: animation_duration,
        easing: "ease-in-out",
      });
    }
    return false;
  }

  function modalWindow(e) {
    // Modal window of external file content
    var el = e.target;
    var link = el.closest(".n-modal-link").href;
    var animation = el.closest(".n-modal-link").dataset.anim;
    var request = new XMLHttpRequest();
    request.open("GET", link.split("#")[0], true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        // Success
        if (!request.responseText) {
          closeFullWindow();
          window.open(link, "Modal");
          return false;
        }
        var container = !!link.split("#")[1] ? "#" + link.split("#")[1] : 0;
        var parsed = request.responseText;
        if (container) {
          parsed = parseHTML(request.responseText);
          if (!parsed.querySelector(container)) {
            closeFullWindow();
            return false;
          }
          parsed = parsed.querySelector(container).innerHTML;
        }
        openFullWindow(parsed, animation); // To do: If .modal[data-animation], pass it to openFullWindow() as second parameter. Also in openLightbox().
        transferClass(el.closest(".n-modal-link"), q(".n-modal"), ["n-modal--limited", "n-modal--full", "n-modal--rounded", "n-modal--shadow"]);
      } else {
        // Error
        closeFullWindow();
      }
    };
    request.onerror = () => {
      // Error
      closeFullWindow();
      window.open(link, "_blank");
    };
    request.send();
    return false;
  }
  let init = (host) => {
    // Modal window: open a link's target inside it
    host.querySelectorAll("a.n-modal-link[href]:not([data-ready])").forEach((el) => {
      if (el.href !== location.href.split("#")[0] + "#") {
        // Is it an empty anchor?
        el.onclick = modalWindow;
      }
      if (!el.getAttribute("rel")) {
        el.setAttribute("rel", "prefetch");
      }
      makeReady(el);
    });
  };
  registerComponent("modal", init);
  return { closeFullWindow, openFullWindow, adjustModal };
  /* Modal – end */
})();
// To do: disable page scroll by arrow keys

//→ n-carousel-from-npm.js:
'use strict';

(function () {
  const ceilingWidth = (el) => Math.ceil(parseFloat(getComputedStyle(el).width));
  const ceilingHeight = (el) => Math.ceil(parseFloat(getComputedStyle(el).height));

  function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
  }
  const default_duration = 500;
  const default_interval = 4000;
  const isChrome = !!navigator.userAgent.match("Chrome");
  const isSafari = navigator.userAgent.match(/Safari/) && !isChrome;
  const nextSlideHeight = (el) => {
    el.style.height = 0;
    el.style.overflow = "auto";
    const height = el.scrollHeight; // Ceiling when subpixel
    el.style.height = el.style.overflow = "";
    return height;
  };
  // const scrollableAncestor = (el) => {
  // 	el = el.parentNode;
  // 	while (el) {
  // 		if (el.scrollHeight > el.offsetHeight || el.scrollWidth > el.offsetWidth) {
  // 			return el;
  // 		} else {
  // 			el = el.parentNode;
  // 		}
  // 	}
  // 	return false;
  // };
  const getIndex = (el) => 1 * (isVertical(el) ? el.dataset.y : el.dataset.x);
  const scrolledAncestor = (el) => {
    el = el.parentNode;
    while (el) {
      if (el.scrollTop !== 0 || el.scrollLeft !== 0) {
        return el;
      } else {
        el = el.parentNode;
      }
    }
    return false;
  };
  const scrolledAncestors = (el) => {
    let arr = [];
    let a = scrolledAncestor(el);
    while (a && typeof a.scrollLeft !== "undefined" && (a.scrollTop !== 0 || a.scrollLeft !== 0)) {
      arr.push(a);
      a = scrolledAncestor(a);
    }
    return arr;
  };
  const isRTL = (el) => getComputedStyle(el).direction === "rtl";
  const resize_observer_support = typeof ResizeObserver === "function";
  const toggleFullScreen = (el) => {
    el = el.closest(".n-carousel");
    let carousel = el.querySelector(":scope > .n-carousel__content");
    const restoreScroll = () => {
      if (!document.webkitIsFullScreen) {
        el.nuiAncestors.forEach((el) => {
          window.requestAnimationFrame(() => {
            el.scrollLeft = el.nuiScrollX;
            el.scrollTop = el.nuiScrollY;
            delete el.nuiScrollX;
            delete el.nuiScrollY;
          });
        });
        delete el.nuiAncestors;
        el.removeEventListener("webkitfullscreenchange", restoreScroll);
      }
    };
    if (document.fullscreen || document.webkitIsFullScreen) {
      // Exit full screen
      !!document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
      if (isSafari) {
        // When exit finishes, update the carousel because on Safari 14, position is wrong or the slide is invisible
        setTimeout(() => {
          // console.log('updating', el);
          // updateCarousel(el);
          el.style.display = "none";
          window.requestAnimationFrame(() => {
            el.style.display = "";
          });
        }, 0);
      }
    } else {
      // Enter full screen
      if (isSafari) {
        el.nuiAncestors = scrolledAncestors(el);
        el.nuiAncestors.forEach((el) => {
          el.nuiScrollX = el.scrollLeft;
          el.nuiScrollY = el.scrollTop;
        });
        el.addEventListener("webkitfullscreenchange", restoreScroll, false);
      }
      !!el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen();
    }
    // updateCarousel(carousel);
  };
  const scrollStartX = (el) => el.scrollLeft; // Get correct start scroll position for LTR and RTL
  const scrollTo = (el, x, y) => {
    el.scrollTo(isRTL(el) ? -1 * Math.abs(x) : x, y); // Scroll to correct scroll position for LTR and RTL
  };
  const getScroll = (el) => (el === window ? { x: el.scrollX, y: el.scrollY } : { x: scrollStartX(el), y: el.scrollTop });
  const isVertical = (el) => el.closest(".n-carousel").matches(".n-carousel--vertical");
  const isAuto = (el) => el.parentNode.matches(".n-carousel--auto-height");
  const focusableElements = 'button, [href], input, select, textarea, details, summary, video, [tabindex]:not([tabindex="-1"])';
  const trapFocus = (modal) => {
    // FROM: https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
    // add all the elements inside modal which you want to make focusable
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
    document.addEventListener("keydown", function (e) {
      let isTabPressed = e.key === "Tab" || e.keyCode === 9;
      if (!isTabPressed) {
        return;
      }
      if (e.shiftKey) {
        // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else {
        // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    });
    firstFocusableElement.focus();
  };
  // Fix snapping with mouse wheel. Thanks https://stackoverflow.com/a/62415754/3278539
  //   const detectTrackPad = (e) => {
  //     // console.log(e);
  //     let el = e.target;
  //
  //     // if (!el.matches(".n-carousel__content")) {
  //     //   return;
  //     // }
  //
  //     var isTrackpad = false;
  //     if (e.wheelDeltaY) {
  //       if (e.wheelDeltaY === e.deltaY * -3) {
  //         isTrackpad = true;
  //       }
  //     } else if (e.deltaMode === 0) {
  //       isTrackpad = true;
  //     }
  //
  //     console.log(isTrackpad ? "Trackpad detected" : "Mousewheel detected");
  //     // if (!isTrackpad || !!navigator.platform.match(/Win/)) {
  //     // Trackpad doesn't work properly in Windows, so assume it's mouse wheel
  //     // Also check if the slide can scroll in the requested direction and let it wheel scroll inside if yes
  //     observersOff(el);
  //
  //     let scrollable_ancestor = scrollableAncestor(e.target);
  //
  //     // If scrolled carousel is currently sliding, its scrollable parent will scroll. Should cancel instead.
  //
  //     if (e.deltaY < 0) {
  //       if (
  //         !scrollable_ancestor ||
  //         scrollable_ancestor.matches(".n-carousel__content") ||
  //         scrollable_ancestor.scrollTop === 0
  //       ) {
  //         e.preventDefault();
  //         slidePrevious(el);
  //       }
  //     } else {
  //       if (
  //         !scrollable_ancestor ||
  //         scrollable_ancestor.matches(".n-carousel__content") ||
  //         scrollable_ancestor.scrollTop + scrollable_ancestor.offsetHeight ===
  //           scrollable_ancestor.scrollHeight
  //       ) {
  //         e.preventDefault();
  //         slideNext(el);
  //       }
  //     }
  //     // }
  //   };
  const observersOn = (el) => {
    delete el.parentNode.dataset.sliding;
    window.requestAnimationFrame(() => {
      if (el.parentNode.matches(".n-carousel--vertical.n-carousel--controls-outside.n-carousel--auto-height")) {
        height_minus_index.observe(el.parentNode);
      }
      el.addEventListener("scroll", scrollStop, { passive: true });
    });
  };
  const observersOff = (el) => {
    el.removeEventListener("scroll", scrollStop);
    height_minus_index.disconnect();
    // el.removeEventListener("mousewheel", detectTrackPad);
    // el.removeEventListener("DOMMouseScroll", detectTrackPad);
  };
  const inOutSine = (n) => (1 - Math.cos(Math.PI * n)) / 2;
  const paddingX = (el) => parseInt(getComputedStyle(el).paddingInlineStart) * 2;
  const paddingY = (el) => parseInt(getComputedStyle(el).paddingBlockStart) * 2;
  const getControl = (carousel, control) => {
    let detached_control = document.querySelector(`${control}[data-for="${carousel.id}"]`);
    if (detached_control) {
      return detached_control;
    }
    for (let el of carousel.children) {
      if (el.matches(control)) {
        return el;
      }
      if (!el.matches(".n-carousel__content") && el.querySelector(control)) {
        return el.querySelector(control);
      }
    }
  };
  const closestCarousel = (el) => (document.getElementById(el.closest('[class*="n-carousel"]').dataset.for) || el.closest(".n-carousel")).querySelector(".n-carousel__content");
  const scrollAnimate = (el, distanceX, distanceY, new_height, old_height = false) =>
    new Promise((resolve, reject) => {
      // Thanks https://stackoverflow.com/posts/46604409/revisions
      let wrapper = el.closest(".n-carousel");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || wrapper.matches(".n-carousel--instant") || !!wrapper.nextSlideInstant) {
        scrollTo(el, getScroll(el).x + distanceX, getScroll(el).y + distanceY);
        el.style.height = `${new_height}px`;
        delete wrapper.nextSlideInstant;
        updateCarousel(el);
        resolve(el);
        return;
      }
      subpixel.disconnect();
      // mutation.disconnect();
      let scroll_changing = true;
      if (distanceX === 0 && distanceY === 0) {
        scroll_changing = false;
      }
      if (!!new_height) {
        el.style.height = `${old_height}px`;
      } else {
        if (!isVertical(el)) {
          el.style.height = "";
        }
      }
      var stop = false;
      var startx = getScroll(el).x;
      var starty = getScroll(el).y;
      var starth = parseInt(el.style.height);
      var distanceH = new_height - starth;
      var duration = parseFloat(el.parentNode.dataset.duration) * 1000 || default_duration;
      var start = null;
      var end = null;
      let startAnim = (timeStamp) => {
        start = timeStamp;
        end = start + duration;
        draw(timeStamp);
      };
      let draw = (now) => {
        if (stop) {
          scrollTo(el, startx + distanceX, starty + distanceY);
          if (new_height) {
            el.style.height = `${new_height}px`;
          }
          subpixel.observe(el.parentNode);
          mutation.observe(el.parentNode, {
            attributes: true,
            attributeFilter: ["class"],
          });
          window.requestAnimationFrame(() => {
            updateCarousel(el);
            resolve(el);
          });
          return;
        }
        if (now - start >= duration) stop = true;
        var p = (now - start) / duration;
        var val = inOutSine(p);
        var x = startx + distanceX * val;
        var y = starty + distanceY * val;
        if (scroll_changing) {
          scrollTo(el, x, y);
        }
        if (new_height) {
          window.requestAnimationFrame(() => {
            el.style.height = `${starth + distanceH * val}px`;
          }); // Timeout because Safari can't do scroll and height at once
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(startAnim);
    });
  const updateCarousel = (el) => {
    // Called on init and scroll end
    let container_height = getComputedStyle(el).height;
    observersOff(el);
    el.dataset.x = Math.abs(Math.round(scrollStartX(el) / ceilingWidth(el.children[0])));
    el.dataset.y = Math.abs(Math.round(el.scrollTop / ceilingHeight(el.children[0])));
    // When inline
    if (el.dataset.x === "NaN") {
      el.dataset.x = 0;
    }
    if (el.dataset.y === "NaN") {
      el.dataset.y = 0;
    }
    let active = getIndex(el);
    if (active >= el.children.length) {
      active = el.children.length - 1;
    }
    let current_active = el.querySelector(":scope > [data-active]");
    if (!el.parentElement.classList.contains("n-carousel--auto-height")) {
      // Dynamic change from auto height to normal
      el.style.height = "";
    }
    let active_slide = el.children[active];

    // Endless carousel
    // To do: on initial load, scroll to second one
    // To do: fix index
    // To do: scroll end by timeout detection, when snapping to next slide, glitches
    if (el.children.length > 2 && el.parentElement.classList.contains("n-carousel--endless")) {
      if (active === 0) {
        if (!active_slide.dataset.first) {
          // Move the last one to the front as [data-first]
          el.lastElementChild.dataset.first = true;
          el.prepend(el.lastElementChild);
        } else {
          // Landed on fake first slide. Move it to the back, remove its [data-first] and move the first one to the back as [data-last]
          delete el.firstElementChild.dataset.first;
          el.append(el.firstElementChild);
          el.firstElementChild.dataset.last = true;
          el.append(el.firstElementChild);
        }
      } else {
        if (active === el.children.length - 1) {
          if (!active_slide.dataset.last) {
            // Move the first one to the back as [data-last]
            el.firstElementChild.dataset.last = true;
            el.append(el.firstElementChild);
          } else {
            // Landed on fake last slide. Move it to the front, remove its [data-last] and move the last one to the front as [data-first]
            delete el.lastElementChild.dataset.last;
            el.prepend(el.lastElementChild);
            el.lastElementChild.dataset.first = true;
            el.prepend(el.lastElementChild);
          }
        } else {
          // Middle slide
          let leftover = el.querySelector(":scope > [data-first][data-last]");
          if (leftover) {
            delete leftover.dataset.first;
            delete leftover.dataset.last;
          }
        }
      }
    }

    if (current_active) {
      // console.log("updateCarousel bailing on unchanged slide");
      if (active_slide === current_active) {
        // Scroll snapping back to the same slide. Nothing to do here.
        observersOn(el);
        return;
      }
      delete current_active.dataset.active;
      current_active.style.height = "";
      if (!isVertical(el)) {
        el.style.height = "";
      }
    }
    // console.log("updateCarousel working");
    active_slide.dataset.active = true;
    active_slide.style.height = "";
    el.style.setProperty("--height", container_height);
    window.requestAnimationFrame(() => {
      if (!el.parentNode.dataset.ready && isAuto(el) && isVertical(el)) {
        el.style.height = `${parseFloat(getComputedStyle(el).height) - paddingY(el)}px`;
      }
    });
    // Fix buttons
    let index = getControl(el.closest(".n-carousel"), ".n-carousel__index");
    if (!!index && !el.parentNode.classList.contains("n-carousel--inline")) {
      if (index.querySelector("[disabled]")) {
        index.querySelector("[disabled]").disabled = false;
      }
      index.children[active].disabled = true;
    }

    observersOn(el);
    // Sliding to a slide with a hash? Update the URI
    let hash = active_slide.id;
    // console.log(hash);
    if (!!hash) {
      // console.log(hash);
      location.hash = `#${hash}`; // Doesn't work with soft reload. To do: scroll to relevant slide
    }
    // Disable focus on children of non-active slides
    // Active slides of nested carousels should also have disabled focus
    // Restore previous tabindex without taking into account the tabindex just added by the script
    [...el.children].forEach((slide) => {
      if (slide !== active_slide) {
        slide.querySelectorAll(focusableElements).forEach((el2) => {
          if (el2.closest(".n-carousel__content > :not([data-active])")) {
            if (el2.getAttribute("tabindex") && !el2.dataset.focusDisabled) {
              el2.dataset.oldTabIndex = el2.tabIndex;
            }
            el2.dataset.focusDisabled = true;
            el2.tabIndex = -1;
          }
        });
        // slide.dataset.disabledChildrenFocus = true;
      }
    });
    // console.log(active_slide);
    active_slide.querySelectorAll("[data-focus-disabled]").forEach((el2) => {
      if (!el2.closest(".n-carousel__content > :not([data-active])")) {
        el2.removeAttribute("tabindex");
        delete el2.dataset.focusDisabled;
        if (!!el2.dataset.oldTabIndex) {
          el2.tabIndex = el2.dataset.oldTabIndex;
          delete el2.dataset.oldTabIndex;
        }
      }
    });
    // delete active_slide.dataset.disabledChildrenFocus;
  };
  // Setup isScrolling variable
  var isScrolling;
  var lastScrollX;
  var lastScrollY;
  var isResizing;
  const scrollStop = (e) => {
    // return;
    //     if (!!navigator.platform.match(/Win/)) {
    //       // Scrolling is broken on Windows
    //       // console.log("scroll Windows", e);
    //
    //       e.stopPropagation();
    //       e.preventDefault();
    //       return;
    //     }
    // return;
    // Clear our timeout throughout the scroll
    // console.log("scrolling", e, e.target.scrollLeft);
    let el = e.target;
    let mod_x = scrollStartX(el) % ceilingWidth(el.children[0]);
    let mod_y = el.scrollTop % ceilingHeight(el.children[0]);
    // console.log("mod while scrolling", mod_x, mod_y);
    // console.log("scroll while scrolling", scrollStartX(el));
    const afterScrollTimeout = () => {
      let mod_x = scrollStartX(el) % ceilingWidth(el.children[0]);
      let mod_y = el.scrollTop % ceilingHeight(el.children[0]);
      // console.log("mod after timeout", mod_x, mod_y);
      // console.log("scroll after timeout", scrollStartX(el));
      // console.log("scrollStop check", mod_x, mod_y);
      let new_x = Math.abs(Math.round(scrollStartX(el) / ceilingWidth(el.children[0])));
      let new_y = Math.abs(Math.round(el.scrollTop / ceilingHeight(el.children[0])));
      if (!("ontouchstart" in window) && (mod_x !== 0 || mod_y !== 0)) {
        // Stuck bc of Chrome/Safari bug when you scroll in both directions during snapping. Not needed on touch and glitchy there.
        // console.log("stuck", new_x, new_y, el);
        updateCarousel(el);
        // console.log("unstucking to ", new_y);
        let tabbing = false;
        if (!isSafari || !!el.tabbing) {
          slideTo(el, isVertical(el) ? new_y : new_x);
        }
        return;
      }
      if ("ontouchstart" in window && scrollStartX(el) === el.scrollWidth - el.offsetWidth && mod_x === el.children[0].offsetWidth - 1) {
        // iPad last slide bug. Set mod_x to 0 so the next check can update the carousel
        mod_x = 0;
      }
      if (lastScrollX === scrollStartX(el) && lastScrollY === el.scrollTop && mod_x === 0 && mod_y === 0) {
        // Snapped to position, not stuck
        if (isAuto(el)) {
          observersOff(el);
          let old_height = parseFloat(getComputedStyle(el).height);
          let new_height;
          let offset_y = 0;
          if (isVertical(el)) {
            // let new_index = Math.abs(Math.round(el.scrollTop / (el.offsetHeight - paddingY(el))));
            // el.children[new_y].style.height = "auto";
            new_height = el.children[new_y].children[0].scrollHeight; // To do: support multiple children and drop the requirement for a wrapper inside the slide
            // el.children[new_y].style.height = "";
            offset_y = new_y * new_height - el.scrollTop;
          } else {
            // let new_index = Math.abs(Math.round(scrollStartX(el) / (ceilingWidth(el) - paddingX(el))));
            // new_height = parseFloat(getComputedStyle(el.children[new_x].children[0]).height); // but shouldn't be lower than blank carousel height. worked around by min height of 9em which surpasses the blank carousel height
            new_height = nextSlideHeight(el.children[new_x]);
            scrollTo(el, lastScrollX, lastScrollY);
          }
          if (old_height === new_height) {
            new_height = false;
          }
          // console.log("scroll end new height", new_height);
          el.parentNode.dataset.sliding = true;
          window.requestAnimationFrame(() => {
            scrollAnimate(el, 0, offset_y, new_height, old_height);
          });
        } else {
          updateCarousel(el);
        }
      }
    };
    // if ("ontouchstart" in window && (mod_x > 1 || mod_y > 1 || !!el.parentNode.dataset.sliding || !el.matches(".n-carousel__content"))) {
    //   // It should also set up the timeout in case we're stuck after a while
    //   // return; // return only on touch Safari. What about iPad Safari with trackpad?
    // }
    clearTimeout(isScrolling);
    lastScrollX = scrollStartX(el);
    lastScrollY = el.scrollTop;
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(afterScrollTimeout, 166);
  };
  const slide = (el, offsetX, offsetY, index) => {
    clearTimeout(el.nCarouselTimeout);
    observersOff(el);
    if (!el.parentNode.dataset.sliding) {
      el.parentNode.dataset.sliding = true;
      let old_height = el.children[getIndex(el)].clientHeight;
      let new_height = old_height;
      let scroll_to_y = 0;
      if (isAuto(el)) {
        let old_scroll_left = scrollStartX(el);
        let old_scroll_top = el.scrollTop;
        if (isVertical(el)) {
          // el.children[index].style.height = "auto";
          new_height = el.children[index].firstElementChild.scrollHeight;
        } else {
          // new_height = parseFloat(getComputedStyle(el.children[index].children[0]).height);
          new_height = nextSlideHeight(el.children[index]);
          // let old_height = parseInt(el.dataset.x) === index ? new_height : parseFloat(getComputedStyle(el.children[el.dataset.x].children[0]).height);
          let old_height = parseInt(el.dataset.x) === index ? new_height : nextSlideHeight(el.children[el.dataset.x]);
          el.style.setProperty("--height", `${old_height}px`);
          // console.log("old index", el.dataset.x, "new index", index, "--height (old height):", old_height, "new height", new_height); // old height is wrong
        }
        // el.children[index].style.width = el.children[index].style.height = "";
        scrollTo(el, old_scroll_left + paddingX(el) / 2, old_scroll_top); // iPad bug
        scrollTo(el, old_scroll_left, old_scroll_top);
      }
      if (isVertical(el)) {
        scroll_to_y = offsetY - index * old_height + index * new_height;
      }
      window.requestAnimationFrame(() => {
        scrollAnimate(el, offsetX, scroll_to_y, new_height === old_height ? false : new_height, old_height); // Vertical version will need ceiling value
      });
    }
  };
  const slideNext = (el) => {
    let index = getIndex(el);
    slideTo(el, index >= el.children.length - 1 ? 0 : index + 1);
  };
  const slidePrevious = (el) => {
    let index = getIndex(el);
    slideTo(el, index === 0 ? el.children.length - 1 : index - 1);
  };
  const slideTo = (el, index) => {
    if (isVertical(el)) {
      slide(el, 0, ceilingHeight(el.children[index]) * index - el.scrollTop, index);
    } else {
      let width = Math.ceil(parseFloat(getComputedStyle(el.children[index]).width));
      let new_offset = isRTL(el) ? Math.abs(scrollStartX(el)) - width * index : width * index - scrollStartX(el);
      slide(el, new_offset, 0, index);
    }
  };
  const carouselKeys = (e) => {
    let keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    let el = e.target;
    if (e.key === "Tab") {
      let carousel = el.closest(".n-carousel__content");
      carousel.tabbing = true;
      // setTimeout(e => { delete carousel.tabbing }, 100);
    }
    if (el.matches(".n-carousel__content") && keys.includes(e.key)) {
      // Capture relevant keys
      e.preventDefault();
      switch (e.key) {
        case "ArrowLeft": {
          isRTL(el) ? slideNext(el) : slidePrevious(el);
          break;
        }
        case "ArrowRight": {
          isRTL(el) ? slidePrevious(el) : slideNext(el);
          break;
        }
        case "ArrowUp":
        case "PageUp": {
          slidePrevious(el);
          break;
        }
        case "ArrowDown":
        case "PageDown": {
          slideNext(el);
          break;
        }
        case "Home": {
          slideTo(el, 0);
          break;
        }
        case "End": {
          slideTo(el, el.children.length - 1);
          break;
        }
      }
    }
  };
  const slidePreviousEvent = (e) => slidePrevious(closestCarousel(e.target.closest('[class*="n-carousel"]')));
  const slideNextEvent = (e) => slideNext(closestCarousel(e.target.closest('[class*="n-carousel"]')));
  const slideIndexEvent = (e) => {
    let el = e.target.closest("button");
    if (el) {
      const carousel = el.closest(".n-carousel");
      if (carousel.classList.contains("n-carousel--inline") && !carousel.classList.contains("n-carousel--overlay")) {
        carousel.classList.add("n-carousel--overlay");
        document.body.dataset.frozen = document.body.scrollTop;
        // carousel.animate([{ transform: "translateY(-100%)" }, { transform: "none" }], { duration: 200, fill: "forwards" });
        trapFocus(carousel);
        // carousel.nextSlideInstant = true;
      }
      window.requestAnimationFrame(() => {
        slideTo(closestCarousel(el), [...el.parentNode.children].indexOf(el));
      });
    }
  };
  const closeModal = (e) => {
    if (document.fullscreen || document.webkitIsFullScreen) {
      !!document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
    }
    let carousel = e.target.closest(".n-carousel");
    if (carousel) {
      carousel.classList.remove("n-carousel--overlay");
      delete document.body.dataset.frozen;
    }
  };
  const verticalAutoObserver = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      entries.forEach((e) => {
        let slide = e.target;
        let el = slide.closest(".n-carousel__content");
        if (!!slide.parentNode.dataset.active && !el.parentNode.dataset.sliding) {
          el.style.height = `${slide.scrollHeight}px`;
        }
      });
    });
  });
  const updateSubpixels = (el) => {
    if (el.matches(".n-carousel--auto-height") && !!el.parentNode.dataset.sliding) {
      return;
    }
    // Round down the padding, because sub pixel padding + scrolling is a problem
    let carousel = el.querySelector(":scope > .n-carousel__content");
    carousel.style.setProperty("--subpixel-compensation-peeking", 0);
    carousel.style.setProperty("--subpixel-compensation", 0);
    if (isVertical(el)) {
      let peeking_compensation = carousel.firstElementChild.getBoundingClientRect().y - carousel.getBoundingClientRect().y;
      carousel.style.setProperty("--subpixel-compensation-peeking", Math.ceil(peeking_compensation) - peeking_compensation);
      carousel.style.setProperty("--subpixel-compensation", ceilingHeight(carousel) - parseFloat(getComputedStyle(carousel).height));
    } else {
      let peeking_compensation = carousel.firstElementChild.getBoundingClientRect().x - carousel.getBoundingClientRect().x;
      carousel.style.setProperty("--subpixel-compensation-peeking", Math.ceil(peeking_compensation) - peeking_compensation);
      carousel.style.setProperty("--subpixel-compensation", ceilingWidth(carousel.firstElementChild) - parseFloat(getComputedStyle(carousel.firstElementChild).width));
    }
    // console.log(carousel.children[carousel.dataset.x], carousel.children[carousel.dataset.y]);
    scrollTo(carousel, carousel.dataset.x * ceilingWidth(carousel.firstElementChild), carousel.dataset.y * ceilingHeight(carousel.firstElementChild));
  };
  const updateObserver = (el) => {
    updateSubpixels(el);
    el = el.querySelector(":scope > .n-carousel__content");
    // console.log("resized", el);
    // let current_height = getComputedStyle(el.querySelector(":scope > [data-active] > *")).height;
    let current_height = el.querySelector(":scope > [data-active]").scrollHeight + "px";
    let previous_height = getComputedStyle(el).getPropertyValue("--height");
    if (current_height !== previous_height) {
      el.style.setProperty("--height", current_height);
    }
  };
  const subpixel = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      entries.forEach((e) => {
        updateObserver(e.target);
      });
    });
  });
  const mutation = new MutationObserver((mutations) => {
    // console.log("mutations", mutations);
    for (let mutation of mutations) {
      // console.log("mutated ", mutation.target);
      if (mutation.target) {
        updateObserver(mutation.target);
      }
    }
  });
  const setIndexWidth = (el) => {
    let index = el.querySelector(":scope > .n-carousel__index");
    if (index && !el.dataset.sliding) {
      el.style.removeProperty("--height-minus-index");
      index.style.position = "absolute";
      el.style.setProperty("--height-minus-index", `${el.offsetHeight}px`);
      el.style.setProperty("--index-width", getComputedStyle(el.querySelector(":scope > .n-carousel__index")).width);
      index.style.position = "";
    }
  };
  const height_minus_index = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      // Observing the carousel wrapper
      entries.forEach((e) => {
        let el = e.target;
        setIndexWidth(el);
      });
    });
  });
  const init = (host = document) => {
    host.querySelectorAll(".n-carousel:not([data-ready])").forEach((el) => {
      const previous = getControl(el, ".n-carousel__previous");
      const next = getControl(el, ".n-carousel__next");
      const index = getControl(el, ".n-carousel__index");
      const close_modal = getControl(el, ".n-carousel__close");
      const full_screen = getControl(el, ".n-carousel__full-screen");
      if (!!previous) {
        previous.onclick = slidePreviousEvent;
      }
      if (!!next) {
        next.onclick = slideNextEvent;
      }
      if (!!index) {
        index.onclick = slideIndexEvent;
      }
      if (!!close_modal) {
        close_modal.onclick = closeModal;
      }
      if (!!full_screen) {
        full_screen.onclick = (e) => {
          let carousel = e.target.closest(".n-carousel").querySelector(":scope > .n-carousel__content");
          carousel.dataset.xx = carousel.dataset.x;
          carousel.dataset.yy = carousel.dataset.y;
          // let x = carousel.dataset.x;
          // let y = carousel.dataset.y;
          // console.log(x, carousel.scrollLeft);
          toggleFullScreen(e.target);
        };
        const fullScreenEvent = (e) => {
          // Chrome: Keep and update the real scroll here
          let carousel = e.target.querySelector(":scope > .n-carousel__content");
          // let x = carousel.dataset.x;
          // let y = carousel.dataset.y;
          // console.log('full screen change', x, carousel.scrollLeft);
          // $0.scrollTo($0.dataset.xx * Math.ceil(parseFloat(getComputedStyle($0.firstElementChild).width)), 0); delete $0.dataset.xx;
          // console.log(carousel.dataset.xx, carousel.dataset.xx * ceilingWidth(carousel.children[carousel.dataset.xx]));
          window.requestAnimationFrame(() => {
            carousel.dataset.x = carousel.dataset.xx;
            carousel.dataset.y = carousel.dataset.yy;
            delete carousel.dataset.xx;
            delete carousel.dataset.yy;
            if (carousel.dataset.x !== "undefined" && carousel.dataset.y !== "undefined") {
              scrollTo(
                carousel,
                carousel.dataset.x * ceilingWidth(carousel.children[carousel.dataset.x]),
                carousel.dataset.y * ceilingHeight(carousel.children[carousel.dataset.y])
              );
            }
          });
        };
        if (isSafari) {
          el.onwebkitfullscreenchange = fullScreenEvent;
        } else {
          el.onfullscreenchange = fullScreenEvent;
        }
      }
      el.querySelector(".n-carousel__content").onkeydown = carouselKeys;
      el.parentNode.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          closeModal(e);
        }
      });
      let content = el.querySelector(":scope > .n-carousel__content");
      // content.tabIndex = 0;
      let hashed_slide = !!location.hash ? content.querySelector(":scope > " + location.hash) : false;
      if (hashed_slide) {
        // console.log(hashed_slide);
        let index = [...hashed_slide.parentNode.children].indexOf(hashed_slide);
        if (isVertical(content)) {
          content.dataset.y = index;
        } else {
          content.dataset.x = index;
        }
        slideTo(content, index);
      }
      if (el.matches(".n-carousel--vertical.n-carousel--auto-height")) {
        content.style.height = getComputedStyle(content).height;
        el.dataset.ready = true;
        content.scrollTop = 0; // Should be a different value if the initial active slide is other than the first one (unless updateCarousel() takes care of it)
      }
      if (el.matches(".n-carousel--vertical.n-carousel--auto-height")) {
        // Vertical auto has a specified height which needs update on resize
        content.querySelectorAll(":scope > * > *").forEach((el) => verticalAutoObserver.observe(el));
      }
      window.requestAnimationFrame(() => {
        subpixel.observe(el);
        mutation.observe(el, {
          attributes: true,
          attributeFilter: ["class"],
        });
        el.dataset.ready = true;
        if (el.parentNode.matches(".n-carousel--vertical.n-carousel--controls-outside.n-carousel--auto-height")) {
          setIndexWidth(el);
        }
        updateCarousel(content);
        if (el.matches(".n-carousel--auto-slide")) {
          let auto_delay = (parseFloat(el.dataset.interval) * 1000 || default_interval) + (parseFloat(el.dataset.duration) * 1000 || default_duration);
          let carouselTimeout = () => {
            if (isElementInViewport(content)) {
              slideNext(content);
            }
            content.nCarouselTimeout = setTimeout(carouselTimeout, auto_delay);
          };
          content.nCarouselTimeout = setTimeout(carouselTimeout, parseFloat(el.dataset.interval) * 1000 || default_interval);
          content.addEventListener("pointerenter", (e) => clearTimeout(e.target.nCarouselTimeout));
        }
        el.dataset.platform = navigator.platform;
      });
      content.nCarouselUpdate = updateCarousel;
    });
  };
  window.nCarouselInit = init;
  typeof registerComponent === "function" ? registerComponent("n-carousel", init) : init();
})();

//→ n-select.js:
'use strict';

(function () {
	const isChrome = !!navigator.userAgent.match("Chrome");
	const isSafari = navigator.userAgent.match(/Safari/) && !isChrome;
	let clickOutsideSelect = (e) => {
		if (!e.target.closest(".n-select__options > *") && !e.target.closest(".n-select")) {
			document.querySelectorAll(".n-select__options[aria-expanded]:not([data-n-select-animation])").forEach((select) => {
				closeSelect(select);
			});
		}
	};

	let closeSelectOnResize = (e) => {
		closeSelect(document.querySelector(".n-select__options[aria-expanded]"));
	};

	let selectOption = (el, close = true) => {
		if (!el || el.tagName !== "BUTTON") {
			return;
		}

		let select = el.closest(".n-select__options");
		select.querySelectorAll("[aria-selected]").forEach((el) => el.removeAttribute("aria-selected"));
		el.setAttribute("aria-selected", true);
		select.nuiSelectWrapper.dataset.value = el.value;
		if (select.hasAttribute("aria-expanded")) {
			el.focus();
			if (close) {
				closeSelect(select);
			}
		}

		let options = select.children[0];
		select.nuiSelectWrapper.style.setProperty("--active-option-height", `${el.getBoundingClientRect().height}px`);
		options.style.removeProperty("--top-offset");
		options.style.removeProperty("--max-height");

		let select_native = select.nuiNativeInput; // The attached native select

		select_native.innerHTML = `<option value="${el.value}"></option>`;
		const event = new Event("change");
		select_native.dispatchEvent(event);

		if (!!select.nuiOnChange) {
			select.nuiOnChange(index, select_native.value);
		}
	};

	const font_properties = ["font-family", "font-size", "font-style", "font-weight", "line-height", "font-variant"];

	let closeSelect = (select) => {
		delete select.dataset.nSelectAnimation;
		// delete select.dataset.transitionend;
		select.removeAttribute("aria-expanded");
		// document.body.classList.remove("n-select--open");
		// select.style.font = "";

		font_properties.forEach((el) => {
			select.style[el] = "";
		});

		select.nuiSelectWrapper.prepend(select);
		window.removeEventListener("resize", closeSelectOnResize);
		// window.removeEventListener("scroll", closeSelectOnResize);
		select.querySelector("[aria-selected]").tabIndex = -1;
		window.removeEventListener("pointerup", clickOutsideSelect);
		select.removeEventListener("pointerup", pointerUpSelect);
		let wrapper = select.parentNode;
		wrapper.classList.remove("n-select--open");
		wrapper.style.removeProperty("--width");
		select.style.removeProperty("--scroll-help-top");
		select.classList.remove("n-select--scroll-help-top");
		// window.requestAnimationFrame((t) => select.nuiSelectWrapper.focus()); // iPad blocking another element's scrolling 🤷‍♂️
		select.nuiSelectWrapper.focus();
		select.classList.remove("n-scrollbar");
	};

	let openSelect = (select) => {
		let previous_open_select = document.body.querySelector(".n-select__options[aria-expanded]");
		if (previous_open_select) {
			closeSelect(previous_open_select);
		}

		let wrapper = select.parentNode;
		wrapper.style.setProperty("--width", `${wrapper.getBoundingClientRect().width}px`);
		wrapper.classList.add("n-select--open");

		// Fix viewport overflow
		select.style.removeProperty("--top-offset");
		select.style.removeProperty("--max-height");
		select.style.removeProperty("--select-scroll-height");
		select.style.removeProperty("--active-option-offset");
		select.classList.remove("n-select--crop-top");

		let option_height = select.getBoundingClientRect().height;

		select.style.setProperty("--max-width", `${select.parentNode.getBoundingClientRect().width}px`);

		// If body is position relative, subtract from the vars its border width
		let document_offset = document.querySelector("html").getBoundingClientRect().x;
		select.style.setProperty(
			"--body-offset-x",
			wrapper.getBoundingClientRect().x -
				document_offset -
				(document.body.style.position === "relative"
					? parseFloat(getComputedStyle(document.body).borderInlineStartWidth) - document_offset + document.body.getBoundingClientRect().x
					: 0)
		);
		select.style.setProperty(
			"--body-offset-y",
			-document.body.getBoundingClientRect().y +
				wrapper.getBoundingClientRect().y -
				(document.body.style.position === "relative" ? parseFloat(getComputedStyle(document.body).borderBlockStartWidth) : 0)
		);

		select.querySelector("[aria-selected]").removeAttribute("tabindex");
		select.setAttribute("aria-expanded", true);

		// select.style.font = getComputedStyle(wrapper).font; // Firefox not working

		//fontFamily fontSize, fontStyle, fontWeight

		font_properties.forEach((el) => {
			select.style[el] = getComputedStyle(wrapper)[el];
		});

		document.body.appendChild(select);
		select.style.setProperty("--select-scroll-height", `${select.getBoundingClientRect().height}px`);

		let active_option_offset = select.querySelector("[aria-selected]").getBoundingClientRect().y - select.getBoundingClientRect().y;
		let top_offset = 0;

		select.style.setProperty("--active-option-offset", active_option_offset);

		if (select.getBoundingClientRect().y < 0) {
			let current_max_height = select.getBoundingClientRect().height + select.getBoundingClientRect().y;
			select.style.setProperty("--max-height", `${current_max_height}px`);
			select.scrollTop = Math.abs(Math.round(select.getBoundingClientRect().y));
			top_offset = Math.abs(select.getBoundingClientRect().y);
			select.style.setProperty("--top-offset", top_offset);
			select.classList.add("n-select--crop-top");

			if (select.getBoundingClientRect().height > window.innerHeight) {
				select.style.setProperty("--max-height", `${current_max_height - Math.abs(window.innerHeight - select.getBoundingClientRect().height)}px`);
			}
		} else {
			if (select.getBoundingClientRect().y + select.getBoundingClientRect().height > window.innerHeight) {
				select.style.setProperty("--max-height", `${Math.abs(window.innerHeight - select.getBoundingClientRect().y)}px`);
			}

			let available_top_space = select.getBoundingClientRect().y;

			if (select.scrollHeight > select.getBoundingClientRect().height) {
				let cropped_space = select.getBoundingClientRect().height - select.scrollHeight;
				let scroll_help_top = Math.abs(Math.min(cropped_space, available_top_space)) - parseInt(getComputedStyle(select).paddingInlineEnd) * 2;
				if (scroll_help_top > 0) {
					select.style.setProperty("--scroll-help-top", scroll_help_top);
					select.classList.add("n-select--scroll-help-top");
				}
			}
		}

		if (select.getBoundingClientRect().width > select.querySelector("button").getBoundingClientRect().width + parseInt(getComputedStyle(select).paddingInlineEnd) * 2) {
			select.classList.add("n-scrollbar");
		}

		select.style.setProperty("--mask-position-y", `${active_option_offset - top_offset}`); // To do: adjust target position to equalise reveal speed on both sides: shorter side position += difference between short and long sides
		select.style.setProperty("--mask-size-y", `${option_height}px`);

		window.requestAnimationFrame((t) => {
			setTimeout(() => {
				select.dataset.nSelectAnimation = true;
				select.querySelector("[aria-selected]").focus();
				// document.body.classList.add("n-select--open");
			}, 1); // Timeout needed for the above CSS variables to work
		});

		window.addEventListener("resize", closeSelectOnResize);
		// window.addEventListener("scroll", closeSelectOnResize);
		window.addEventListener("pointerup", clickOutsideSelect);
	};

	let nextMatchingSibling = (el, selector) => {
		let sibling = el.nextElementSibling;
		while (sibling) {
			if (sibling.matches(selector)) return sibling;
			sibling = sibling.nextElementSibling;
		}
		return false;
	};

	let previousMatchingSibling = (el, selector) => {
		let sibling = el.previousElementSibling;
		while (sibling) {
			if (sibling.matches(selector)) return sibling;
			sibling = sibling.previousElementSibling;
		}
		return false;
	};

	let clickSelect = (e) => {
		let select = e.target.closest(".n-select__options");
		let el = e.target;

		if (select.hasAttribute("aria-expanded")) {
			// Open

			if (!!el.href) {
				closeSelect(select);
			} else {
				selectOption(el);
			}
		}
	};

	let pointerDownSelect = (e) => {
		let select = e.target.closest(".n-select__options") || e.target.querySelector(".n-select__options");

		if (!!select && !select.hasAttribute("aria-expanded")) {
			// Closed

			openSelect(select);

			// Prevent the click event from closing it right away
			select.removeEventListener("click", clickSelect);
			setTimeout(() => {
				select.addEventListener("click", clickSelect);
			}, 100);
		}
	};

	let pointerUpSelect = (e) => {
		let el = e.target.closest("button");
		let select = e.target.closest(".n-select__options");

		if (!!e.target.href) {
			e.target.click();
		} else {
			if (!el || !select.hasAttribute("aria-expanded") || el.hasAttribute("aria-selected")) {
				return;
			}

			selectOption(el);
		}

		document.body.style.pointerEvents = "none"; // Prevent iPad from clicking the element behind
		setTimeout(() => {
			document.body.style.pointerEvents = "";
		}, 100);
	};

	let timeout = null;

	let trapKeyboard = (e) => {
		if ([32, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
			// Capture Home, End, Arrows etc

			e.stopPropagation();
			e.preventDefault();
		}
	};

	let selectKeyboard = (e) => {
		if (e.target.tagName === "SELECT") {
			return;
		}

		trapKeyboard(e);

		let select = e.target.closest(".n-select__options");

		if (e.target.classList.contains("n-select")) {
			select = e.target.querySelector(".n-select__options");
		}

		if (!select) {
			return;
		}

		switch (e.key) {
			case "Enter": {
				if (e.target.classList.contains("n-select")) {
					openSelect(select);
				}
				break;
			}

			case "Escape": {
				closeSelect(select);
				break;
			}

			case "ArrowDown": {
				if (!select.hasAttribute("aria-expanded")) {
					openSelect(select);
				} else {
					let sibling = nextMatchingSibling(e.target, "button, a[href]");
					if (sibling) {
						sibling.focus();
					} else {
						select.querySelector("button").focus();
					}
				}
				break;
			}

			case "ArrowUp": {
				if (!select.hasAttribute("aria-expanded")) {
					openSelect(select);
				} else {
					let sibling = previousMatchingSibling(e.target, "button, a[href]");
					if (sibling) {
						sibling.focus();
					} else {
						let options = select.querySelectorAll("button");
						options[options.length - 1].focus();
					}
				}
				break;
			}

			case "Home": {
				select.querySelector("button").focus();
				break;
			}

			case "End": {
				select.querySelector("button:last-of-type").focus();
				break;
			}

			default: {
				// Filter options by text entered by keyboard

				select.nuiSearchTerm += e.key.toLowerCase();
				clearTimeout(timeout);

				timeout = setTimeout(() => {
					// select the option that starts with select.nuiSearchTerm
					for (let el of select.querySelectorAll("button")) {
						if (el.textContent.trim().toLowerCase().startsWith(select.nuiSearchTerm)) {
							selectOption(el, false);
						}
					}

					select.nuiSearchTerm = "";
				}, 200);
			}
		}

		return false;
	};

	let init = (host) => {
		if (!window.PointerEvent) {
			// CSS-only fallback when Pointer Events aren't supported

			return;
		}

		host.querySelectorAll(".n-select:not([data-ready])").forEach((el) => {
			let wrapper = el;

			if (el.tagName === "SELECT") {
				return;
			}

			el = el.querySelector(".n-select__options"); // Work with the inner wrapper
			if (!el) {
				let options = "";
				wrapper.querySelectorAll("option").forEach((el) => {
					options += `<button value="${el.value}">${el.textContent}</button>`;
				});

				el = document.createElement("span");
				el.insertAdjacentHTML("beforeend", options);
				wrapper.prepend(el);
			}
			el.nuiSelectWrapper = wrapper;
			el.classList.add("n-select__options");

			el.nuiNativeInput =
				el.nuiSelectWrapper.querySelector("select, input") ||
				nextMatchingSibling(el.nuiSelectWrapper, "select") ||
				document.querySelector(`[data-n_select="${el.nuiSelectWrapper.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)

			if (!el.nuiNativeInput) {
				// Missing native select, so generate it
				let input = document.createElement("select");
				input.name = el.dataset.name;
				wrapper.append(input);
				el.nuiNativeInput = input;
			}

			let initial_value = el.nuiNativeInput.value;
			let initial_option = el.querySelector(`button[value="${initial_value}"`);

			el.nuiNativeInput.innerHTML = "";

			wrapper.addEventListener("pointerdown", pointerDownSelect);

			el.addEventListener("click", clickSelect); // Selects a clicked (pointer upped) option

			el.addEventListener("focusout", (e) => {
				let select = e.target.closest(".n-select__options");

				// If relatedTarget isn't a sibling, close and focus on select wrapper

				if (select.hasAttribute("aria-expanded") && !!e.relatedTarget && e.relatedTarget.parentNode !== select) {
					closeSelect(select);
					select.nuiSelectWrapper.focus();
				}
			});

			el.ontransitionend = (e) => {
				let el = e.target;
				el.style.removeProperty("--mask-position-y");
				el.style.removeProperty("--mask-size-y");
				delete el.dataset.nSelectAnimation;
				el.addEventListener("pointerup", pointerUpSelect);
				// el.dataset.transitionend = true;
			};

			el.addEventListener("keydown", selectKeyboard);
			wrapper.addEventListener("keydown", selectKeyboard);
			el.addEventListener("keyup", trapKeyboard);
			wrapper.addEventListener("keyup", trapKeyboard);

			el.lastElementChild.onkeydown = (e) => {
				// Close select on tab outside. To do: get last button only
				if (e.key === "Tab" && !e.shiftKey && e.target.parentNode.hasAttribute("aria-expanded")) {
					closeSelect(e.target.parentNode);
					e.target.parentNode.nuiSelectWrapper.focus();
				}
			};

			el.querySelectorAll("button").forEach((el) => {
				el.type = "button"; // Unlike the default 'submit'
				el.value = el.value || el.textContent.trim();
			});

			wrapper.setAttribute("tabindex", 0);
			(el.querySelector("[aria-selected]") || el.firstElementChild).tabIndex = -1;

			wrapper.style.setProperty("--inline-width", `${el.getBoundingClientRect().width}px`);

			selectOption(el.querySelector("[aria-selected]") || initial_option || el.querySelector("button")); // Select the first option by default
			el.nuiSearchTerm = "";

			["n-select--rounded", "n-select--shadow"].forEach((cls) => {
				if (wrapper.classList.contains(cls)) {
					el.classList.add(cls);
				}
			});

			let label = el.closest("label") || document.querySelector(`label[for="${el.nuiNativeInput.id}"]`);

			if (label) {
				label.onclick = (e) => {
					let el = e.target;
					if (!el.closest(".n-select")) {
						e.preventDefault();
						el = el.closest("label");
						let select = el.querySelector(".n-select") || document.getElementById(el.getAttribute("for")).closest(".n-select");
						select.focus();
					}
				};
			}

			wrapper.dataset.ready = true;
			window.requestAnimationFrame(() => {
				wrapper.style.setProperty("--active-option-height", `${el.querySelector("[aria-selected]").getBoundingClientRect().height}px`);
				["--control-color", "--control-bg", "--control-active-color", "--control-active-bg", "--control-highlight"].forEach((i) => {
					el.style.setProperty(i, wrapper.style.getPropertyValue(i));
				});
			});
		});
	};

	typeof registerComponent === "function" ? registerComponent("n-select", init) : init(document.body);
})();

//→ nav.js:
'use strict';

// Component Nav – start
(function () {
  /* Nav – start */
  function closeDropNavClickedOutside(e) {
    // Close the nav when clicking outside
    if (!e.target.closest(".n-nav li")) {
      qa(".n-nav li").forEach((el) => {
        el.removeAttribute("aria-expanded");
      });
      if (q(".n-nav :focus")) {
        q(".n-nav :focus").blur();
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
    if (
      !el.nextElementSibling && // last item
      el.parentNode.parentNode.nodeName === "LI" && // of third-level nav
      !el.parentNode.parentNode.nextElementSibling
    ) {
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
  let closeItem = (item) => {
    navAnimating = true;
    item.style.overflow = "hidden";
    item.parentElement.setAttribute("aria-expanded", true);
    item.animate([{ height: `${item.scrollHeight}px` }, { height: 0 }], 200).onfinish = () => {
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
    item.animate([{ height: 0 }, { height: `${item.scrollHeight}px` }], 200).onfinish = () => {
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
    removeClass(ul, "n-right-overflow");
    ul.style.removeProperty("--n-right-overflow");
    //		var rect = ul.getBoundingClientRect(); // Firefox doesn't preserve this var
    if (ul.getBoundingClientRect().left > document.body.offsetWidth - (ul.getBoundingClientRect().left + ul.getBoundingClientRect().width)) {
      if (ul.getBoundingClientRect().right > window.innerWidth) {
        ul.style.setProperty("--n-right-overflow", window.innerWidth - ul.getBoundingClientRect().right + "px");
        addClass(ul, "n-right-overflow");
      }
      addClass(ul, "n-left-side");
    } else {
      removeClass(ul, "n-left-side");
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
        e.target
          .closest(".n-nav")
          .querySelectorAll("li")
          .forEach((el) => {
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
  window.addEventListener("resize", function (e) {
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
      makeReady(el.closest(".n-nav"));
    });
  };
  registerComponent("nav", init);
})();
// Component Nav – end

//→ notify.js:
'use strict';

// Component Notification bar – start
var componentNotify = (function () {
	function notifyClose(el) {
		if (!!el) {
			el.parentNode.removeChild(el);
		}
	}

	function notifyCloseEvent() {
		if (q(".n-notify")) {
			q(".n-notify").onclick = (e) => {
				notifyClose(e.target);
			};
		}
	}

	function notify(content, option) {
		document.body.insertAdjacentHTML("afterbegin", `<button class="n-notify${option && option.indexOf("fixed") !== -1 ? " n-notify--fixed" : ""}">${content}</button>`);
		q(".n-notify").focus();
		notifyCloseEvent();
		if (option && option.indexOf("timeout") !== -1) {
			setTimeout(() => {
				notifyClose(q(".n-notify"));
			}, 2000);
		}
	}
	let init = (host) => {
		/* Tooltip */
		host.querySelectorAll(".n-notify:not([data-ready])").forEach((el, i) => {
			notifyCloseEvent();
			makeReady(el);
		});
	};
	registerComponent("notify", init);
	return { notify: notify };
})();
// Component Notification bar – end

//→ parallax.js:
'use strict';

// Component Parallax – start
(function () {
	// Thanks Dave Rupert
	let parallaxSpeed = 0.2;
	let updateParallax = () => {
		qa(".n-parallax").forEach((el) => {
			let parent = el.parentElement;
			let scroll_offset = parent.scrollHeight > parent.offsetHeight ? Math.abs(parent.getBoundingClientRect().y) : document.body.scrollTop || document.documentElement.scrollTop;
			el.style.setProperty("--scrollparallax", scroll_offset * parallaxSpeed);
		});
	};
	if (q(".n-parallax")) {
		window.addEventListener("scroll", updateParallax, true);
	}
	let init = (host) => {};
	registerComponent("parallax", init);
})();
// Component Parallax – end

//→ table.js:
'use strict';

// Component Table – start
(function () {
	/* Sort parent table's rows by matching column number alternatively desc/asc on click */
	const toggleSort = (th) => {
		let previous = th.closest("tr").querySelector("td[data-ascending]");
		if (previous && previous !== th) {
			delete previous.dataset.ascending;
		}
		return th.toggleAttribute("data-ascending");
	};
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
	const comparer = (idx, asc) => (a, b) => ((v1, v2) => (v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
	let init = (host) => {
		host.querySelectorAll(".n-table:not([data-ready])").forEach((el) => {
			el.querySelectorAll("thead td button.n-table-sort, th button.n-table-sort").forEach((button) => button.addEventListener("click", (e) => {
				let th = e.target.closest("th") || e.target.closest("td");
				const tbody = th.closest("table").querySelector("tbody");
				Array.from(tbody.querySelectorAll("tr")).sort(comparer(Array.from(th.parentNode.children).indexOf(th), toggleSort(th))).forEach((tr) => tbody.appendChild(tr));
			}));
			addClass(wrap(el), "n-table__wrap");
			makeReady(el);
			el.parentNode.setAttribute("tabindex", 0);
		});
	};
	registerComponent("table", init);
})();
// Component Table – end

//→ tooltip.js:
'use strict';

// Component Tooltip – start
(function () {
	let setTipPosition = (tip) => {
		// Take up the most area available on top/right/bottom/left of the tool. Relative to body.
		let tool = document.querySelector('[data-n-tool="' + tip.getAttribute("for") + '"]');
		let rect = tool.getBoundingClientRect();
		let top = rect.top;
		let left = rect.left;
		let right = window.innerWidth - left - rect.width;
		let bottom = window.innerHeight - top - rect.height; // To do: check when body is shorter than viewport
		let area_top = top * window.innerWidth;
		let area_right = right * window.innerHeight;
		let area_bottom = bottom * window.innerWidth;
		let area_left = left * window.innerHeight;
		let body_rect = document.body.getBoundingClientRect();
		tip.removeAttribute("style");
		delete tip.dataset.position;
		let positionTop = () => {
			tip.style.bottom = 20 + body_rect.height + body_rect.y - top + "px";
			tip.style.maxHeight = top - 40 + "px";
			tip.style.left = `${rect.x + rect.width / 2 - tip.scrollWidth / 2}px`;
			tip.dataset.nPosition = "top";
		};
		let positionBottom = () => {
			tip.style.top = 20 - body_rect.y + top + rect.height + "px";
			tip.style.maxHeight = bottom - 40 + "px";
			tip.style.left = `${rect.x + rect.width / 2 - tip.scrollWidth / 2}px`;
			tip.dataset.nPosition = "bottom";
		};
		let positionLeft = () => {
			tip.style.left = "auto";
			tip.style.right = 20 + body_rect.width + body_rect.x - window.innerWidth + right + rect.width + "px";
			tip.style.maxWidth = left - 40 + "px";
			tip.style.top = `${-1 * body_rect.y + rect.top + rect.height / 2 - tip.scrollHeight / 2}px`;
			tip.dataset.nPosition = "left";
		};
		let positionRight = () => {
			tip.style.left = rect.x - body_rect.x + rect.width + 20 + "px";
			tip.style.maxWidth = right - 40 + "px";
			tip.style.top = `${-1 * body_rect.y + rect.top + rect.height / 2 - tip.scrollHeight / 2}px`;
			tip.dataset.nPosition = "right";
		};
		if (area_left > area_right) {
			if (area_top > area_bottom) {
				if (area_top > area_left) {
					// Top
					positionTop();
				} else {
					// Left
					positionLeft();
				}
			} else {
				if (area_bottom > area_left) {
					// Bottom
					positionBottom();
				} else {
					// Left
					positionLeft();
				}
			}
		} else {
			if (area_top > area_bottom) {
				if (area_top > area_right) {
					// Top
					positionTop();
				} else {
					// Right
					positionRight();
				}
			} else {
				if (area_bottom > area_right) {
					// Bottom
					positionBottom();
				} else {
					// Right
					positionRight();
				}
			}
		}
		let rect_tip = tip.getBoundingClientRect();
		let offset_y = 0;
		if (rect_tip.y < 0) {
			offset_y = Math.abs(rect_tip.y) + 10;
		} else {
			if (rect_tip.bottom > window.innerHeight) {
				offset_y = window.innerHeight - rect_tip.bottom - 10;
			}
		}
		tip.style.setProperty("--offset_y", offset_y + "px");
		let offset_x = 0;
		if (rect_tip.x < 0) {
			offset_x = Math.abs(rect_tip.x) + 10;
		} else {
			if (rect_tip.right > window.outerWidth) {
				offset_x = window.outerWidth - rect_tip.right - 10;
			}
		}
		tip.style.setProperty("--offset_x", offset_x + "px");
	};

	function getToolTip(e) {
		return document.querySelector('.n-tool__tip[for="' + e.target.closest(".n-tool").dataset.nTool + '"]');
	}
	let hideTip = (e) => {
		let tip = getToolTip(e);
		tip.removeAttribute("aria-expanded");
		tip.removeAttribute("style");
		delete tip.dataset.position;
	};
	let showTip = (e) => {
		let tip = getToolTip(e);
		tip.setAttribute("aria-expanded", true);
		setTipPosition(tip);
	};
	var init = (host) => {
		/* Tooltip */
		let tooltips = host.querySelectorAll(".n-tool").length;
		host.querySelectorAll(".n-tool:not([data-ready])").forEach((el) => {
			let tip = el.querySelector(".n-tool__tip");
			if (!tip) return;
			let content = tip.innerHTML;
			tip.innerHTML = "";
			tip.insertAdjacentHTML("afterbegin", "<span>" + content + "</span>");
			tip.setAttribute("for", tooltips);
			el.dataset.nTool = tooltips++;
			document.body.appendChild(tip);
			el.setAttribute("tabindex", 0);
			el.ontouchend = el.onmouseover = el.onfocus = showTip;
			el.onblur = el.onmouseout = hideTip;
			makeReady(el);
		});
	};
	registerComponent("tooltip", init);
})();
// Component Tooltip – end

//→ typography.js:
'use strict';

// Component Typography – start
(function () {
	let init = (host) => {
		/* Typography */
		if (typeof ResizeObserver === "function") {
			// Compensate element height according to line height
			let ro = new ResizeObserver((entries) => {
				entries.forEach((el) => {
					let a = el.target;
					a.style.removeProperty("--adjust-height");
					let style = getComputedStyle(a);
					let line_height = parseFloat(style.lineHeight);
					let adjust = line_height - (parseFloat(style.height) % line_height);
					if (adjust !== line_height) {
						a.style.setProperty("--adjust-height", adjust);
					}
				});
			});
			document.querySelectorAll(".n-adjust-height:not([data-ready])").forEach((el) => {
				ro.observe(el);
				el.dataset.ready = true;
			});
		}
	};
	registerComponent("typography", init);
})();
// Component Typography – end
initComponents(); return { initComponents, copyButton, componentModal, addComponent, componentNotify } })();
