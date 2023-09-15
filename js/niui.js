let nui = (() => {
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
                  [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(0, ${-1 * (to - (document.documentElement.scrollTop || document.body.scrollTop))}px, 0)` }], duration).onfinish = () => {
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
                        if (!!echo && nui.notify) {
                              nui.notify("📋 " + target.textContent, "fixed timeout");
                        }
                  } catch (err) {}
            });
      }
      // Real time touch detection to support devices with both touch and mouse. http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
      // To do: use an attribute instead of class
      (function() {
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
      // function makeReady(el) {
      //       el.dataset.ready = true;
      // }
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
            initComponents(host);
      }
      var current_slider = q(".n-carousel__content");
      var components = new Array();

      function registerComponent(name, init, componentFunction = false) {
            components[name] = new Array();
            components[name].push({ init: init });
            init(document);
            if (componentFunction) {
                  nui[componentFunction.name] = componentFunction.code;
            }
      }

      function initComponents(host = document.body) {
            observerOff();
            for (let key in components) {
                  components[key][0].init(host);
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
                  if (window.nui.dynamicInit) {
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
                  }
            });
      }
      // initThreshold(document.body);
      // Animate anchor link jumps
      // qa('a[href^="#"]').forEach((el) => {
      //   el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler
      // });
      initComponents();
      return { registerComponent, initComponents, copyButton, addComponent }
})();
nui.dynamicInit = true;// Component Button – start
(function() {
	let init = (host) => {
		const ripple = e => {
			let el = e.target.closest('.n-btn--ripple');
			let x = e.offsetX || el.clientWidth / 2;
			let y = e.offsetY || el.clientHeight / 2;
			let max_x = Math.max(x, el.clientWidth - x);
			let max_y = Math.max(y, el.clientHeight - y);
			let radius = Math.sqrt(max_x * max_x + max_y * max_y);
			el.style.transitionProperty = 'none';
			el.style.setProperty('--ripple-x', `${x}px`);
			el.style.setProperty('--ripple-y', `${y}px`);
			el.style.setProperty('--ripple-radius', `0px`);
			window.requestAnimationFrame(() => {
				el.style.transitionProperty = '';
				el.style.setProperty('--ripple-radius', `${radius}px`);
			});
		};
		document.querySelectorAll('.n-btn--ripple:not([data-ready])').forEach(el => {
			el.addEventListener('pointerdown', ripple);
			el.addEventListener('keydown', ripple);
			el.dataset.ready = true;
		});
	};
	nui.registerComponent("button", init);
})();
// Component Button – end
//# sourceMappingURL=button.js.map

// Component Form – start
(function() {
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
        el.classList.add("n-form--alert");
        // Margin animation, because transform animation hides neighbouring content on iPad
        let form = el.closest("form");
        form.animate([{ width: `${form.scrollWidth}px` }, { marginLeft: `-9px` }, { marginLeft: `18px` }, { width: `${form.scrollWidth}px`, marginLeft: 0 }], 250);
        return;
      } else {
        el.classList.remove("n-form--alert");
      }
    });
    return ready_to_submit;
  }

  function updateFileInput(e) {
    var el = e.target;
    el.parentNode.querySelector("span.n-form__file-name").innerHTML = el.value.substring(el.value.lastIndexOf("\\") + 1);
  }

  function toggleConditionalFieldset(e) {
    var el = e.target;
    var fieldset = document.querySelector(`fieldset#${el.closest(".n-form__condition").dataset.for}`) || el.closest(".n-form__condition").nextElementSibling;
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
      el.dataset.ready = true;
    });
  };
  nui.registerComponent("form", init);
})();
// Component Form – end
//# sourceMappingURL=form.js.map

// Component Accordion
(function() {
	const animate_options = el => { return { easing: "ease-in-out", duration: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? (el.dataset.duration * 1000 || getComputedStyle(el).getPropertyValue('--duration') * 1000 || 200) : 0 } };
	const accordionContent = el => el.querySelector(":scope > .n-accordion__content");
	const openAccordion = (el) => {
		el = accordionContent(el);
		window.requestAnimationFrame(() => {
			el.style.height = 0;
			el.style.overflow = "hidden";
			let wrapper = el.parentNode;
			wrapper.querySelector(":scope > .n-accordion__label button").setAttribute("aria-expanded", true);
			wrapper.dataset.expanded = true;
			el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options(wrapper)).onfinish = () => {
				el.style.height = el.style.overflow = "";
			};
		});
	};
	const closeAccordion = (el, callback) => {
		el = accordionContent(el);
		window.requestAnimationFrame(() => {
			el.style.overflow = "hidden";
			let wrapper = el.parentNode;
			el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options(wrapper)).onfinish = () => {
				el.style.height = el.style.overflow = "";
				wrapper.querySelector(":scope > .n-accordion__label button").setAttribute("aria-expanded", false);
				delete wrapper.dataset.expanded;
				typeof callback !== 'function' || callback();
				if (wrapper.classList.contains('n-accordion--close-nested')) {
					el.querySelectorAll(".n-accordion__label button[aria-expanded='true']").forEach(el => el.setAttribute("aria-expanded", false));
					el.querySelectorAll(".n-accordion").forEach(el => delete el.dataset.expanded);
				}
			};
		});
	};
	const toggleAccordion = (e) => {
		let el = e.target.closest('.n-accordion');
		if (!el.dataset.expanded) {
			let popin = el.closest(".n-accordion__popin");
			const updateRow = () => {
				if (popin) {
					let row = Math.floor(([...popin.children].indexOf(el) / getComputedStyle(popin).getPropertyValue("--n-popin-columns")) * 1) + 2;
					popin.style.setProperty("--n-popin-open-row", row);
				}
			};
			if (el.parentNode.matches('[role="group"]') || popin) {
				let other_accordion = el.parentNode.querySelector(":scope > .n-accordion[data-expanded]");
				if (other_accordion) {
					closeAccordion(other_accordion, () => {
						updateRow();
						openAccordion(el);
					});
				} else {
					updateRow();
					openAccordion(el);
				}
			} else {
				openAccordion(el);
			}
		} else {
			closeAccordion(el);
		}
	};

	function init(host = document) {
		host.querySelectorAll(".n-accordion:not([data-ready])").forEach((el) => {
			el.querySelector(":scope > input")?.remove(); // Remove CSS-only solution
			el.dataset.ready = true;
			let button = el.querySelector(':scope > .n-accordion__label button');
			button.addEventListener("click", toggleAccordion);
			if (button.getAttribute('aria-expanded') === 'true') {
				el.dataset.expanded = true;
			} else {
				button.setAttribute('aria-expanded', false);	
			}
		});
	}
	const doInit = () => {
		(typeof nui !== 'undefined' && typeof nui.registerComponent === "function") ? nui.registerComponent("n-accordion", init): init();
	};
	if (document.readyState !== "loading") {
		doInit();
	} else {
		document.addEventListener("DOMContentLoaded", doInit);
	}
})();
//# sourceMappingURL=n-accordion@npm.js.map

