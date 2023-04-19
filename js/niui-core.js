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
nui.dynamicInit = true;