/* Modal – start */
(function() {
  var scroll_timeout;
  const blockScroll = e => {
    // console.log(e);
    // if (isSafari) {
    document.querySelectorAll('dialog.n-modal[open]').forEach(el => {
      el.classList.add('n-modal--transparent');
    });
    clearTimeout(scroll_timeout);
    scroll_timeout = setTimeout(() => {
      document.querySelectorAll('dialog.n-modal[open]').forEach(el => {
        el.classList.remove('n-modal--transparent');
      });
    }, 67);
    // } else {
    //   window.scrollTo(x, y);
    // }
  };

  function disableScrolling() {
    // window.onscroll = function() { window.scrollTo(x, y); };
    window.addEventListener('scroll', blockScroll, { 'passive': 'true' });
  }

  function enableScrolling() {
    // window.onscroll = function() {};
    window.removeEventListener('scroll', blockScroll);
  }
  // var previouslyFocused = previouslyFocused || false;
  function transferClass(origin, target, className) {
    let classes = typeof className === "string" ? new Array(className) : className;
    classes.forEach(el => {
      if (origin.classList.contains(el)) {
        target.classList.add(el);
      }
    });
  }
  const animationDuration = () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? (getComputedStyle(document.querySelector('.n-modal')).getPropertyValue('--duration') * 1000) : 0;
  let removeModal = e => {
    document.documentElement.classList.remove('transparent-scrollbar');
    let modal = e.target;
    modal.removeEventListener('close', removeModal);
    if (modal.existingDetachedElement) {
      // console.log(modal);
      if (!modal.existingModal) {
        let content = modal.querySelector('.n-modal__content');
        content.removeChild(content.firstElementChild);
      }
      delete modal.existingDetachedElement;
      modal.remove();
    }
    if (modal.attachedHiddenContent) {
      modal.replaceWith(modal.lastChild);
    } else {
      if (modal.dataset.existingAttachedContent) {
        modal.replaceWith(modal.lastChild.firstElementChild);
      } else {
        if (modal.existingModal) {
          delete modal.existingModal;
          delete modal.dataset.anim;
        } else {
          modal.remove();
        }
      }
    }
  };

  function closeModal(modal) {
    let direction_option = "normal";
    var animation = modal.dataset.anim; // Custom animation?
    if (!animation || animation.length < 11) {
      // '', 'null' or 'undefined'?
      animation = '[{ "transform": "translate3d(0,0,0)" }, { "transform": "translate3d(0,-100vh,0)" }]';
    } else {
      direction_option = "reverse";
    }
    modal.classList.add('n-modal--closing');
    setTimeout(() => { modal.classList.remove('n-modal--closing'); }, animationDuration());
    modal.animate(JSON.parse(animation), { duration: animationDuration(), direction: direction_option, easing: "ease-in-out" }).onfinish = () => {
      enableScrolling();
      // nuiDisableBodyScroll(false, modal); // Turn off and restore page scroll
      if (modal.existingModal) {
        if (!modal.existingDetachedElement) {
          modal.removeEventListener('close', removeModal);
        }
        // delete modal.existingModal;
        delete modal.dataset.anim;
      }
      modal.close();
      // document.querySelector("html").classList.remove("no-scroll");
      // window.scrollTo(modal.previousScrollX, modal.previousScrollY);
    };
  }

  function openModal(options) {
    // options: {content: ""/element, animation: "", trigger: element, closeSymbol: "", closeLabel: ""}
    // content is either an HTML string or an element
    // options can be solely content if it's a string or element
    // Fix Chrome flashing disappearing scrollbars on open
    document.documentElement.style.overflow = 'scroll';
    const scrollbar_width = window.innerWidth - document.documentElement.offsetWidth;
    document.documentElement.style.overflow = '';
    if (!scrollbar_width) { // Because Chrome flashes disappearing scrollbars on open (Mac)
      document.documentElement.classList.add('transparent-scrollbar');
    }
    if (typeof options === 'string' || !!options.tagName) {
      options = { content: options };
    }
    let animation = options.animation;
    let content = options.content;
    let trigger = options.trigger;
    var wrapper = {};
    var existingDetachedElement = false;
    if (content.parentNode) {
      // console.log(content.parentNode);
      if (content.parentNode.tagName === 'DIALOG' || content.parentNode.classList.contains('n-modal__content')) {
        return;
      }
    } else {
      if (content.tagName) {
        existingDetachedElement = true;
      }
    }
    const close_label = 'Close';
    const close_symbol = '╳';
    if (typeof content === 'object' && content.tagName === 'DIALOG') {
      if (!content.parentNode) { // Detached modal
        document.body.appendChild(content);
      }
      wrapper = content;
      wrapper.existingModal = true;
      let close_button = wrapper.querySelector('.n-modal__close');
      if (close_button) {
        close_button.dataset.closeSymbol = close_button.dataset.closeSymbol || close_symbol;
        close_button.ariaLabel = close_button.ariaLabel || close_label;
      }
    } else {
      wrapper = document.createElement("dialog");
      wrapper.insertAdjacentHTML("afterbegin", `<button class="n-modal__close" aria-label="${options.closeLabel || trigger?.dataset.closeLabel || close_label}" data-close-symbol="${options.closeSymbol || trigger?.dataset.closeSymbol || close_symbol}"></button><div class="n-modal__content"></div>`);
      document.createElement("div");
      if (typeof content === "string") {
        wrapper.lastChild.innerHTML = content;
        document.body.appendChild(wrapper);
      } else {
        let parent = content.parentElement;
        if (parent) {
          let marker = document.createElement('div');
          content.replaceWith(marker);
          wrapper.lastChild.appendChild(content);
          marker.replaceWith(wrapper);
          if (content.classList.contains('n-modal__content')) {
            wrapper.lastChild.replaceWith(content);
            wrapper.attachedHiddenContent = true;
          } else {
            wrapper.dataset.existingAttachedContent = true;
          }
        } else {
          wrapper.lastChild.appendChild(content);
          document.body.appendChild(wrapper);
        }
      }
    }
    if (options.blur) {
      wrapper.classList.add('n-modal--blur');
    }
    if (options.shadow) {
      wrapper.classList.add('n-modal--shadow');
    }
    if (options.rounded) {
      wrapper.classList.add('n-modal--rounded');
    }
    if (options.full) {
      wrapper.classList.add('n-modal--full');
    }
    wrapper.dataset.anim = animation;
    wrapper.classList.add("n-modal");
    wrapper.onclick = (e) => {
      let el = e.target.closest('.n-modal');
      let button = e.target.closest('.n-modal__close');
      if (button || (e.target.matches('.n-modal') && (e.offsetX < 0 || e.offsetY < 0 || (e.offsetX - 2) > el.getBoundingClientRect().width || (e.offsetY - 2) > el.getBoundingClientRect().height))) {
        closeModal(el);
      }
    };
    wrapper.addEventListener("cancel", e => {
      e.preventDefault();
      closeModal(e.target.closest('.n-modal'));
    });
    if (existingDetachedElement) {
      wrapper.existingDetachedElement = true;
    }
    wrapper.showModal();
    // nuiDisableBodyScroll(true, wrapper); // Turn on and block page scroll
    // if (document.querySelectorAll(".n-modal").length === 1) {
    //   // Sole (first) modal
    //   wrapper.previousScrollX = window.scrollX;
    //   wrapper.previousScrollY = window.scrollY;
    // }
    // document.querySelector("html").classList.add("no-scroll");
    wrapper.animate(typeof animation === "string" ? JSON.parse(animation) : [{ transform: "translate3d(0,-100vh,0)" }, { transform: "translate3d(0,0,0)" }], {
      duration: animationDuration(),
      easing: "ease-in-out",
    }).onfinish = () => {
      wrapper.addEventListener('close', removeModal);
      disableScrolling();
    };
    return wrapper;
  }

  function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument("Parsed");
    tmp.body.innerHTML = str;
    // To do: destroy the HTMLDocument before returning
    return tmp.body;
  }

  function modalWindowLink(e) {
    // Modal window of external file content
    var el = e.target;
    let trigger = el.closest(".n-modal-link");
    var link = trigger.dataset.href || trigger.href; // data-href for <button>, href for <a>
    var animation = trigger.dataset.anim;
    const openTheModal = content => transferClass(trigger, openModal({ content: content, animation: animation, trigger: trigger }), ["n-modal--full", "n-modal--rounded", "n-modal--shadow", "n-modal--blur"]);
    if (trigger.dataset.for) {
      openTheModal(document.getElementById(trigger.dataset.for));
    } else {
      fetch(link.split("#")[0]).then(response => response.text()).then(response => {
        var parsed = parseHTML(response);
        var container = !!link.split("#")[1] ? "#" + link.split("#")[1].split('?')[0] : 0;
        if (container && parsed.querySelector(container)) {
          parsed = parsed.querySelector(container).innerHTML;
        } else {
          parsed = parsed.innerHTML;
        }
        openTheModal(parsed);
      }).catch(error => {
        openTheModal(error);
      });
    }
    return false;
  }
  let init = (host = document) => {
    // Modal window: open a link's target inside it
    host.querySelectorAll(".n-modal-link:not([data-ready])").forEach((el) => {
      if (el.href !== location.href.split("#")[0] + "#") {
        // Is it an empty anchor?
        el.onclick = modalWindowLink;
      }
      if (el.href && !el.getAttribute("rel")) {
        el.setAttribute("rel", "prefetch");
      }
      el.dataset.ready = true;
    });
  };
  let hash_modal = document.querySelector(`.n-modal${location.hash}.n-modal--uri`);
  if (location.hash && hash_modal) {
    openModal(hash_modal);
  }
  // API
  let modal = openModal;
  modal.close = closeModal;
  modal.init = init;
  if (typeof nui !== 'undefined' && typeof nui.registerComponent === "function") {
    nui.registerComponent("n-modal", init, { 'name': 'modal', 'code': modal });
  } else {
    init();
    window.nui = {};
    window.nui.modal = modal;
  } // Is it a part of niui, or standalone?
})();
/* Modal – end */
//# sourceMappingURL=n-modal@npm.js.map

function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function t(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return (r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}if(!("onscrollend"in window)){var n=function(e,t,n){var r=e[t];e[t]=function(){var e=Array.prototype.slice.apply(arguments,[0]);r.apply(this,e),e.unshift(r),n.apply(this,e);};},r=function(e,t,n,r){if("scroll"==t||"scrollend"==t){var o=this,s=l.get(o);if(void 0===s){var c=0;s={scrollListener:function(e){clearTimeout(c),c=setTimeout(function(){a.size?setTimeout(s.scrollListener,100):(o.dispatchEvent(i),c=0);},100);},listeners:0},e.apply(o,["scroll",s.scrollListener]),l.set(o,s);}s.listeners++;}},o=function(e,t,n){if("scroll"==t||"scrollend"==t){var r=this,o=l.get(r);void 0!==o&&(o[t]--,--o.listeners>0||(e.apply(r,["scroll",o.scrollListener]),l.delete(r)));}},i=new Event("scrollend"),a=new Set;document.addEventListener("touchstart",function(e){for(var n,r=t(e.changedTouches);!(n=r()).done;)a.add(n.value.identifier);},{passive:!0}),document.addEventListener("touchend",function(e){for(var n,r=t(e.changedTouches);!(n=r()).done;)a.delete(n.value.identifier);},{passive:!0});var l=new WeakMap;n(Element.prototype,"addEventListener",r),n(window,"addEventListener",r),n(document,"addEventListener",r),n(Element.prototype,"removeEventListener",o),n(window,"removeEventListener",o),n(document,"removeEventListener",o);}

// import './node_modules/n-modal/n-modal.js';

(function() {
  const ceilingWidth = el => Math.ceil(parseFloat(getComputedStyle(el).width));
  const ceilingHeight = el => Math.ceil(parseFloat(getComputedStyle(el).height));
  const focusableElements = 'button, [href], input, select, textarea, details, summary, video, [tabindex]:not([tabindex="-1"])';
  // const _focusableElementsString =  'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),details,summary,iframe,object,embed,[contenteditable]';
  function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.offsetHeight) /* or $(window).height() */ && rect.right <= (window.innerWidth || document.documentElement.offsetWidth) /* or $(window).width() */ );
  }
  const default_duration = 500;
  const default_interval = 4000;
  const isChrome = !!navigator.userAgent.match("Chrome");
  const isSafari = navigator.userAgent.match(/Safari/) && !isChrome;
  const isEndless = el => el.children.length > 2 && el.parentElement.classList.contains("n-carousel--endless");
  const isFullScreen = () => { return !!(document.webkitFullscreenElement || document.fullscreenElement) };
  const isModal = el => { return el.closest(".n-carousel").classList.contains('n-carousel--overlay') };
  const isVertical = el => el.closest(".n-carousel").matches(".n-carousel--vertical");
  const isAutoHeight = el => el.closest(".n-carousel").matches(".n-carousel--auto-height");
  const indexControls = index => {
    let controls_by_class = index.querySelectorAll('.n-carousel__control');
    return (controls_by_class.length > 0) ? controls_by_class : index.querySelectorAll('a, button');
  };
  const scrollEndAction = carousel => {
    carousel = carousel.target || carousel;
    // console.log('scroll end', carousel);
    let index = Math.abs(Math.round(
      (isVertical(carousel) ? carousel.scrollTop / (carousel.offsetHeight - parseFloat(getComputedStyle(carousel).paddingBlockStart) - parseFloat(getComputedStyle(carousel).paddingBlockEnd)) : carousel.scrollLeft / (carousel.offsetWidth - parseFloat(getComputedStyle(carousel).paddingInlineStart) - parseFloat(getComputedStyle(carousel).paddingInlineEnd))), 2));
    // console.log('scroll end', index);
    let slide = carousel.children[index];
    if (!!carousel.parentNode.sliding || (carousel.dataset.next && parseInt(carousel.dataset.next) !== [...carousel.children].indexOf(slide))) {
      return;
    }
    // console.log(index);
    carousel.parentNode.dataset.sliding = true;
    delete carousel.dataset.next;
    observersOff(carousel);
    carousel.scrollLeft;
    carousel.scrollTop;
    let interval = 10; // Get rid of this magic number by timeout comparison with previous scroll offset
    let timeout_function = () => {
      // console.log(entry, entry.target, 'is intersecting at', entry.target.parentElement.scrollLeft, entry.target.parentElement.scrollTop);
      // if (Math.abs(x - carousel.scrollLeft) >= 1) {
      //   console.log('intersection continue', x, carousel.scrollLeft, y, carousel.scrollLeft);
      //   clearTimeout(timeout);
      //   timeout = setTimeout(timeout_function, interval);
      //   return;
      // }
      // console.log('intersection ', x, carousel.scrollLeft, y, carousel.scrollLeft);
      let index = [...carousel.children].indexOf(slide);
      if (isAutoHeight(carousel)) {
        let old_height = parseFloat(getComputedStyle(carousel).height);
        let new_height;
        let offset_y = 0;
        let lastScrollX = carousel.scrollLeft;
        let lastScrollY = carousel.scrollTop;
        if (isVertical(carousel)) {
          let scroll_offset = carousel.scrollTop;
          slide.style.height = 'auto';
          let computed_max_height = getComputedStyle(carousel).maxHeight;
          let max_height = computed_max_height.match(/px/) ? Math.ceil(parseFloat(computed_max_height)) : 99999;
          // new_height = Math.min(slide.scrollHeight, max_height);
          new_height = Math.min(Math.ceil(parseFloat(getComputedStyle(slide).height)), max_height);
          // new_height = slide.scrollHeight;
          if (isModal(carousel) || isFullScreen()) {
            old_height = new_height = carousel.offsetHeight;
          }
          slide.style.height = '';
          carousel.scrollTop = scroll_offset;
          offset_y = index * new_height - carousel.scrollTop;
        } else {
          new_height = nextSlideHeight(slide); // ?
          // console.log(lastScrollX);
          if (!!lastScrollX) { // Because RTL auto height landing on first slide creates an infinite intersection observer loop
            scrollTo(carousel, lastScrollX, lastScrollY);
          }
        }
        if (old_height === new_height) {
          new_height = false;
        }
        // interSecObs.unobserve(slide);
        window.requestAnimationFrame(() => {
          scrollAnimate(carousel, 0, offset_y, new_height, old_height).then(() => {});
        });
      } else {
        // console.log(carousel);
        window.requestAnimationFrame(() => {
          updateCarousel(carousel);
        });
      }
    };
    setTimeout(timeout_function, interval);
  };
  const hashNavigation = e => { // Hash navigation support
    // console.log(e);
    if (!!location.hash) {
      let el = document.querySelector(location.hash);
      let carousel = el?.parentNode;
      if (!!carousel && carousel.classList.contains('n-carousel__content') && !carousel.parentNode.closest('.n-carousel__content')) {
        let modal_carousel = document.querySelector('.n-carousel--overlay > .n-carousel__content');
        if (modal_carousel && modal_carousel !== carousel) {
          closeModal(modal_carousel);
          // modal_carousel.parentNode.classList.remove('n-carousel--overlay');
        }
        if (carousel.parentNode.classList.contains('n-carousel--inline')) {
          closeModal(carousel);
          // carousel.parentNode.classList.add('n-carousel--overlay');
        }
        if (isSafari) { // Safari has already scrolled and needs to rewind it scroll position in order to animate it
          scrollTo(carousel, carousel.offsetWidth * carousel.dataset.x, carousel.offsetHeight * carousel.dataset.y);
        }
        slideTo(carousel, [...carousel.children].indexOf(el));
        window.nCarouselNav = [carousel, location.hash];
      }
    } else {
      if (window.nCarouselNav) { // Previously navigated to a slide
        let carousel = window.nCarouselNav[0];
        delete window.nCarouselNav;
        if (isSafari) { // Safari has already scrolled and needs to rewind it scroll position in order to animate it
          scrollTo(carousel, carousel.offsetWidth * carousel.dataset.x, carousel.offsetHeight * carousel.dataset.y);
        }
        slideTo(carousel, [...carousel.children].indexOf(carousel.querySelector(':scope > :not([id])')));
      }
    }
  };
  const nextSlideHeight = el => {
    el.style.height = 0;
    el.style.overflow = "auto";
    const height = el.scrollHeight; // Ceiling when subpixel
    el.style.height = el.style.overflow = "";
    return height;
  };
  // const scrollableAncestor = el => {
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
  const getIndex = el => 1 * (isVertical(el) ? el.dataset.y : el.dataset.x);
  const getIndexReal = el => {
    let active_slide = el.querySelector(':scope > [aria-current]');
    if (active_slide) {
      return [...el.children].indexOf(active_slide);
    } else {
      let hash_slide_index = (!!location.hash) ? [...el.children].indexOf(el.querySelector(`:scope > ${location.hash}`)) : 0;
      return (hash_slide_index > -1) ? hash_slide_index : 0;
    }
    // return active_slide ? [...el.children].indexOf(active_slide) : (el.querySelector(`:scope > ${location.hash}`) || 0);
  };
  const scrolledAncestor = el => {
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
  const scrolledAncestors = el => {
    let arr = [];
    let a = scrolledAncestor(el);
    while (a && typeof a.scrollLeft !== "undefined" && (a.scrollTop !== 0 || a.scrollLeft !== 0)) {
      arr.push(a);
      a = scrolledAncestor(a);
    }
    return arr;
  };
  const isRTL = el => getComputedStyle(el).direction === "rtl";
  const toggleFullScreen = el => {
    el = el.closest(".n-carousel");
    let carousel = el.querySelector(":scope > .n-carousel__content");
    const restoreScroll = () => {
      if (!isFullScreen()) {
        el.nuiAncestors.forEach(el => {
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
    carousel.togglingFullScreen = true;
    if (isFullScreen()) {
      // Exit full screen
      !!document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
      if (isSafari) {
        // When exit finishes, update the carousel because on Safari 14, position is wrong or the slide is invisible
        setTimeout(() => {
          el.style.display = "none";
          window.requestAnimationFrame(() => {
            el.style.display = "";
          });
        }, 0);
      }
      if (isVertical(el) && isAutoHeight(el)) {
        let updateExitFullScreen = e => {
          setTimeout(() => {
            let carousel = el.querySelector(":scope > .n-carousel__content");
            // console.log(carousel);
            // el.style.removeProperty('--height');
            // carousel.style.height = '';
            slideTo(carousel, parseInt(carousel.dataset.y));
          }, 100);
          el.removeEventListener('fullscreenchange', updateExitFullScreen);
        };
        el.addEventListener('fullscreenchange', updateExitFullScreen);
      }
    } else {
      // Enter full screen
      if (isSafari) {
        el.nuiAncestors = scrolledAncestors(el);
        el.nuiAncestors.forEach(el => {
          el.nuiScrollX = el.scrollLeft;
          el.nuiScrollY = el.scrollTop;
        });
        el.addEventListener("webkitfullscreenchange", restoreScroll, false);
      }!!el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen();
    }
  };
  const scrollStartX = el => el.scrollLeft; // Get correct start scroll position for LTR and RTL
  const scrollTo = (el, x, y) => {
    el.scrollTo(isRTL(el) ? -1 * Math.abs(x) : x, y); // Scroll to correct scroll position for LTR and RTL
  };
  const getScroll = el => (el === window ? {
    x: el.scrollX,
    y: el.scrollY
  } : {
    x: scrollStartX(el),
    y: el.scrollTop
  });
  let firstFocusableElement = null;
  let focusableContent = null;
  let lastFocusableElement = null;
  const focusHandler = e => {
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
  };
  const trapFocus = (modal, off = false) => {
    // FROM: https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
    // add all the elements inside modal which you want to make focusable
    firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    focusableContent = modal.querySelectorAll(focusableElements);
    lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
    if (off) {
      modal.removeEventListener("keydown", focusHandler);
    } else {
      modal.addEventListener("keydown", focusHandler);
      firstFocusableElement.focus();
    }
  };
  const inOutSine = (n) => (1 - Math.cos(Math.PI * n)) / 2;
  const paddingX = el => parseInt(getComputedStyle(el).paddingInlineStart) * 2;
  const paddingY = el => parseInt(getComputedStyle(el).paddingBlockStart) * 2;
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
  const closestCarousel = el => {
    var related_by_id = el.closest('[class*="n-carousel"]').dataset.for;
    if (!!related_by_id) {
      return document.getElementById(related_by_id).querySelector(".n-carousel__content");
    } else {
      return el.closest(".n-carousel").querySelector(".n-carousel__content");
    }
  };
  const scrollAnimate = (el, distanceX, distanceY, new_height, old_height = false) => new Promise((resolve, reject) => {
    // Thanks https://stackoverflow.com/posts/46604409/revisions
    let wrapper = el.closest(".n-carousel");
    if (!!wrapper.nextSlideInstant || !wrapper.dataset.ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches || wrapper.matches(".n-carousel--instant")) {
      scrollTo(el, getScroll(el).x + distanceX, getScroll(el).y + distanceY);
      el.style.height = `${new_height}px`;
      delete wrapper.nextSlideInstant;
      updateCarousel(el);
      resolve(el);
      return;
    }
    observersOff(el);
    let scroll_changing = true;
    if (distanceX === 0 && distanceY === 0) {
      scroll_changing = false;
    }
    if (!!new_height) {
      el.style.height = `${old_height}px`;
      if (isVertical(el) && isAutoHeight(el)) {
        el.style.setProperty('--subpixel-compensation', 0);
      }
    } else {
      if (!isVertical(el)) {
        el.style.height = "";
      }
    }
    var startx = getScroll(el).x;
    var starty = getScroll(el).y;
    var starth = parseInt(el.style.height);
    var distanceH = new_height - starth;
    var duration = parseFloat(el.parentNode.dataset.duration) * 1000 || default_duration;
    var start = null;
    let startAnim = (timeStamp) => {
      start = timeStamp;
      draw(timeStamp);
    };
    let draw = (now) => {
      if (now - start >= duration) { // sliding ends
        window.requestAnimationFrame(() => {
          scrollTo(el, startx + distanceX, starty + distanceY);
          if (new_height) {
            el.style.height = `${new_height}px`;
          }
          updateCarousel(el);
        });
        resolve(el);
        return;
      }
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
  const updateCarousel = (el, forced = false) => { // Forced means never skip unnecessary update
    // Called on init and scroll end
    observersOff(el);
    let saved_x = el.dataset.x; // On displaced slides and no change
    let saved_y = el.dataset.y;
    if (!el.togglingFullScreen) {
      if (el.openingModal) {
        delete el.openingModal;
        scrollTo(el, el.offsetWidth * el.dataset.x, el.offsetHeight * el.dataset.y);
      } else {
        el.dataset.x = Math.abs(Math.round(scrollStartX(el) / ceilingWidth(el.firstElementChild)));
        el.dataset.y = Math.abs(Math.round(el.scrollTop / ceilingHeight(el.firstElementChild)));
      }
    } else {
      delete el.togglingFullScreen;
    }
    // When inline
    if (el.dataset.x === "NaN") {
      el.dataset.x = 0;
    }
    if (el.dataset.y === "NaN") {
      el.dataset.y = 0;
    }
    let active_index = getIndex(el);
    if (active_index >= el.children.length) {
      active_index = el.children.length - 1;
    }
    // console.log('update at', active_index, el.dataset.x, el.dataset.y);
    let old_active_slide = el.querySelector(":scope > [aria-current]");
    let wrapper = el.parentElement;
    if (!isAutoHeight(wrapper)) {
      // Dynamic change from auto height to normal
      el.style.height = "";
    }
    let active_slide = el.children[active_index];
    if (old_active_slide && !forced) {
      if (active_slide === old_active_slide) {
        // Scroll snapping back to the same slide. Nothing to do here.
        el.dataset.x = saved_x;
        el.dataset.y = saved_y;
        observersOn(el);
        return;
      }
      old_active_slide.removeAttribute('aria-current');
      old_active_slide.style.height = "";
      if (!isVertical(el)) {
        el.style.height = "";
      }
    }
    // active_slide.ariaCurrent = true; // Unsupported by FF
    active_slide.setAttribute('aria-current', true);
    var active_index_logical = el.dataset.x = el.dataset.y = getIndexReal(el);
    // Endless carousel
    const restoreDisplacedSlides = el => {
      el.querySelectorAll(":scope > [data-first]").forEach(el2 => {
        el.append(el.firstElementChild);
        delete el2.dataset.first;
        active_index--;
      });
      el.querySelectorAll(":scope > [data-last]").forEach(el2 => {
        el.prepend(el.lastElementChild);
        delete el2.dataset.last;
        active_index++;
      });
    };
    wrapper.dataset.sliding = true;
    if (isEndless(el)) {
      if (active_index === 0) {
        if (!active_slide.dataset.first) {
          // Move the last one to the front as [data-first]
          if (el.lastElementChild.dataset.last) {
            delete el.lastElementChild.dataset.last;
            active_index_logical = 1;
          } else {
            el.lastElementChild.dataset.first = true;
          }
          el.prepend(el.lastElementChild);
          active_index = 1;
        } else {
          // Landed on fake first slide. Move it to the back, remove its [data-first] and move the first one to the back as [data-last]
          delete el.firstElementChild.dataset.first;
          el.append(el.firstElementChild);
          el.firstElementChild.dataset.last = true;
          el.append(el.firstElementChild);
          active_index_logical = el.children.length - 1;
          active_index = el.children.length - 2;
        }
      } else {
        if (active_index === el.children.length - 1) {
          if (!active_slide.dataset.last) {
            // Move the first one to the back as [data-last]
            if (el.firstElementChild.dataset.first) {
              delete el.firstElementChild.dataset.first;
              active_index_logical = el.children.length - 2;
            } else {
              el.firstElementChild.dataset.last = true;
            }
            el.append(el.firstElementChild);
            active_index = el.children.length - 2;
          } else {
            // Landed on fake last slide. Move it to the front, remove its [data-last] and move the last one to the front as [data-first]
            delete el.lastElementChild.dataset.last;
            el.prepend(el.lastElementChild);
            el.lastElementChild.dataset.first = true;
            el.prepend(el.lastElementChild);
            active_index_logical = 0;
            active_index = 1;
          }
        } else {
          // Middle slide
          restoreDisplacedSlides(el);
          active_index_logical = Math.max(0, [...el.children].indexOf(el.querySelector(":scope > [aria-current]"))); // Fixes position when sliding to/from first slide; max because of FF returning -1
        }
      }
      // window.requestAnimationFrame(() => { // Cause blinking
      el.dataset.x = el.dataset.y = active_index_logical;
      let scroll_x = ceilingWidth(el.firstElementChild) * active_index;
      let scroll_y = ceilingHeight(el.firstElementChild) * active_index;
      // console.log('updateCarousel() scrolling at', scroll_x);
      el.scroll_x = scroll_x;
      el.scroll_y = scroll_y;
      scrollTo(el, scroll_x, scroll_y); // First element size, because when Peeking, it differs from carousel size
      delete el.scroll_x;
      delete el.scroll_y;
      // });
    } else { // Check and restore dynamically disabled endless option
      restoreDisplacedSlides(el);
      active_index_logical = Math.max(0, [...el.children].indexOf(el.querySelector(":scope > [aria-current]"))); // Fixes position when sliding to/from first slide; max because of FF returning -1
    }
    active_slide.style.height = "";
    wrapper.style.setProperty("--height", `${isAutoHeight(el) ? nextSlideHeight(active_slide) : active_slide.scrollHeight}px`);
    window.requestAnimationFrame(() => {
      if (!el.parentNode.dataset.ready && isAutoHeight(el) && isVertical(el)) {
        el.style.height = `${parseFloat(getComputedStyle(el).height) - paddingY(el)}px`;
      }
    });
    // Sliding to a slide with a hash? Update the URI
    if (getComputedStyle(el).visibility !== 'hidden') {
      let previously_active = document.activeElement;
      let hash = active_slide.id;
      if (!!el.parentNode.dataset.ready && !!hash && !el.parentNode.closest('.n-carousel__content')) { // Hash works only with top-level carousel
        location.hash = `#${hash}`;
      }
      if (!!el.parentNode.dataset.ready && !hash && !el.parentNode.closest('.n-carousel__content') && window.nCarouselNav) { // Hash works only with top-level carousel
        location.hash = '';
      }
      previously_active.focus();
    }
    // Fix buttons
    let index = getControl(el.closest(".n-carousel"), ".n-carousel__index");
    if (!!index) {
      index.querySelector("[aria-current]")?.removeAttribute('aria-current');
      // index.children[active_index_logical].ariaCurrent = true; // Unsupported by FF
      indexControls(index)[active_index_logical].setAttribute('aria-current', true);
    }
    // Disable focus on children of non-active slides
    // Active slides of nested carousels should also have disabled focus
    [...el.children].forEach(el => { // Native "inert" attribute to replace the below "focusDisabled" loops from June 2022. 
      el.inert = (el === active_slide) ? false : true;
      if (isSafari && el.querySelector('.n-carousel:-webkit-full-screen')) {
        // Safari full screen bug: parent scroll resets to 0, first slide becomes active and the full screen child lightbox is inside an inert parent
        let current = el.parentNode.querySelector(':scope > [aria-current="true"]');
        current.inert = true;
        current.removeAttribute('aria-current');
        el.inert = false;
        el.setAttribute('aria-current', true);
      }
    });
    // Obsoleted by inert – start
    // [...el.children].forEach((slide) => {
    //   if (slide !== active_slide) {
    //     slide.setAttribute('aria-hidden', true);
    //     slide.querySelectorAll(focusableElements).forEach((el2) => {
    //       if (el2.closest(".n-carousel__content > :not([aria-current])")) {
    //         if (el2.getAttribute("tabindex") && !el2.dataset.focusDisabled) {
    //           el2.dataset.oldTabIndex = el2.tabIndex;
    //         }
    //         el2.dataset.focusDisabled = true;
    //         el2.tabIndex = -1;
    //       }
    //     });
    //   }
    // });
    // active_slide.removeAttribute('aria-hidden');
    // active_slide.querySelectorAll("[data-focus-disabled]").forEach((el2) => {
    //   if (!el2.closest(".n-carousel__content > :not([aria-current])")) {
    //     el2.removeAttribute("tabindex");
    //     delete el2.dataset.focusDisabled;
    //     if (!!el2.dataset.oldTabIndex) {
    //       el2.tabIndex = el2.dataset.oldTabIndex;
    //       delete el2.dataset.oldTabIndex;
    //     }
    //   }
    // });
    // Obsoleted by inert – end
    if (/--vertical.*--auto-height/.test(wrapper.classList)) { // Undo jump to wrong slide when sliding to the last one
      el.scrollTop = el.offsetHeight * active_index_logical;
    }
    window.requestAnimationFrame(() => {
      observersOn(el);
    });
  };
  const slide = (el, offsetX = 0, offsetY = 0, index) => {
    clearTimeout(el.nCarouselTimeout);
    if (!el.parentNode.dataset.sliding) {
      el.parentNode.dataset.sliding = true;
      let old_height = el.children[getIndexReal(el)].offsetHeight;
      let new_height = old_height;
      if (isAutoHeight(el)) {
        let old_scroll_left = scrollStartX(el);
        let old_scroll_top = el.scrollTop;
        let slide = el.children[index];
        if (isVertical(el)) {
          slide.style.height = 'auto';
          let computed_max_height = getComputedStyle(el).maxHeight;
          let max_height = computed_max_height.match(/px/) ? Math.ceil(parseFloat(computed_max_height)) : 99999;
          // new_height = Math.min(slide.scrollHeight, max_height);
          new_height = Math.min(Math.ceil(parseFloat(getComputedStyle(slide).height)), max_height);
          // new_height = slide.scrollHeight;
          slide.style.height = '';
        } else {
          new_height = nextSlideHeight(slide);
          let old_height = getIndexReal(el) === index ? new_height : nextSlideHeight(el.children[getIndexReal(el)]);
          el.parentNode.style.setProperty("--height", `${old_height}px`);
        }
        scrollTo(el, old_scroll_left + paddingX(el) / 2, old_scroll_top); // iPad bug
        scrollTo(el, old_scroll_left, old_scroll_top);
      }
      if (isVertical(el)) {
        if ((isModal(el) || isFullScreen()) && isAutoHeight(el)) {
          old_height = new_height = el.offsetHeight;
        }
        offsetY = offsetY - index * old_height + index * new_height;
      }
      // console.log(index, offsetX, offsetY);
      window.requestAnimationFrame(() => {
        if (!el.parentNode.dataset.duration && !isAutoHeight(el)) { // Unspecified duration, no height change – using native smooth scroll
          delete el.parentNode.dataset.sliding;
          el.dataset.next = index;
          el.scrollTo({
            top: el.scrollTop + offsetY,
            left: el.scrollLeft + offsetX,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? "auto" : "smooth"
          });
        } else {
          scrollAnimate(el, offsetX, offsetY, new_height === old_height ? false : new_height, old_height); // Vertical version will need ceiling value
        }
      });
    }
  };
  const slideNext = el => {
    let index = getIndexReal(el);
    slideTo(el, index >= el.children.length - 1 ? 0 : index + 1);
  };
  const slidePrevious = el => {
    let index = getIndexReal(el);
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
  const carouselKeys = e => {
    // console.log('keydown', e);
    // return;
    let keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    let el = e.target.closest('.n-carousel').querySelector(':scope > .n-carousel__content');
    // if (e.key === "Tab") {
    //   let carousel = el.closest(".n-carousel__content");
    //   carousel.tabbing = true;
    // }
    if (
      // el.matches(".n-carousel__content") && 
      keys.includes(e.key)) {
      // Capture relevant keys
      // e.preventDefault();
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
  const slidePreviousEvent = e => slidePrevious(closestCarousel(e.target.closest('[class*="n-carousel"]')));
  const slideNextEvent = e => slideNext(closestCarousel(e.target.closest('[class*="n-carousel"]')));
  const slideIndexEvent = e => {
    let el = e.target.closest("a, button");
    if (el && !(el.href && (e.ctrlKey || e.metaKey))) {
      const wrapper = document.querySelector(`.n-carousel#${el.parentNode.dataset.for}`) || el.closest(".n-carousel");
      const carousel = wrapper.querySelector(":scope > .n-carousel__content");
      let new_index = [...indexControls(el.parentNode)].indexOf(el);
      if (isEndless(carousel)) {
        var old_index = getIndex(carousel);
        if (old_index === 0) {
          if (new_index === carousel.children.length - 1) {
            new_index = 0;
          } else {
            new_index++;
          }
        }
        if (old_index === carousel.children.length - 1) {
          if (new_index === 0) {
            new_index = carousel.children.length - 1;
          } else {
            new_index--;
          }
        }
      }
      if (wrapper.classList.contains("n-carousel--inline") && !isModal(carousel)) { // Opening an inline carousel
        wrapper.nextSlideInstant = true;
        // wrapper.classList.add("n-carousel--overlay"); // Should trigger mutation and auto update?
        openModal(carousel);
        // Set new x, y
        window.requestAnimationFrame(() => {
          carousel.dataset.x = carousel.dataset.y = new_index;
          scrollTo(carousel, carousel.offsetWidth * carousel.dataset.x, carousel.offsetHeight * carousel.dataset.y);
          document.body.dataset.frozen = document.body.scrollTop;
          updateCarousel(carousel);
        });
      } else {
        window.requestAnimationFrame(() => {
          slideTo(carousel, new_index);
        });
      }
      return false;
    }
  };
  const closeModalOnBodyClick = e => {
    let overlay = document.querySelector('.n-carousel--overlay');
    if (overlay && e.key === 'Escape') {
      closeModal(overlay);
    }
  };
  const closeModal = el => {
    if (isFullScreen()) {
      !!document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
    }
    let carousel = closestCarousel(el);
    if (carousel) {
      carousel.closest(".n-carousel").classList.remove("n-carousel--overlay");
      trapFocus(carousel.closest(".n-carousel"), true); // Disable focus trap
      delete document.body.dataset.frozen;
    }
    document.body.removeEventListener('keyup', closeModalOnBodyClick);
  };
  const openModal = el => {
    let carousel = closestCarousel(el);
    if (carousel) {
      carousel.openingModal = true;
      carousel.closest(".n-carousel").classList.add("n-carousel--overlay");
      trapFocus(carousel.closest(".n-carousel"));
      setTimeout(() => { document.body.addEventListener('keyup', closeModalOnBodyClick); }, 100);
    }
  };
  const autoHeightObserver = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      entries.forEach(e => {
        let slide = e.target.querySelector(":scope > [aria-current]");
        let el = slide.closest(".n-carousel__content");
        if (!el.parentElement.dataset.sliding) {
          // console.log(e.target);
          el.parentNode.style.removeProperty('--height');
          if (isVertical(el)) {
            slide.style.height = 'auto';
            el.style.height = `${slide.scrollHeight}px`;
            slide.style.height = '';
            updateCarousel(el);
          } else {
            el.style.height = '';
            el.style.height = `${slide.scrollHeight}px`;
            updateCarousel(el, true);
          }
        }
      });
    });
  });
  const updateSubpixels = el => {
    if (!el.parentNode.dataset.sliding) {
      // Round down the padding, because sub pixel padding + scrolling is a problem
      let carousel = el;
      carousel.style.padding = ''; // Subpixel peeking fix
      carousel.style.removeProperty("--peek-int");
      carousel.style.padding = isVertical(carousel) ? `${parseInt(getComputedStyle(carousel).paddingBlockStart)}px 0` : `0 ${parseInt(getComputedStyle(carousel).paddingInlineStart)}px`;
      if (carousel.style.padding === '0px') {
        carousel.style.padding = '';
      } else {
        // For Safari, which doesn't support inline end padding in a scrollable container
        carousel.style.setProperty("--peek-int", isVertical(carousel) ? `${parseInt(getComputedStyle(carousel).paddingBlockStart)}px 0 0 0` : `0 ${parseInt(getComputedStyle(carousel).paddingInlineStart)}px 0 0`);
      }
      window.requestAnimationFrame(() => {
        if (isVertical(el)) {
          carousel.style.setProperty("--subpixel-compensation", Math.ceil(carousel.getBoundingClientRect().height) - carousel.getBoundingClientRect().height);
        } else {
          carousel.style.setProperty("--subpixel-compensation", Math.ceil(carousel.getBoundingClientRect().width) - carousel.getBoundingClientRect().width);
        }
        let offset = getIndexReal(carousel); // Real offset including displaced first/last slides
        scrollTo(carousel, offset * ceilingWidth(carousel.firstElementChild), offset * ceilingHeight(carousel.firstElementChild));
      });
    }
  };
  const observersOn = el => {
    window.requestAnimationFrame(() => {
      if (el.scroll_x && el.scroll_y) {
        scrollTo(el, el.scroll_x, el.scroll_y);
      }
      if (el.parentNode.matches(".n-carousel--vertical.n-carousel--controls-outside.n-carousel--auto-height")) {
        height_minus_index.observe(el.parentNode);
      } else {
        height_minus_index.unobserve(el.parentNode);
      }
      subpixel_observer.observe(el);
      mutation_observer.observe(el.parentNode, {
        attributes: true,
        attributeFilter: ["class"],
      });
      el.addEventListener('scrollend', scrollEndAction);
      // setTimeout(() => {
      delete el.parentNode.dataset.sliding;
      // }, 50); // Because intersection observer fires again
      if (!("onscrollend" in window) && isEndless(el)) { // Fix for browsers without scrollend event (Safari) losing parts of the edge slide
        scrollTo(el, el.offsetWidth * getIndexReal(el), el.offsetHeight * getIndexReal(el));
      }
    });
  };
  const observersOff = el => {
    height_minus_index.unobserve(el.parentNode);
    subpixel_observer.unobserve(el);
    el.observerStarted = true;
    el.removeEventListener('scrollend', scrollEndAction);
  };
  const updateObserver = el => {
    observersOff(el);
    const doUpdate = el => {
      updateSubpixels(el);
      window.requestAnimationFrame(() => {
        let current_height = el.querySelector(":scope > [aria-current]").scrollHeight + "px";
        let previous_height = getComputedStyle(el).getPropertyValue("--height");
        if (current_height !== previous_height) {
          el.parentNode.style.setProperty("--height", current_height);
        }
        observersOn(el);
      });
    };
    doUpdate(el);
    el.querySelectorAll('.n-carousel__content').forEach(el => doUpdate(el));
  };
  const subpixel_observer = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      entries.forEach(e => {
        let el = e.target;
        if (!!el.observerStarted) {
          el.observerStarted = false;
          return;
        }
        updateObserver(el);
      });
    });
  });
  const mutation_observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.target && !mutation.target.nextSlideInstant) {
        let carousel = mutation.target.querySelector(":scope > .n-carousel__content");
        updateObserver(carousel);
        updateCarousel(carousel, true);
      }
    }
  });
  const setIndexWidth = el => {
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
    // Limit outside index height to carousel height
    window.requestAnimationFrame(() => {
      // Observing the carousel wrapper
      entries.forEach(e => {
        let el = e.target;
        setIndexWidth(el);
      });
    });
  });
  const init = (host = document) => {
    host.querySelectorAll(".n-carousel:not([data-ready])").forEach(el => {
      const previous = getControl(el, ".n-carousel__previous");
      const next = getControl(el, ".n-carousel__next");
      const index = getControl(el, ".n-carousel__index");
      const close_modal = getControl(el, ".n-carousel__close");
      const full_screen = getControl(el, ".n-carousel__full-screen");
      const content = el.querySelector(":scope > .n-carousel__content");
      if (!content) {
        return;
      }
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
        close_modal.onclick = e => {
          if (e.target.closest('.n-carousel').classList.contains('n-carousel--overlay')) {
            closeModal(e.target);
          } else {
            openModal(e.target);
          }
        };
      }
      if (!!full_screen) {
        full_screen.onclick = e => {
          let carousel = e.target.closest(".n-carousel").querySelector(":scope > .n-carousel__content");
          carousel.dataset.xx = carousel.dataset.x;
          carousel.dataset.yy = carousel.dataset.y;
          toggleFullScreen(e.target);
        };
        const fullScreenEvent = e => {
          let carousel = e.target.querySelector(":scope > .n-carousel__content");
          window.requestAnimationFrame(() => {
            updateCarousel(carousel);
            carousel.dataset.x = carousel.dataset.xx;
            carousel.dataset.y = carousel.dataset.yy;
            delete carousel.dataset.xx;
            delete carousel.dataset.yy;
            if (carousel.dataset.x !== "undefined" && carousel.dataset.y !== "undefined") {
              scrollTo(carousel, carousel.dataset.x * ceilingWidth(carousel.children[carousel.dataset.x]), carousel.dataset.y * ceilingHeight(carousel.children[carousel.dataset.y]));
            }
          });
        };
        if (isSafari) {
          el.onwebkitfullscreenchange = fullScreenEvent;
        } else {
          el.onfullscreenchange = fullScreenEvent;
        }
      }
      el.addEventListener("keydown", carouselKeys);
      el.addEventListener("keyup", e => {
        if (e.key === "Escape") {
          let el = e.target;
          if (!el.closest('.n-carousel--overlay')) {
            el = document.querySelector('.n-carousel--overlay');
          }
          if (el) {
            closeModal(el);
          }
        }
      });
      updateSubpixels(content);
      content.observerStarted = true;
      let hashed_slide = !!location.hash ? content.querySelector(":scope > " + location.hash) : false;
      if (hashed_slide) {
        if (el.classList.contains('n-carousel--inline')) {
          openModal(content);
          // el.classList.add('n-carousel--overlay');
        }
        let index = [...hashed_slide.parentNode.children].indexOf(hashed_slide);
        if (isVertical(content)) {
          content.dataset.y = index;
        } else {
          content.dataset.x = index;
        }
        // slideTo(content, index); // This slides to the wrong slide
        window.nCarouselNav = [content, location.hash];
      }
      if (el.matches(".n-carousel--vertical.n-carousel--auto-height")) {
        content.style.height = '';
        content.style.height = getComputedStyle(content).height;
        el.dataset.ready = true;
        content.scrollTop = 0; // Should be a different value if the initial active slide is other than the first one (unless updateCarousel() takes care of it)
      }
      if (isAutoHeight(el)) {
        // Auto has a specified height which needs update on resize
        autoHeightObserver.observe(content);
      }
      window.requestAnimationFrame(() => {
        observersOn(content);
        if (el.parentNode.matches(".n-carousel--vertical.n-carousel--controls-outside.n-carousel--auto-height")) {
          setIndexWidth(el);
        }
        updateCarousel(content);
        el.dataset.ready = true;
        if (el.matches(".n-carousel--auto-slide")) {
          let auto_delay = (parseFloat(el.dataset.interval) * 1000 || default_interval) + (parseFloat(el.dataset.duration) * 1000 || default_duration);
          let carouselTimeout = () => {
            if (isElementInViewport(content)) {
              slideNext(content);
            }
            content.nCarouselTimeout = setTimeout(carouselTimeout, auto_delay);
          };
          content.nCarouselTimeout = setTimeout(carouselTimeout, parseFloat(el.dataset.interval) * 1000 || default_interval);
          content.addEventListener("pointerenter", e => clearTimeout(e.target.nCarouselTimeout));
        }
        el.dataset.platform = navigator.platform; // iPhone doesn't support full screen, Windows scroll works differently
      });
      content.nCarouselUpdate = updateCarousel;
      
      // below replaced by scrollend polyfill
      // if (!("onscrollend" in window)) { // scrollend event fallback to intersection observer (for Safari as of 2023)
      //   const scrollEndObserver = new IntersectionObserver(entries => {
      //     let carousel = entries[0].target.parentNode;
      //     if (entries[0].isIntersecting && !carousel.parentNode.dataset.sliding && getComputedStyle(carousel).visibility !== 'hidden') {
      //       scrollEndAction(carousel);
      //     }
      //   }, { threshold: .996, root: el.parentElement }); // .99 works for all, including vertical auto height?
      //   [...content.children].forEach(el => scrollEndObserver.observe(el));
      // }
      if (el.matches('.n-carousel--lightbox')) {
        let loaded = img => {
          img.closest('picture').dataset.loaded = true;
        };
        content.querySelectorAll("picture img").forEach(el => {
          if (el.complete) {
            loaded(el);
          } else {
            el.addEventListener("load", e => {
              loaded(e.target);
            });
          }
        });
      }
    });
  };
  window.nCarouselInit = init;
  window.addEventListener('popstate', hashNavigation);
  const doInit = () => {
    (typeof nui !== 'undefined' && typeof nui.registerComponent === "function") ? nui.registerComponent("n-carousel", init): init();
  };
  if (document.readyState !== "loading") {
    doInit();
  } else {
    document.addEventListener("DOMContentLoaded", doInit);
  }
})();
//# sourceMappingURL=n-carousel@npm.js.map

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
        if (el.querySelector("a:focus")) ; else {
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
        checkSides(ul);
      });
    });
  }
  window.addEventListener("resize", function(e) {
    document.querySelectorAll(".n-nav.n-nav--drop ul").forEach((menubar) => {
      menubar.querySelectorAll("ul").forEach((ul) => {
        checkSides(ul);
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
//# sourceMappingURL=nav.js.map

// Component Notification bar – start
(function() {
	function notifyClose(el) {
		if (!!el) {
			el.parentNode.removeChild(el);
		}
	}

	function notifyCloseEvent() {
		if (document.querySelector(".n-notify")) {
			document.querySelector(".n-notify").onclick = (e) => {
				notifyClose(e.target);
			};
		}
	}

	function notify(content, option) {
		document.body.insertAdjacentHTML("afterbegin", `<button class="n-notify${option && option.indexOf("fixed") !== -1 ? " n-notify--fixed" : ""}">${content}</button>`);
		document.querySelector(".n-notify").focus();
		notifyCloseEvent();
		if (option && option.indexOf("timeout") !== -1) {
			setTimeout(() => {
				notifyClose(document.querySelector(".n-notify"));
			}, 2000);
		}
	}
	let init = (host) => {
		/* Tooltip */
		host.querySelectorAll(".n-notify:not([data-ready])").forEach((el, i) => {
			notifyCloseEvent();
			el.dataset.ready = true;
		});
	};
	nui.registerComponent("notify", init, {
		'name': 'notify',
		'code': notify
	});
})();
// Component Notification bar – end
//# sourceMappingURL=notify.js.map

(function() {
	const isChrome = !!navigator.userAgent.match("Chrome");
	navigator.userAgent.match(/Safari/) && !isChrome;
	let clickOutsideSelect = (e) => {
		if (!e.target.closest(".n-select__options > *") && !e.target.closest(".n-select")) {
			document.querySelectorAll(".n-select__options[aria-expanded]:not([data-n-select-animation])").forEach((select) => {
				closeSelect(select);
			});
		}
	};
	let closeSelectOnResizeScroll = (e) => {
		let open_select = document.querySelector(".n-select__options[aria-expanded]");
		if (e.type === 'resize' || (e.type === 'scroll' && e.target !== open_select)) {
			closeSelect(open_select);
		}
	};
	const updateOptionHeight = (wrapper, select) => {
		wrapper.style.setProperty("--active-option-height", `${select.querySelector("[aria-selected]").getBoundingClientRect().height}px`);
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
		// select.nuiSelectWrapper.style.setProperty("--active-option-height", `${el.getBoundingClientRect().height}px`);
		updateOptionHeight(select.nuiSelectWrapper, select);
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
		if (!select) {
			return;
		}
		delete select.dataset.nSelectAnimation;
		// delete select.dataset.transitionend;
		select.removeAttribute("aria-expanded");
		// document.body.classList.remove("n-select--open");
		// select.style.font = "";
		font_properties.forEach((el) => {
			select.style[el] = "";
		});
		select.nuiSelectWrapper.prepend(select);
		window.removeEventListener("resize", closeSelectOnResizeScroll);
		window.removeEventListener("scroll", closeSelectOnResizeScroll);
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
		updateOptionHeight(wrapper, select);
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
		select.style.setProperty("--body-offset-x", wrapper.getBoundingClientRect().x - document_offset - (document.body.style.position === "relative" ? parseFloat(getComputedStyle(document.body).borderInlineStartWidth) - document_offset + document.body.getBoundingClientRect().x : 0));
		select.style.setProperty("--body-offset-y", -document.body.getBoundingClientRect().y + wrapper.getBoundingClientRect().y - (document.body.style.position === "relative" ? parseFloat(getComputedStyle(document.body).borderBlockStartWidth) : 0));
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
		window.addEventListener("resize", closeSelectOnResizeScroll);
		window.addEventListener("scroll", closeSelectOnResizeScroll, true);
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
							if (select.getAttribute('aria-expanded')) {
								el.focus();
							} else {
								selectOption(el, false);
							}
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
			el.nuiNativeInput = el.nuiSelectWrapper.querySelector("select, input") || nextMatchingSibling(el.nuiSelectWrapper, "select") || document.querySelector(`[data-n_select="${el.nuiSelectWrapper.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)
			if (!el.nuiNativeInput) {
				// Missing native select, so generate it
				let input = document.createElement("select");
				input.name = input.id = el.dataset.name;
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
				// wrapper.style.setProperty("--active-option-height", `${el.querySelector("[aria-selected]").getBoundingClientRect().height}px`);
				updateOptionHeight(wrapper, el);
				["--nui-control-color", "--nui-control-bg", "--nui-control-active-color", "--nui-control-active-bg", "--nui-control-highlight"].forEach((i) => {
					el.style.setProperty(i, wrapper.style.getPropertyValue(i));
				});
			});
		});
	};
	(typeof nui !== 'undefined' && typeof nui.registerComponent === "function") ? nui.registerComponent("n-select", init) : init(document.body);
})();
//# sourceMappingURL=n-select@npm.js.map

// Component Tooltip – start
(function() {
	let setTipPosition = (tool, tip) => {
		// Take up the most area available on top/right/bottom/left of the tool. Relative to body.
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
		tip.classList.add('n-tooltip__content-visible');
		let positionTop = () => {
			tip.style.bottom = 20 + body_rect.height + body_rect.y - top + "px";
			tip.style.maxHeight = top - 40 + "px";
			tip.style.left = `${rect.x + rect.width / 2 - tip.scrollWidth / 2 - document.body.getBoundingClientRect().x}px`;
			tip.dataset.nPosition = "top";
		};
		let positionBottom = () => {
			tip.style.top = 20 - body_rect.y + top + rect.height + "px";
			tip.style.maxHeight = bottom - 40 + "px";
			tip.style.left = `${rect.x + rect.width / 2 - tip.scrollWidth / 2 - document.body.getBoundingClientRect().x}px`;
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
			if (rect_tip.right > window.innerWidth) {
				offset_x = window.innerWidth - rect_tip.right - 10;
			}
		}
		tip.style.setProperty("--offset_x", offset_x + "px");
	};

	function getToolTip(tool) {
		return document.getElementById(tool.getAttribute('aria-describedby')) || tool.nextElementSibling;
	}
	const hideTipFunction = tool => {
		let tip = getToolTip(tool);
		tool.removeAttribute("aria-expanded");
		tool.after(tip);
		tip.removeAttribute("style");
		delete tip.dataset.position;
		tip.classList.remove('n-tooltip__content-visible');
	};
	let hideTip = (e) => {
		hideTipFunction(e.target.closest(".n-tooltip"));
	};
	const hideTipOnScroll = e => {
		document.querySelectorAll('.n-tooltip').forEach(el => hideTipFunction(el));
		document.removeEventListener('scroll', hideTipOnScroll);
	};
	let showTip = (e) => {
		let tool = e.target.closest(".n-tooltip");
		let tip = getToolTip(tool);
		tool.setAttribute("aria-expanded", true);
		document.body.appendChild(tip);
		setTipPosition(tool, tip);
		document.addEventListener('scroll', hideTipOnScroll, true);
	};
	const init = (host = document) => {
		/* Tooltip */
		host.querySelectorAll(".n-tooltip")?.length;
		host.querySelectorAll(".n-tooltip:not([data-ready])").forEach((el) => {
			el.setAttribute("tabindex", 0);
			el.addEventListener('touchend', showTip);
			el.addEventListener('mouseover', showTip);
			el.addEventListener('focus', showTip);
			el.addEventListener('mouseout', hideTip);
			el.addEventListener('blur', hideTip);
			el.dataset.ready = true;
		});
	};
	(typeof nui !== 'undefined' && typeof nui.registerComponent === "function") ? nui.registerComponent("n-tooltip", init): init();
})();
// Component Tooltip – end
//# sourceMappingURL=n-tooltip@npm.js.map

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
			el.querySelectorAll("thead td button.n-table__sort, th button.n-table__sort").forEach((button) => button.addEventListener("click", (e) => {
				let th = e.target.closest("th") || e.target.closest("td");
				const tbody = th.closest("table").querySelector("tbody");
				Array.from(tbody.querySelectorAll("tr")).sort(comparer(Array.from(th.parentNode.children).indexOf(th), toggleSort(th))).forEach((tr) => tbody.appendChild(tr));
			}));
			el.dataset.ready = true;
			el.setAttribute("tabindex", 0); // To scroll with arrow keys
		});
	};
	nui.registerComponent("table", init);
})();
// Component Table – end
//# sourceMappingURL=table.js.map

// Component Parallax – start
(function() {
	// Thanks Dave Rupert
	let parallaxSpeed = 0.2;
	let updateParallax = () => {
		document.querySelectorAll(".n-parallax").forEach((el) => {
			let parent = el.parentElement;
			let scroll_offset = parent.getBoundingClientRect().y;
			el.style.setProperty("--scrollparallax", scroll_offset * parallaxSpeed);
		});
	};
	if (document.querySelector(".n-parallax")) {
		window.addEventListener("scroll", updateParallax, true);
	}
	let init = (host) => {};
	nui.registerComponent("parallax", init);
})();
// Component Parallax – end
//# sourceMappingURL=parallax.js.map

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
	nui.registerComponent("typography", init);
})();
// Component Typography – end
//# sourceMappingURL=typography.js.map
export default nui;
//# sourceMappingURL=niui.js.map
