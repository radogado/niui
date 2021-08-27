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
	if (hasClass(el_origin, className)) {
		addClass(el_target, className);
	}
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
	/*
    if (!el) return;
	var node, nodes;
	
    nodes = node = el.parentNode.childNodes;

    var i = 0;
    var count = 0;

    while ((node = nodes.item(i++)) && node !== el) {

        if (node.nodeType === 1) {

            count++;

        }

    }

    return (count);
*/

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

/*
function ready(fn) { // Not working with async and defer

  if (document.readyState != 'loading') {

    fn();

  } else if (document.addEventListener) {

    document.addEventListener('DOMContentLoaded', fn);

  } else {

    document.attachEvent('onreadystatechange', function() {
    	if (document.readyState != 'loading')
        	fn();
    });

  }

}
*/

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

/*
// URI parameters

function updateURLParameter(url, param, paramVal) { // return input string with updated/added URL parameter

    var newAdditionalURL = '';
    url = url.split('#')[0];
    var tempArray = url.split('?');
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = '';
    if (additionalURL) {
        tempArray = additionalURL.split('&');
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    }

    var rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt.split('#')[0];

}

// URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array

var parameters_list = new Array('parameter1', 'parameter2'); // To do: load this from an external JSON file. Such data has no place here.

function relayParameters() {

    var parameters = getURLParameters();

    forEach('a[href]', function(el, i) {

        for (var name in parameters) {

            if (el.href.indexOf('javascript') === -1 && el.href.indexOf('mailto') === -1 && parameters_list.indexOf(name) != -1) {
	            
	            var hash = el.href.split('#')[1];
	            el.href = updateURLParameter(el.href, name, parameters[name]);
	            if (!!hash) {
		            
		            el.href = el.href.split('#')[0] + '#' + hash;
		            
	            }
	            
            }

        }

    });

}
*/

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

function animateAnchors(e) {
	if (!e || q("html").clientHeight > document.body.clientHeight) {
		return;
	}
	var el = e.target;

	while (typeof el.href !== "string") {
		// If a child of the link is clicked

		el = el.parentNode;
	}

	if (el.href.split(/#|\?/)[0] != window.location.href.split(/#|\?/)[0]) {
		// External page?

		return;
	}

	var hash = null;
	if (el.href.split("#").pop().length > 0) {
		hash = document.getElementById(el.href.split("#").pop());
	}

	scrollToAnimated(hash === null ? 0 : getCumulativeOffset(hash).y, 0.5, (e) => {
		// To do: fix jumping to new hash – is the fallback executed properly in animate()?

		window.location = el.href.split("#")[0] + "#" + el.href.split("#").pop();
	});

	return false;
}

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

function animate(el, animation_code, duration, callback) {
	// Animate with CSS Animations. Default duration = .2s, callback optional

	// To do: add animation-fill-mode: forwards to keep the end state

	if (!el.dataset.nuiAnimation && animationEndEvent) {
		el.addEventListener(
			animationEndEvent,
			function animationEndHandler(e) {
				var el = e.target;

				if (!!el.dataset.nuiAnimation) {
					stopEvent(e);
					document.head.removeChild(q("." + el.dataset.nuiAnimation));
					delete el.dataset.nuiAnimation;
					el.removeEventListener(animationEndEvent, animationEndHandler);
					if (typeof callback === "function") {
						callback();
					}
				}
			},
			false
		);

		var animation_name = `a${Math.round(Math.random() * 1000000, 10)}`; // Unique animation name

		var styles = document.createElement("style");
		styles.innerHTML = `@keyframes ${animation_name} {${animation_code}} [data-nui-animation=${animation_name}] { animation-name: ${animation_name}; animation-duration: ${
			!duration ? 0.2 : duration
		}s; }`; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
		document.head.appendChild(styles);
		addClass(styles, animation_name);

		el.dataset.nuiAnimation = animation_name;
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

	animate(
		q("html"),
		`100% { transform: translate3d(0, ${-1 * (to - (document.documentElement.scrollTop || document.body.scrollTop))}px, 0); }`,
		duration,
		scrollToCallback.bind(null, callback)
	);
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
	// To do: If not IE/Edge, return q(selector + ':focus-within');

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

/*
function initThreshold(host) {

// Scroll effects
	host.querySelectorAll('[data-threshold]:not([data-ready])').forEach((el) => { // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height
	
		window.addEventListener('scroll', () => {
	
			setTimeout(() => {
				
				var relativeScroll = q('html').scrollTop || document.body.scrollTop;
//				q('html').style.setProperty('--scroll-top', relativeScroll);
//				q('html').style.setProperty('--scroll-bottom', q('html').scrollHeight - relativeScroll - q('html').offsetHeight);
//				q('html').style.setProperty('--page-height', q('html').scrollHeight);
				var threshold = el.scrollHeight; // To do: either element height or data-threshold height in px, % or vh
	
				if (relativeScroll > threshold) {
					
					relativeScroll = threshold;
	
				}
				
				if (relativeScroll < 0) {
					
					relativeScroll = 0;
	
				}
				
				el.style.setProperty('--height', threshold);
				el.style.setProperty('--threshold', parseFloat((relativeScroll / threshold), 10).toPrecision(1)); // Percentage of threshold reached. 0 – 1. Can be used with CSS calc().
				// To do: Add --offset-top, --offset-bottom (distance from top/bottom of element to top/bottom of viewport)
	
				if (relativeScroll >= threshold) {
					
					addClass(el, 'threshold');
					document.body.setAttribute('data-threshold', true);
					
				} else {
					
					removeClass(el, 'threshold');
					removeClass(document.body, 'threshold');
					document.body.removeAttribute('data-threshold');
					
				}
				
			}, 50);
			
		});
		makeReady(el);
	
	});

}
*/

var current_slider = q(".slider");
var draggingNow = false;

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
qa('a[href^="#"]').forEach((el) => {
	el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler
});

/*
	notifyCloseEvent();

	window.addEventListener('touchstart', function (e) {
		
		draggingNow = false;
		
	});

	window.addEventListener('touchmove', function (e) {
		
		draggingNow = true;
		
	});
*/

// Viewport element for iOS

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {
	let adjustViewport = () => {
		document.querySelectorAll(".n-viewport").forEach((el) => {
			el.style.height = "100vh";
			el.style.marginTop = 0;
			// 		console.log('Element: ' + el.offsetHeight, 'Window: ' + window.innerHeight);

			if (el.offsetHeight > window.innerHeight) {
				el.style.height = `calc(100vh - ${el.offsetHeight - window.innerHeight}*1px)`;
			}

			if (el.getBoundingClientRect().y < 0) {
				el.style.marginTop = `${Math.abs(el.getBoundingClientRect().y)}px`;
			}
		});
	};

	adjustViewport();

	window.addEventListener("resize", (e) => {
		adjustViewport();
		setTimeout(adjustViewport, 200);
	});
}

//→ fold.js:
'use strict';

// Component Fold – start

(function () {
	/* Fold – start */

	let closeAccordion = (el, content) => {
		let content_height = content.style.getPropertyValue("--start-height") || 0;
		animate(content, `0% { max-height: ${content.scrollHeight}px; } 100% { max-height: ${content_height}; }`, 0.2, () => {
			toggleAttribute(el, "aria-expanded");
		});
	};

	let openAccordion = (el, content) => {
		let content_height = content.style.getPropertyValue("--start-height") || 0;
		toggleAttribute(el, "aria-expanded");
		animate(content, `0% { max-height: ${content_height}; } 100% { max-height: ${content.scrollHeight}px; }`);
	};

	function toggleAccordion(e) {
		stopEvent(e);
		var el = e.target.closest(".n-fold");
		var content = el.querySelector(".n-fold--content");

		content.style.display = "block"; // To get proper width when horizontal
		content.style.setProperty("--width", content.scrollWidth + "px");
		content.style.removeProperty("display");
		content.style.setProperty("--max-height", content.scrollHeight + "px");

		if (hasClass(el, "n-fold__horizontal")) {
			toggleAttribute(el, "aria-expanded");
		} else {
			if (el.hasAttribute("aria-expanded")) {
				// Close

				closeAccordion(el, content);
			} else {
				// Open

				let other = hasClass(el.parentNode, "n-fold--group") && el.parentNode.querySelector("[aria-expanded]");

				openAccordion(el, content);

				if (other && other !== el) {
					// There is another one open, close it if in a group

					closeAccordion(other, other.querySelector(".n-fold--content"));
				}
			}
		}

		return false;
	}

	// Close all Fold elements when clicking/tapping outside of them

	function closeFoldClickOutside(e) {
		var el = e.target;

		if (!el.closest(".n-fold") && !el.closest(".n-tool")) {
			// Clicking/tapping outside of a fold/tooltip element...

			qa(".n-fold.n-fold__mobile[aria-expanded], .n-tool--tip[aria-expanded]").forEach((el) => {
				// ... closes all n-burger nav menus and tooltips

				el.removeAttribute("aria-expanded");
			});
		}

		// Focus on clicked slider

		if (el.closest(".n-slider")) {
			current_slider = el.closest(".n-slider");
		}
	}

	function initFold(host) {
		host.querySelectorAll(".n-fold:not([data-ready]) > .n-fold--label").forEach((el) => {
			el.onclick = toggleAccordion;

			el = el.parentNode;
			var content = el.querySelector(".n-fold--content");

			if (!hasClass(el, "n-fold__mobile")) {
				content.addEventListener("focusin", (e) => {
					if (!e.target.closest(".n-fold").hasAttribute("aria-expanded")) {
						toggleAccordion(e);
					}
				});
			}

			if (hasClass(el, "n-fold__horizontal")) {
				el.dataset.init = true;
				content.style.setProperty("--width", content.scrollWidth + "px");
				content.style.height = "auto";
				delete el.dataset.init;
				setTimeout(() => {
					content.style.transition = "width .2s ease-in-out";
				}, 100);
			}

			content.style.setProperty("--max-height", content.scrollHeight + "px");

			el.querySelectorAll("input.n-trigger").forEach((el) => {
				// Remove CSS-only triggers

				el.parentNode.removeChild(el);
			});

			if (hasClass(el, "n-fold__defocus")) {
				el.addEventListener("focusout", (e) => {
					// Close it when tabbing outside

					let el = e.target.closest(".n-fold");
					if (!el.contains(e.relatedTarget)) {
						el.removeAttribute("aria-expanded");
					}
				});
			}

			makeReady(el);
		});
	}

	window.addEventListener("mousedown", closeFoldClickOutside); // Close all Fold elements when clicking outside of them

	window.addEventListener("touchend", closeFoldClickOutside); // Close all Fold elements when clicking outside of them

	window.addEventListener("scroll", () => {
		// Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.

		let expanded_nav = q(".n-header__fixed-mobile .n-fold.n-fold__mobile[aria-expanded]");
		if (expanded_nav) {
			expanded_nav.removeAttribute("aria-expanded");
		}
	});

	/* Fold – end */

	registerComponent("fold", initFold);
})();

// Component Fold – end

//→ form.js:
'use strict';

// Component Form – start

(function () {
	/* Form – start */

	function submitForm(e) {
		var el = e.target;

		var ready_to_submit = true;

		el.querySelectorAll(".n-form__mandatory").forEach((el) => {
			if (el.closest("[disabled]")) {
				// Ignore disabled conditional fields

				return;
			}

			if (
				(el.querySelector("input, select, textarea") && !el.querySelector("input, select, textarea").value) ||
				(el.querySelector("input[type=checkbox]") && !el.querySelector("input[type=checkbox]").checked) ||
				(el.querySelector("input[type=email]") && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector("input[type=email]").value)) ||
				(el.querySelector("input[type=url]") && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector("input[type=url]").value)) ||
				(el.querySelector("input[type=number]") && !RegExp(/^\d+$/).test(el.querySelector("input[type=number]").value)) ||
				(el.querySelector("input[type=number][data-digits]") && el.querySelector("input[type=number]").value.length !== el.querySelector("input[type=number]").dataset.digits) ||
				(el.querySelector("input[type=radio]") && !el.querySelector("input[type=radio]").checked)
			) {
				ready_to_submit = false;
				el.querySelector("input").focus();
				addClass(el, "n-form--alert");
				// 				animate(el.closest('form'), '33% { transform: translateX(-9px) } 66% { transform: translateX(9px) } 100% { transform: translateX(0) } ', 999);
				// Margin animation, because transform animation hides neighbouring content on iPad
				let form = el.closest("form");
				animate(form, `0% { width: ${form.scrollWidth}px; } 33% { margin-left: -9px; } 66% { margin-left: 18px; } 100% { width: ${form.scrollWidth}px; margin-left: 0; }`, 0.25);
				return;
			} else {
				removeClass(el, "n-form--alert");
			}
		});

		return ready_to_submit;
	}

	function updateFileInput(e) {
		var el = e.target;

		el.parentNode.querySelector("span.n-form--file-name").innerHTML = el.value.substring(el.value.lastIndexOf("\\") + 1);
	}

	if (q(".n-form__language")) {
		// To do: make it universal .submitonchange and for more than 1 form

		q(".n-form__language select").onchange = (e) => {
			q(".n-form__language").submit();
		};
	}

	function toggleConditionalFieldset(e) {
		var el = e.target;
		var fieldset = el.closest(".n-form--condition").nextElementSibling;
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
				el.parentNode.querySelector("span").insertAdjacentHTML("afterbegin", "<span class=n-form--file-name></span>");
			});

			// 	Conditional form fieldsets

			el.querySelectorAll(".n-form--check.n-form--condition input").forEach((el, i) => {
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

//→ n-select.js:
'use strict';

(function () {
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
		let selected = select.querySelector("[aria-selected]");

		if (selected) {
			selected.removeAttribute("aria-selected");
		}

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

		let select_native = select.nuiNativeSelect; // The attached native select

		let index = [...el.parentNode.querySelectorAll("button")].indexOf(el);

		if (select_native) {
			//									let options = select.querySelectorAll('button');
			// 								select_native.options[[...options].indexOf(el)].selected = true; // Enable the native option index-matching this button
			select_native.value = select.children[index].value;
		}

		if (!!select.nuiOnChange) {
			select.nuiOnChange(index, select_native.value);
		}
	};

	let closeSelect = (select) => {
		delete select.dataset.nSelectAnimation;
		select.removeAttribute("aria-expanded");
		document.body.classList.remove("n-select--open");
		select.nuiSelectWrapper.prepend(select);
		window.removeEventListener("resize", closeSelectOnResize);
		select.querySelector("[aria-selected]").tabIndex = -1;
		window.requestAnimationFrame((t) => select.nuiSelectWrapper.focus());
		document.body.removeEventListener("click", clickOutsideSelect);
		select.removeEventListener("pointerup", pointerUpSelect);
		let wrapper = select.parentNode;
		wrapper.style.removeProperty("--width");
		select.style.removeProperty("--scroll-help-top");
		select.classList.remove("n-select--scroll-help-top");
		!!nuiDisableBodyScroll && nuiDisableBodyScroll(false, select);

		let parent = wrapper;
		while (parent !== document.body) {
			parent.removeEventListener("scroll", closeSelectOnScroll);
			parent = parent.parentNode;
		}
	};

	let closeSelectOnScroll = (e) => {
		let select = document.querySelector("body > .n-select__options");
		closeSelect(select);
	};

	let openSelect = (select) => {
		let previous_open_select = document.body.querySelector(".n-select__options[aria-expanded]");
		if (previous_open_select) {
			closeSelect(previous_open_select);
		}

		let wrapper = select.parentNode;
		wrapper.style.setProperty("--width", `${wrapper.getBoundingClientRect().width}px`);

		// Fix viewport overflow
		select.style.removeProperty("--top-offset");
		select.style.removeProperty("--max-height");
		select.style.removeProperty("--select-scroll-height");
		select.style.removeProperty("--active-option-offset");
		select.classList.remove("n-select--crop-top");

		let option_height = select.getBoundingClientRect().height;

		select.style.setProperty("--max-width", `${select.parentNode.getBoundingClientRect().width}px`);
		select.style.setProperty("--body-offset-x", select.getBoundingClientRect().x - document.body.getBoundingClientRect().x);
		select.style.setProperty("--body-offset-y", select.getBoundingClientRect().y - document.body.getBoundingClientRect().y);

		select.querySelector("[aria-selected]").removeAttribute("tabindex");
		document.body.classList.add("n-select--open");
		select.setAttribute("aria-expanded", true);

		document.body.appendChild(select);
		select.style.setProperty("--select-scroll-height", `${select.getBoundingClientRect().height}px`);

		let active_option_offset = select.querySelector("[aria-selected]").getBoundingClientRect().y - select.getBoundingClientRect().y;
		let top_offset = 0;

		select.style.setProperty("--active-option-offset", active_option_offset);

		if (select.getBoundingClientRect().y < 0) {
			let current_max_height = select.getBoundingClientRect().height + select.getBoundingClientRect().y;
			select.style.setProperty("--max-height", `${current_max_height}px`);
			select.scrollTop = Math.abs(select.getBoundingClientRect().y);
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

		select.classList.remove("n-scrollbar");

		if (select.getBoundingClientRect().width > select.querySelector("button").getBoundingClientRect().width + parseInt(getComputedStyle(select).paddingInlineEnd) * 2) {
			select.classList.add("n-scrollbar");
		}

		select.style.setProperty("--mask-position-y", `${active_option_offset - top_offset}`); // To do: adjust target position to equalise reveal speed on both sides: shorter side position += difference between short and long sides
		select.style.setProperty("--mask-size-y", `${option_height}px`);

		window.requestAnimationFrame((t) => {
			setTimeout(() => {
				select.dataset.nSelectAnimation = true;
				select.querySelector("[aria-selected]").focus();
			}, 1); // Timeout needed for the above CSS variables to work
		});

		window.addEventListener("resize", closeSelectOnResize);
		document.body.addEventListener("click", clickOutsideSelect);
		!!nuiDisableBodyScroll && nuiDisableBodyScroll(true, select);

		let parent = wrapper.parentNode;
		while (parent !== document.body) {
			parent.addEventListener("scroll", closeSelectOnScroll);
			parent = parent.parentNode;
		}
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

		// 		console.log(e.type, e.target);

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

		// 		console.log(e.type, e.target);

		if (!select.hasAttribute("aria-expanded")) {
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

		// 		console.log(e.type, e.target, e.target.value);

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
		/* 				console.log(e.target, e.key, e.keyCode); */

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
				// Or generate it from the native select and attach as n-select's first child. If only native is needed, then use only select.n-select?
				let options = "";
				wrapper.querySelectorAll("option").forEach((el) => {
					options += `<button value="${el.value}">${el.textContent}</button>`;
				});

				el = document.createElement("div");
				el.insertAdjacentHTML("beforeend", options);
				wrapper.prepend(el);
			}
			el.nuiSelectWrapper = wrapper;
			el.classList.add("n-select__options");

			el.nuiNativeSelect =
				el.nuiSelectWrapper.querySelector("select") ||
				nextMatchingSibling(el.nuiSelectWrapper, "select") ||
				document.querySelector(`[data-n_select="${el.nuiSelectWrapper.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)

			if (!el.nuiNativeSelect) {
				// Missing native select, so generate it

				let input = document.createElement("input");
				input.name = el.dataset.name;
				wrapper.append(input);
				el.nuiNativeSelect = input;
			}

			// Set native select's value

			/*
			el.nextElementSibling.onchange = e => {
				
				// Also change the visible select
				let el = e.target;
				selectOption(el.previousElementSibling.querySelectorAll('button')[el.selectedIndex]);
				
			};
		*/

			/*
			Object.defineProperty(el.nextElementSibling, 'value', {
				
				set: value => {
					
					console.log(this);
					
					if (this.tagName !== 'SELECT') {
						
						return;
						
					}
					
					this.value = value; // Why is "this" the window object?
		
					[...this.children].forEach(el => {
						
						if (el.textContent === value) {
							
							this.selectedIndex = el.index;
		
						}
						
					});
		
					console.log('Setting', value, this.selectedIndex);
		
					selectOption(this.previousElementSibling.querySelectorAll('button')[this.selectedIndex]);
					this.children[this.selectedIndex].selected = true;
		
				},
				get: () => {
					
					console.log('Getting', this.value);
					return this.value; 
		
				}
			
			});
		*/

			wrapper.addEventListener("pointerdown", pointerDownSelect);

			el.addEventListener("click", clickSelect); // Selects a clicked (pointer upped) option

			el.addEventListener("focusout", (e) => {
				let select = e.target.closest(".n-select__options");

				// If relatedTarget isn't a sibling, close and focus on select wrapper

				/* console.log('relatedTarget', e.relatedTarget);				 */
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
			};

			el.addEventListener("keydown", selectKeyboard);
			wrapper.addEventListener("keydown", selectKeyboard);
			el.addEventListener("keyup", trapKeyboard);
			wrapper.addEventListener("keyup", trapKeyboard);

			el.lastElementChild.onkeydown = (e) => {
				// Close select on tab outside. To do: get last button only
				// 			console.log(e);
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

			selectOption(el.querySelector("[aria-selected]") || el.querySelector("button")); // Select the first option by default
			el.nuiSearchTerm = "";

			wrapper.dataset.ready = true;
			wrapper.style.setProperty("--active-option-height", `${el.querySelector("[aria-selected]").getBoundingClientRect().height}px`);
		});
	};

	typeof registerComponent === "function" ? registerComponent("n-select", init) : init(document.body);
})();

//→ grid-inline-popups.js:
'use strict';

// Component Grid with inline popups – start

(function () {
	/* Grid with inline popups – start */

	function initGridInlinePopups(host) {
		// Limitation: each row must have equal width columns.

		host.querySelectorAll(".grid-inline-popup:not([data-ready])").forEach((el) => {
			var id = `id${new Date().getTime()}`; // Unique id
			el.id = el.id || id;
			var cells = el.querySelectorAll(`#${el.id} > div:not(.grid-inline-popup--popup)`);
			var popups = el.querySelectorAll(`#${el.id} > .grid-inline-popup--popup`);

			if (el.id === id) {
				el.removeAttribute("id");
			}

			cells.forEach((el) => {
				function openNewItem(e, current_popup) {
					var cell = e.target.closest(".grid-inline-popup > div");
					var columns = Math.round(cell.parentElement.scrollWidth / cell.scrollWidth);
					var el = cell.nextElementSibling;
					if (el === current_popup) {
						return;
					}

					var index = Array.prototype.indexOf.call(popups, el);

					// Rewind index to start of row (when cell horizontal offest === parent horizontal offset)

					var index_row = index;

					while (index_row >= columns && cells[index_row].offsetLeft > cells[index_row].previousElementSibling.previousElementSibling.offsetLeft) {
						index_row--;
					}

					if (index_row < columns) {
						index_row = 0;
					}

					index -= index_row;
					var i = 0;
					while (i < index_row) {
						cells[i++].style.order = -1;
					}

					// Set order = -1 until index_row and subtract index_row from index

					index -= index % columns; // compensate with remainder

					i = index_row;

					while (i < cells.length) {
						cells[i].style.order = i - index_row < index - index_row ? -1 : 1;
						i++;
					}

					i = 0;
					while (i < columns) {
						cells[i + index_row].style.order = -1;
						i++;
					}

					el.setAttribute("aria-expanded", "true");
					el.previousElementSibling.setAttribute("aria-expanded", "true");
					var height = el.scrollHeight;
					el.style.maxHeight = 0;
					el.style.overflow = "hidden";
					animate(el, `100% { max-height: ${height}px; }`, 0.2, () => {
						el.style.cssText = "";
					});
				}

				function openCell(e) {
					var current_popup = e.target.closest(".grid-inline-popup").querySelector(".grid-inline-popup--popup[aria-expanded]");
					if (current_popup) {
						current_popup.style.maxHeight = current_popup.scrollHeight + "px";
						current_popup.style.overflow = "hidden";
						animate(current_popup, "100% { max-height: 0; }", 0.2, () => {
							current_popup.removeAttribute("aria-expanded");
							current_popup.previousElementSibling.removeAttribute("aria-expanded");
							current_popup.style.cssText = "";
							openNewItem(e, current_popup);
						});
					} else {
						openNewItem(e);
					}
				}

				el.setAttribute("tabindex", 0);
				el.addEventListener("click", openCell);
				// 			el.addEventListener('touchend', openCell);
				el.addEventListener("keyup", (e) => {
					if (e.key === "Enter") {
						openCell(e);
					}
				});
			});
			makeReady(el);
		});
	}

	/* Grid with inline popups – end */

	let init = (host) => {
		initGridInlinePopups(host);
	};
	registerComponent("grid-inline-popups", init);
})();

// Component Grid with inline popups – end

//→ lightbox.js:
'use strict';

var componentLightbox = (function () {
	/* Lightbox – start */

	function adjustZoom(e) {
		// Event is click on image

		let overlay = qa(".n-ovrl");
		overlay = overlay[overlay.length - 1];

		var width = overlay.querySelector(".n-slider--wrap").offsetWidth;
		var height = overlay.querySelector(".n-slider--wrap").offsetHeight;

		var el = e.target;

		var overflowX = el.width - width;
		var overflowY = el.height - height;

		if (overflowX > 0) {
			el.style.setProperty("--x", (-1 * overflowX * e.x) / width + "px");
			el.style.left = 0;
			el.style.right = "auto";
		}

		if (overflowY > 0) {
			el.style.setProperty("--y", (-1 * overflowY * (e.y - window.innerHeight + height)) / height + "px"); // removes 48px from the top bar height
			el.style.top = 0;
			el.style.bottom = "auto";
		}
	}

	function imageLoaded(img) {
		addClass(img.closest(".n-slider > div"), "n-lightbox--loaded");

		img.onclick = (e) => {
			// Zoom and scan

			var el = e.target;
			let parent_width = el.parentNode.offsetWidth;
			let parent_height = el.parentNode.offsetHeight;

			if (!q(".n-ovrl .n-slider--wrap") || (el.naturalWidth <= parent_width && el.naturalHeight <= parent_height)) {
				return;
			}

			let calculateOffset = () => {
				let coef_x = parent_width / el.width;
				let coef_y = parent_height / el.height;

				let coef = coef_y;

				if (el.offsetWidth * coef - el.parentNode.offsetWidth > 3) {
					// Wrong coefficient, swap them

					coef = coef_x;
				}

				var translate_x = el.width > parent_width ? `calc(1px * (${(parent_width / 2 - el.width / 2) / coef}))` : `calc(-50% / ${coef})`;
				var translate_y = el.height > parent_height ? `calc(1px * (${(parent_height / 2 - el.height / 2) / coef}))` : `calc(-50% / ${coef})`;
				return `{ transform: scale(${coef}) translate3d(${translate_x}, ${translate_y}, 0); }`;
			};

			if (!hasClass(el, "n-lightbox--zoom")) {
				el.style.cssText = "";
				el.style.setProperty("--x", "-50%");
				el.style.setProperty("--y", "-50%");
				addClass(el, "n-lightbox--zoom");
				adjustZoom(e);

				animate(el, `0% ${calculateOffset()}`, 0.25);

				el.onmousemove = (e) => {
					adjustZoom(e);
				};
			} else {
				animate(el, `100% ${calculateOffset()}`, 0.25, () => {
					el.style.cssText = "";
					removeClass(el, "n-lightbox--zoom");
				});
			}
		};
	}

	function populateLightboxItem(slider, i) {
		var img = slider.children[!i ? 0 : i].querySelector("img");

		if (img && !img.src) {
			img.loading = "lazy";
			img.src = img.dataset.src + "?"; // '?' fixes a weird iOS bug showing small images
			if (img.complete) {
				imageLoaded(img);
			}
			img.onload = img.onerror = (e) => {
				imageLoaded(e.target);
			};

			return false;
		}
	}

	function populateLightbox(slider, i) {
		let slides = slider.children.length - 1;
		[i, i > 0 ? i - 1 : slides, i < slides ? i + 1 : 0].forEach((el) => {
			populateLightboxItem(slider, el);
		});
	}

	function openLightbox(e) {
		// To do: create all content in an unattached element and call openFullWindow(el), which will take over

		if (typeof componentSlider.makeSlider !== "function") {
			// Slider JS not present

			return;
		}

		observerOff();

		var el = e.target;
		if (el.length === 0) {
			el = e;
		}

		var lightbox = el.closest(".n-lightbox");
		var animation = lightbox.dataset.anim;
		var lightbox_target = document.createElement("div");
		var inline_static = lightbox.matches(".n-lightbox__inline:not(.n-slider)");

		if (inline_static) {
			addClass(lightbox_target, "n-lightbox__inline");
		}

		["n-slider", "n-lightbox"].forEach((item) => addClass(lightbox_target, item));
		["n-lightbox__thumbnails", "n-slider__top", "n-slider__fade"].forEach((item) => transferClass(lightbox, lightbox_target, item));

		if (!!lightbox.dataset.duration) {
			lightbox_target.dataset.duration = lightbox.dataset.duration;
		}

		if (!!lightbox.dataset.autoslide) {
			lightbox_target.dataset.autoslide = lightbox.dataset.autoslide;
		}

		if (inline_static) {
			// If it's inline, it must become a slider/lightbox to replace the original lightbox element
			lightbox_target.id = lightbox.id ? lightbox.id : "";
			var parent = lightbox.parentNode;
			var next_sibling = lightbox.nextElementSibling;
			lightbox.outerHTML = ""; // Remove from DOM, but still existing as a variable
		} else {
			// else it's an existing lightbox and the new one should be separate and full screen

			if (hasClass(lightbox, "n-full-screen")) {
				addClass(lightbox_target, "n-full-screen");
			}
		}

		["n-slider__vertical", "n-slider__right"].forEach((item) => transferClass(lightbox, lightbox_target, item));

		if (!!lightbox.dataset.peek) {
			lightbox_target.dataset.peek = lightbox.dataset.peek;
		}

		/* Add any <a>img> siblings with description to a .n-slider and initialise its controls */
		var images = "";
		var thumbnails = [];
		[].slice.call(lightbox.children).forEach((el) => {
			// To do: facilitate a[href] extraction also from within div slides, if lightbox is existing and needs to be recreated for full screen. Get them in an array item[i].link, item[i].img

			if (!el.href && !hasClass(lightbox, "n-slider")) {
				// Ignore non-links in regular lightboxes

				return;
			}

			el.setAttribute("tabindex", 0);

			thumbnails.push(el.querySelector("img") ? el.querySelector("img").dataset.src || el.querySelector("img").src : "#");

			if (hasClass(el, "n-lightbox--video") || el.querySelector("n-lightbox--video")) {
				// video poster = the anchor's img child, if it exists
				if (hasClass(lightbox, "n-slider")) {
					// Secondary lightbox

					images += `<div>${el.querySelector("n-lightbox--video").outerHTML}</div>`;
				} else {
					images += `<div><video poster=${el.querySelector("img") ? el.querySelector("img").src : "#"} controls=controls preload=none> <source type=video/mp4 src=${
						el.href
					}> </video></div>`;
				}

				return;
			}

			if (hasClass(el, "iframe")) {
				images += `<div><iframe src=${el.href}></iframe></div>`;
				return;
			}

			var slide_link =
				hasClass(lightbox, "n-slider") || !el.href
					? ""
					: document.location.href.split("#")[0].split("?")[0] + "?image=" + el.href.split("/").pop() + "#" + lightbox.getAttribute("id");

			var link_element = hasClass(lightbox, "n-lightbox__inline") || !lightbox.getAttribute("id") ? "" : `<a class="n-btn n-lightbox--copy" href=${slide_link}></a>`;

			var url = hasClass(lightbox, "n-slider") ? (el.querySelector("img") ? el.querySelector("img").dataset.src : "") : el.href;

			var caption = el.title ? el.title : el.querySelector("img") ? el.querySelector("img").title : "";
			var caption_attribute = el.querySelector("img") ? el.querySelector("img").dataset.caption : false;

			if (typeof caption_attribute === "string") {
				// When an inline lightbox opens a full window one

				caption = caption_attribute;
			} else {
				if (el.querySelector(".n-lightbox--caption")) {
					caption = el.querySelector(".n-lightbox--caption").textContent;
				}
			}

			let target_width = !el.dataset.width ? "" : `width=${el.dataset.width}`;
			let target_height = !el.dataset.height ? "" : `height=${el.dataset.height}`;

			let aspect = "";
			let aspect_tail = "";

			if (!!target_width && !!target_height) {
				aspect = `<span class=n-aspect style="--width: ${el.dataset.width}; --height: ${el.dataset.height}">`;
				aspect_tail = "</span>";
			}

			images += el.querySelector("img")
				? `<div>${aspect}<img loading="lazy" data-src="${url}" title="" data-link="${slide_link}" ${target_width} ${target_height}>${aspect_tail}${
						(caption ? "<p class=n-lightbox--caption>" + caption + "</p>" : "") + link_element
				  }</div>`
				: `<div class="n-lightbox--no-image">${el.innerHTML}</div>`;

			// Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?
		});

		lightbox_target.innerHTML = images;

		// If secondary, openFullWindow(lightbox_target)
		// If normal, attach lightbox_target on the former place of the lightbox and init(their_parent)

		var anchor = el;

		if (anchor.href) {
			// If it's a standard lightbox with a[href], not a secondary full screen lightbox from an inline one

			while (typeof anchor.href !== "string") {
				anchor = anchor.parentNode;
			}

			// Load the images in the current slide and its neighbours
			while (anchor.tagName !== "A") {
				anchor = anchor.parentNode;
			}
		}

		// To do: after closing an URI-invoked lightbox and opening a lightbox again, the index is incorrect
		var this_index = 0;

		if (hasClass(lightbox, "n-lightbox__inline")) {
			// Secondary lightbox

			this_index = Array.prototype.indexOf.call(lightbox.children, anchor.closest(".n-slider > *")); // Ignore non-anchor children of the lightbox container
		} else {
			this_index = Array.prototype.indexOf.call(lightbox.querySelectorAll("[href]"), anchor.closest("[href]")); // Ignore non-anchor children of the lightbox container
		}

		if (location.href.indexOf("#" + lightbox.id) > -1 && hasClass(lightbox, "uri-target")) {
			removeClass(lightbox, "uri-target"); // Open URI-specified index only once, because subsequent lightbox instances would have incorrect index
			if (!!getURLParameters()["slide"]) {
				this_index = getURLParameters()["slide"].split("#")[0] - 1;
			}

			if (!!getURLParameters()["image"]) {
				var target_image = lightbox_target.querySelector('[data-src*="' + getURLParameters()["image"].split("#")[0] + '"]');
				if (target_image) {
					this_index = thisIndex(target_image.parentNode);
				}
			}
		}

		if (this_index > lightbox_target.children.length - 1 || this_index < 1) {
			// To do: fix this_index for a secondary full screen lightbox

			this_index = 0;
		}

		populateLightbox(lightbox_target, this_index);

		var slider = componentSlider.makeSlider(lightbox_target, this_index);
		// attach lightbox_target to the DOM
		if (inline_static) {
			if (!next_sibling) {
				parent.appendChild(slider);
			} else {
				parent.insertBefore(slider, next_sibling);
			}
		} else {
			// OpenFullWindow() and attach the slider to it

			addClass(slider, "n-slider__overlay");
			addClass(slider.querySelector(".n-slider"), "n-slider__overlay");
			componentModal.openFullWindow(slider);
			componentSlider.mouseEvents(slider);
		}

		transferClass(anchor.parentNode, lightbox_target.parentNode, "n-slider__outside");

		if (hasClass(lightbox, "n-lightbox__thumbnails")) {
			transferClass(lightbox, lightbox_target.parentNode, "n-lightbox__thumbnails");
			var i = 0;
			var nav = componentSlider.getSliderNav(lightbox_target.closest(".n-slider--wrap"));

			if (nav) {
				// Multiple slides?

				transferClass(lightbox, nav, "n-lightbox__thumbnails");
				thumbnails.forEach((el) => {
					if (nav.children[i]) {
						nav.children[i].style.backgroundImage = "url(" + thumbnails[i] + ")";
					}
					i++;
				});
			}
		}

		if (!hasClass(lightbox, "n-lightbox__inline")) {
			// Don't block global keyboard if the lightbox is inline

			window.addEventListener("keydown", arrow_keys_handler, false);
		}

		observerOn();

		return false;
	}

	// Automatically open a lightbox specified in the URI

	setTimeout(() => {
		let target_el = q(".n-lightbox:target:not(.n-lightbox__inline), .n-lightbox.n-target:not(.n-lightbox__inline)");

		if (target_el) {
			addClass(target_el, "uri-target");
			openLightbox(q(".n-lightbox:target > a[href], .n-lightbox.n-target > a[href]"));
		}

		if (q(".n-modal:target")) {
			q(".n-modal:target").click();
		}
	}, 1);

	let init = (host) => {
		host.querySelectorAll(".n-lightbox:not([data-ready])").forEach((el) => {
			// Abort on IE, because of IE bug on dynamic img.src change
			if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1 || hasClass(el.parentNode, "n-slider--wrap")) {
				return;
			}

			if (hasClass(el, "n-lightbox__inline")) {
				openLightbox(el.querySelector("a"));
			} else {
				el.querySelectorAll("a").forEach((el) => {
					el.setAttribute("tabindex", 0);
					el.onclick = openLightbox;
				});
			}

			makeReady(el);
		});
	};
	registerComponent("lightbox", init);

	/* Lightbox – end */

	return { populateLightbox: populateLightbox, openLightbox: openLightbox };
})();

//→ disable-body-scroll-ios.js:
'use strict';

/**
 * This is a function where type checking is disabled.
 * @suppress {misplacedTypeAnnotation}
 */
window.nuiDisableBodyScroll = (function () {
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
		if (event.targetTouches.length !== 1 || event.target.closest(".n-slider--nav")) {
			// also if trying to swipe slider/lightbox nav
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
	return function (allow, selector) {
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

	function adjustModal(e) {
		if (!!window.visualViewport) {
			document.body.style.setProperty("--overlay-top", `${window.visualViewport.offsetTop}px`);
			document.body.style.setProperty("--overlay-bottom", `${window.innerHeight - window.visualViewport.height}px`);
		}

		/*
		var modal = q('.n-ovrl');
		var previous_overlay_top = parseInt(document.body.style.getPropertyValue('--overlay-top'));
		var actual_viewport = window.innerHeight;
		var offset_y = modal ? modal.getBoundingClientRect().y : 0;
		if ((previous_overlay_top + '') === 'NaN') {
			
			previous_overlay_top = 0;

		}

		document.body.style.setProperty('--overlay-top', 0);
		document.body.style.setProperty('--overlay-bottom', 0);
		var screen_height = modal ? modal.scrollHeight : 0;

		if (!navigator.userAgent.match(/(iPod|iPhone)/i) || Math.abs(window.orientation) !== 90 || actual_viewport === screen_height) { // Only for mobile Safari in landscape mode
			
			return;

		}
		
		if (!!e) { // On resize event (toolbars have appeared by tapping at the top or bottom area

			document.body.style.setProperty('--overlay-top', (previous_overlay_top - offset_y) + 'px');
			document.body.style.setProperty('--overlay-bottom', (screen_height - actual_viewport + offset_y) + 'px');
			
		} else {
		
			if (qa('.n-ovrl').length > 1) { // Multiple modals: offset has been set, no need to do anything
				
				return;
	
			}

			if (actual_viewport <= screen_height) { // modal is cropped, adjust its top/bottom
				
				if ((document.body.scrollHeight + document.body.getBoundingClientRect().y) === actual_viewport) {// page scrolled at the bottom

					document.body.style.setProperty('--overlay-bottom', 0);
					document.body.style.setProperty('--overlay-top', (screen_height - actual_viewport) + 'px');
	
				} else {
	
					document.body.style.setProperty('--overlay-top', 0);
					document.body.style.setProperty('--overlay-bottom', (screen_height - actual_viewport) + 'px');
				}
			
			}
		
			if (modal && modal.getBoundingClientRect().y !== 0) { // A little off
	
				document.body.style.setProperty('--overlay-top', (parseInt(document.body.style.getPropertyValue('--overlay-top')) - modal.getBoundingClientRect().y) + 'px');
				document.body.style.setProperty('--overlay-bottom', (parseInt(document.body.style.getPropertyValue('--overlay-bottom')) + modal.getBoundingClientRect().y) + 'px');
				
			}
			
			if ((actual_viewport + parseInt(document.body.style.getPropertyValue('--overlay-top')) + parseInt(document.body.style.getPropertyValue('--overlay-bottom'))) > screen_height) { // Extra bug when scrolled near the bottom
				
				document.body.style.setProperty('--overlay-bottom', (screen_height - actual_viewport - parseInt(document.body.style.getPropertyValue('--overlay-top'))) + 'px');
				
			}
		
		}
*/
	}

	function keyUpClose(e) {
		if ((e || window.event).keyCode === 27) {
			// Esc

			closeFullWindow();
		}
	}

	var previousScrollX = 0;
	var previousScrollY = 0;

	function closeFullWindow() {
		let full_window = qa(".n-ovrl");
		full_window = full_window[full_window.length - 1];

		if (full_window) {
			window.scrollTo(previousScrollX, previousScrollY);
			var animation = full_window.querySelector(".n-ovrl--content > div").dataset.anim; // Custom animation?
			if (animation.length < 11) {
				// '', 'null' or 'undefined'?

				animation = "0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(0,-100%,0) }"; // 100% instead of 100vh, bc IE fails
			} else {
				full_window.style.cssText = "animation-direction: reverse;";
			}

			animate(full_window, animation, 0.2, (e) => {
				nuiDisableBodyScroll(false, full_window.querySelector(".n-ovrl--content")); // Turn off and restore page scroll
				full_window.parentNode.removeChild(full_window);
				full_window_content = null;

				if (!q(".n-ovrl")) {
					// A single overlay is gone, leaving no overlays on the page

					window.removeEventListener("resize", adjustModal);
					window.removeEventListener("keydown", arrow_keys_handler); // To do: unglobal this and apply only to modal
					window.removeEventListener("keyup", keyUpClose);
					removeClass(q("html"), "no-scroll");

					if (!q(".n-slider")) {
						// No sliders on the page to control with arrow keys

						window.removeEventListener("keydown", arrow_keys_handler, false);
					}
				} else {
					nuiDisableBodyScroll(true, full_window.querySelector(".n-ovrl--content"));
					adjustModal();
				}

				if (previouslyFocused) {
					previouslyFocused.focus();
				}
			});
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
		addClass(wrapper, "n-ovrl");
		wrapper.insertAdjacentHTML("beforeend", "<div class=n-ovrl--content tabindex=0></div><div class=n-overlay-bg></div>");
		wrapper.firstChild.appendChild(full_window_content);
		full_window_content = wrapper;

		full_window_content.insertAdjacentHTML("afterbegin", `<button class=n-ovrl--close> ← ${document.title}</button>`);
		full_window_content.querySelector(".n-overlay-bg").onclick = full_window_content.querySelector(".n-ovrl--close").onclick = closeFullWindow;
		full_window_content.querySelector(".n-ovrl--close").addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
			},
			{ passive: false }
		);
		full_window_content.querySelector(".n-overlay-bg").addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
			},
			{ passive: false }
		);
		window.addEventListener("keyup", keyUpClose);

		document.body.appendChild(full_window_content);

		let full_window_container = full_window_content.querySelector(".n-ovrl--content");

		full_window_container.focus();

		nuiDisableBodyScroll(true, full_window_container); // Turn on and block page scroll

		if (qa(".n-ovrl").length === 1) {
			// Sole (first) modal

			addClass(q("html"), "no-scroll");
			previousScrollX = window.scrollX;
			previousScrollY = window.scrollY;
			window.addEventListener("resize", adjustModal);
			adjustModal();
		}

		if (full_window_content.querySelector(".n-full-screen") && !is_iPad) {
			// iPad iOS 12 full screen is still experimental and buggy

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
			animate(full_window_content, typeof animation === "string" ? animation : "0% { transform: translate3d(0,-100%,0) } 100% { transform: translate3d(0,0,0) }", 0.2);
		}

		return false;
	}

	function modalWindow(e) {
		// Modal window of an external file content

		var el = e.target;

		var link = el.closest(".n-modal").href;
		var animation = el.closest(".n-modal").dataset.anim;

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
				transferClass(el.closest(".n-modal"), q(".n-ovrl"), "n-modal__limited");
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

		host.querySelectorAll("a.n-modal[href]:not([data-ready])").forEach((el) => {
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

(function() {
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

		if (document.fullscreen || document.webkitIsFullScreen) { // Exit full screen
			!!document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
			if (isSafari) { // When exit finishes, update the carousel because on Safari 14, position is wrong or the slide is invisible
				setTimeout(() => {

					// console.log('updating', el);
					// updateCarousel(el);
					el.style.display = 'none';
					window.requestAnimationFrame(() => {

						el.style.display = '';
					});


				}, 0);
			}
		} else { // Enter full screen
			if (isSafari) {
				el.nuiAncestors = scrolledAncestors(el);
				el.nuiAncestors.forEach((el) => {
					el.nuiScrollX = el.scrollLeft;
					el.nuiScrollY = el.scrollTop;
				});
				el.addEventListener("webkitfullscreenchange", restoreScroll, false);
			}!!el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen();
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

	const trapFocus = (modal) => {
		// FROM: https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
		// add all the elements inside modal which you want to make focusable
		const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

		const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
		const focusableContent = modal.querySelectorAll(focusableElements);
		const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

		document.addEventListener("keydown", function(e) {
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

		if (current_active) {
			// console.log("updateCarousel bailing on unchanged slide");
			if (el.children[active] === current_active) {
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

		el.children[active].dataset.active = true;
		el.children[active].style.height = "";
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
		
		let hash = el.children[active].id;
		if (!!hash) {
			location.hash = `#${hash}`;
		}
		
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
		// if (carousel.classList.contains("n-carousel--overlay")) {
		//   carousel.animate([{ transform: "none" }, { transform: "translateY(-100%)" }], { duration: 200 }).onfinish = () => {
		//     carousel.classList.remove("n-carousel--overlay");
		//   };
		// }
		carousel.classList.remove("n-carousel--overlay");
		delete document.body.dataset.frozen;
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
			content.tabIndex = 0;
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

//→ n-carousel.js:
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

		animate(item, `0% { height: ${item.scrollHeight}px; } 100% { height: 0 }`, 0.2, () => {
			item.removeAttribute("style");
			item.parentElement.removeAttribute("aria-expanded");
			navAnimating = false;

			item.querySelectorAll("[aria-expanded]").forEach((el) => {
				el.removeAttribute("aria-expanded");
			});
		});
	};

	let openItem = (item) => {
		navAnimating = true;
		item.style.overflow = "hidden";
		item.parentElement.setAttribute("aria-expanded", true);
		animate(item, `0% { height: 0; } 100% { height: ${item.scrollHeight}px }`, 0.2, () => {
			item.removeAttribute("style");
			navAnimating = false;
		});
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

		el.setAttribute("role", "menubar");

		el.querySelectorAll("li > a").forEach((el) => {
			el.setAttribute("tabindex", 0);
		});

		if (!el.closest(".n-nav.n-nav__drop")) {
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

		draggingNow = false;

		window.requestAnimationFrame(() => {
			// Give the browser time to update

			el.querySelectorAll("ul").forEach((ul) => {
				checkSides(ul, menubar);
			});
		});
	}

	window.addEventListener("resize", function (e) {
		document.querySelectorAll('.n-nav.n-nav__drop ul[role="menubar"]').forEach((menubar) => {
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
		document.body.insertAdjacentHTML("afterbegin", `<div class="n-notify${option && option.indexOf("fixed") !== -1 ? " n-notify__fixed" : ""}">${content}</div>`);
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

//→ slider.js:
'use strict';

// Component Slider – start

var componentSlider = (function () {
  /* niui Slider */

  var last_slide_time = 14045017000;
  var slide_duration = 0.5;

  function sliderElement(e) {
    // Get the active slider instance

    // 		var closest_slider_wrap = document.activeElement.closest('.n-slider--wrap');
    var closest_slider_wrap = e.target.closest(".n-slider--wrap");

    if (closest_slider_wrap && closest_slider_wrap === focusWithin(".n-slider--wrap")) {
      return focusWithin(".n-slider--wrap").querySelector(".n-slider");
    }

    var el = e.target;

    if (hasClass(el, "n-slider--wrap")) {
      return el.querySelector(".n-slider");
    } else {
      var container = el.closest(".n-slider--wrap");
      return container && container.querySelector(".n-slider");
    }
  }

  function getSliderNav(slider_wrap) {
    // Select either a child n-slider--nav or the one specified by the slider id, if it exists
    var slider = slider_wrap.querySelector(".n-slider");
    var slider_nav;

    if (slider.id && (slider_nav = q(`.n-slider--nav[data-for=${slider.id}]`))) {
      // Detached nav

      return slider_nav;
    } else {
      let nav = slider_wrap.querySelectorAll(".n-slider--nav");
      return nav[nav.length - 1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .n-pad direct child, taken as the last one of all.
    }
  }

  /* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

  function swipeEvents(el) {
    var startX, startY;

    el.addEventListener("touchstart", touchStart);

    function touchStart(e) {
      var touches = e.touches;
      if (touches && touches.length) {
        startX = touches[0].pageX;
        startY = touches[0].pageY;
        el.addEventListener("touchmove", touchMove);
      }
    }

    function touchMove(e) {
      var touches = e.touches;

      if (touches && touches.length && !(hasClass(el, "n-slider__vertical") && !el.closest(".n-ovrl"))) {
        // Don't slide vertically if not full window

        var deltaX = startX - touches[0].pageX;
        var deltaY = startY - touches[0].pageY;
        var delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
        var overlay_content = el.closest(".n-ovrl") ? el.closest(".n-ovrl").querySelector(".n-ovrl--content") : null;

        // Allow vertical page scroll by swiping over the slider. Also when parent modal is scrollable vertically
        if (
          ((hasClass(el, "n-slider__vertical") ? Math.abs(deltaY) < Math.abs(deltaX) : Math.abs(deltaX) < Math.abs(deltaY)) && !q(".n-ovrl .n-slider--wrap")) ||
          (overlay_content && overlay_content.scrollHeight > overlay_content.offsetHeight && Math.abs(deltaX) < Math.abs(deltaY)) ||
          (e.target.nodeName === "INPUT" && e.target.type === "range") ||
          hasClass(e.target.parentNode, "n-slider--nav") ||
          hasClass(e.target, "n-slider--nav")
        ) {
          return;
        }

        e.preventDefault();

        if (Math.abs(delta) > 50) {
          var event = new Event(delta >= 50 ? "swipeLeft" : "swipeRight");
          el.dispatchEvent(event);
          el.removeEventListener("touchmove", touchMove);
        }
      }
    }
  }

  var scroll_timestamp = 0;

  function mouseWheelHandler(e) {
    let el = e.target;

    let current_slider_wrap = el.closest(".n-slider--wrap");
    let current_slider = el.closest(".n-slider");

    if (e.timeStamp - scroll_timestamp > 1666 && current_slider && !el.closest(".n-slider--nav") && !current_slider_wrap.getAttribute("data-active")) {
      var deltaX = e.deltaX * -10 || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
      var deltaY = e.deltaY * -10 || e.wheelDeltaY || -e.detail;

      if (Math.abs(hasClass(current_slider, "n-slider__vertical") ? deltaY : deltaX) > 50) {
        scroll_timestamp = e.timeStamp;
        e.stopPropagation();
        slide(current_slider, (Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY) < 0 ? "right" : "left");
      }
    }
  }

  function mouseEvents(el, toggle) {
    if (!("onwheel" in window) || (hasClass(el, "n-slider__vertical") && !el.closest(".n-ovrl"))) {
      // Check for mouse wheel and don't slide vertically if not full window

      return;
    }

    if (toggle === "off") {
      el.removeEventListener("wheel", mouseWheelHandler);
    } else {
      el.addEventListener("wheel", mouseWheelHandler);
    }
  }

  function endSlide(slider, index, old_index) {
    if (hasClass(slider, "n-lightbox")) {
      componentLightbox.populateLightbox(slider, index);
    }

    var slider_wrap = slider.closest(".n-slider--wrap");

    if (getSliderNav(slider_wrap)) {
      // Multiple slides? // To do: get the proper slider nav, if it's detached

      getSliderNav(slider_wrap).children[index].setAttribute("data-active", true);
    }

    slider.children[index].dataset.active = true; // Can't use 'sliding', because Closure Compiler obfuscates it

    if (!hasClass(slider, "n-slider__vertical")) {
      slider.style.marginLeft = `${-100 * index}%`;
    }

    slider.style.pointerEvents = slider.style.height = "";

    window.addEventListener("keyup", sliderKeyboard);
    mouseEvents(slider_wrap);
    var timeNow = new Date().getTime();
    last_slide_time = timeNow;

    if (slider.children[index].id) {
      var focused = document.activeElement;
      window.location.hash = slider.children[index].id;
      focused.focus();
    } else {
      if (!!old_index && location.hash === "#" + slider.children[old_index].id) {
        removeHash();
      }
    }
  }

  function slide(el, method, index_number) {
    // 2 directions: horizontal/vertical
    // 3 animations: slide/fade/fade overlap

    var slider_wrap = el.closest(".n-slider--wrap");

    var slider = slider_wrap.querySelector(".n-slider");

    if (slider.children.length < 2) {
      endSlide(slider, 0);
      return slider;
    }

    slider.style.pointerEvents = "none"; // Speed up animation
    mouseEvents(slider_wrap, "off");
    window.removeEventListener("keyup", sliderKeyboard);

    clearTimeout(slider.dataset.timeout);

    var index;
    var old_index;
    var slider_nav = getSliderNav(slider_wrap);
    var active_nav_item = slider_nav.querySelector("[data-active]");
    if (!active_nav_item) {
      return;
    }
    index = old_index = thisIndex(active_nav_item);

    if (method === "index") {
      if (typeof index_number === "undefined" || index_number === index || !slider.querySelector("[data-active]")) {
        /* Don't slide to current slide */

        endSlide(slider, index_number);
        return;
      }
      index = index_number;
    }

    if (method === "right") {
      if (index === slider.children.length - 1) {
        index = 0;
      } else {
        index++;
      }
    }

    if (method === "left") {
      if (index === 0) {
        index = slider.children.length - 1;
      } else {
        index--;
      }
    }

    var offset_sign = -1; // Slider offset depending on direction. -1 for LTR or 1 for RTL. Vertical is always '-'

    var computed_height;
    var computed_height_old;

    var target_slide = slider.children[index];

    var height_change = "";
    var height_current = "";

    if (hasClass(slider, "n-slider__auto-height")) {
      height_change = `height: ${target_slide.scrollHeight}px`;
      height_current = `height: ${slider.scrollHeight}px`;
    }

    var original_slider_height = slider.scrollHeight;
    target_slide.dataset.active = true;

    var next_slide_image = target_slide.querySelector("img");
    if (hasClass(slider, "n-slider__vertical") || (hasClass(slider, "n-slider__auto-height") && hasClass(slider, "n-lightbox__inline"))) {
      if (hasClass(slider, "n-lightbox__inline") && !hasClass(slider, "n-slider__overlay") && next_slide_image && !hasClass(slider_wrap.parentNode, "n-aspect")) {
        // Inline lightbox only. To do: integrate n-aspect with n-slider--wrap

        let next_image_width = next_slide_image.getAttribute("width") ? next_slide_image.getAttribute("width") * 1 : next_slide_image.naturalWidth; // To do: set data-width, data-height from the anochor link
        let next_image_height = next_slide_image.getAttribute("height") ? next_slide_image.getAttribute("height") * 1 : next_slide_image.naturalHeight;

        var height_change_number = (slider.clientWidth * next_image_height) / next_image_width;
        if (slider.clientWidth >= next_image_width) {
          height_change_number = next_image_height;
        }
        if (hasClass(next_slide_image.parentNode, "n-aspect")) {
          height_change_number = next_slide_image.parentNode.offsetHeight;
        }
        height_change = `height: ${height_change_number}px`;
      } else {
        // Vertical, not a lightbox, non-img content (video, iframe)

        if (hasClass(slider, "n-slider__auto-height")) {
          target_slide.style.position = "absolute";
        }
        height_change = `height: ${target_slide.clientHeight}px`;
        target_slide.style.cssText = "";
      }

      height_current = `height: ${original_slider_height}px`;

      target_slide.style.display = "block"; // Temporarily display the target slide to get its height
      computed_height = getComputedStyle(target_slide).height;
      target_slide.setAttribute("style", target_slide.getAttribute("style").replace("display: block;", "")); // Keep any other inline styles
      computed_height_old = getComputedStyle(slider.children[old_index]).height;
    } else {
      computed_height = getComputedStyle(slider).height;
      if (slider.getAttribute("dir") === "rtl") {
        offset_sign = 1;
      }
    }

    slider.style.height = computed_height;

    slider_wrap.dataset.active = true; // The correct position, after the above calculations

    if (slider_nav.querySelector("[data-active]")) {
      delete slider_nav.querySelector("[data-active]").dataset.active;
    }

    var duration = slider.dataset.duration || slide_duration;

    var translate_from, translate_to;

    if (hasClass(slider, "n-slider__vertical")) {
      computed_height = parseInt(computed_height, 10);
      computed_height_old = parseInt(computed_height_old, 10);

      var next_height = !hasClass(slider, "n-slider__overlay") && next_slide_image && !hasClass(slider_wrap.parentNode, "n-aspect") ? `-${height_change_number}px` : "-100%";
      translate_from = `translate3d(0,${index < old_index ? "-" + computed_height + "px" : 0},0)`;
      if (hasClass(slider, "n-tabs") && computed_height < original_slider_height && index < old_index) {
        slider.style.overflow = "hidden";
      }

      /*
		    var difference = Math.abs(computed_height - computed_height_old);

		    if (computed_height > computed_height_old) {
			    
			    difference = Math.max(computed_height, computed_height_old) - difference;
			    
		    } else {
			    
			    difference = Math.min(computed_height, computed_height_old) + difference;
			    
		    }

		    if (computed_height === computed_height_old) {
			    
			    difference = 0;
			    
			}
*/

      translate_to = `translate3d(0,${index < old_index ? "0" : "-" + original_slider_height + "px"},0)`;
      /*
		    slider.children[old_index].style.transition = `opacity ${duration/2}s linear`; // On Safari, this delays the sliding, making the slider jump
		    slider.children[old_index].style.opacity = 0;
*/
    } else {
      if (!!slider.dataset.peek) {
        translate_from = "translate3d(0,0,0)";
        translate_to = `translate3d(${offset_sign * (index - old_index)}00%,0,0)`;
      } else {
        slider.style.margin = 0;
        translate_from = `translate3d(${offset_sign * (index < old_index ? 1 : 0)}00%,0,0)`;
        translate_to = `translate3d(${offset_sign * (index < old_index ? 0 : 1)}00%,0,0)`;
      }
    }

    function slideEndHandler(e) {
      // On slide end

      // 			slider.children[index].style.cssText = slider.children[old_index].style.cssText = '';

      delete slider_wrap.dataset.active;
      delete slider.children[old_index].dataset.active;
      slider.style.overflow = "";

      [slider.children[index], slider.children[old_index]].forEach((el) => {
        el.style.transition = el.style.opacity = el.style.height = el.style.margin = "";
      });

      current_slider = slider;
      endSlide(slider, index, old_index);
    }

    if (hasClass(slider, "n-slider__fade-overlap")) {
      // fade slides in/out directly. Overlap new and old slides.

      slider.children[index].style.opacity = 0;
      slider.children[index > old_index ? index : old_index].style.marginLeft = "-100%";
      slider.children[old_index].style.opacity = 1;

      // Animate both simultaneously

      animate(slider, `0% { ${height_current}; } 100% { ${height_change}; }`, duration);
      animate(slider.children[index], "0% { opacity: 0; } 100% { opacity: 1; }", duration, slideEndHandler);
      animate(slider.children[old_index], "0% { opacity: 1; } 100% { opacity: 0; }", duration);
    } else {
      var animation_code;

      if (hasClass(slider, "n-slider__fade")) {
        // fade out to a color and fade in to the new slide

        animation_code = `0% { opacity: 1; transform: ${translate_from}; ${height_current}} 49% { transform: ${translate_from} } 51% { opacity: 0; transform: ${translate_to} } 100% { ${height_change}; opacity: 1; transform: ${translate_to} }`;
      } else {
        if (hasClass(slider, "n-slider__vertical") && !hasClass(slider, "n-lightbox") && old_index > index && computed_height < original_slider_height) {
          animation_code = `0% { margin-top: -${computed_height}px; height: ${computed_height + computed_height_old}px; } 100% { margin-top: 0; ${height_change}; }`;
        } else {
          animation_code = `0% { transform: ${translate_from}; ${height_current}; } 100% { ${height_change}; transform: ${translate_to}; }`;
        }
      }

      animate(slider, animation_code, duration, slideEndHandler);
    }
  }

  function shouldNotSlideVertically(el) {
    if (q(".n-ovrl")) {
      return false;
    }
    return !hasClass(el, "n-slider__vertical") || window.innerHeight < document.body.scrollHeight;
  }

  function sliderKeyboard(e) {
    // e.target can be either body or a slider, choose accordingly

    if (
      !e ||
      q(".n-slider--wrap[data-active]") ||
      (q(".n-ovrl") && !q(".n-ovrl .n-slider--wrap")) // There is an overlay open and it doesn't have a slider in it
    ) {
      return;
    }

    var el = e.target;

    if (!el.closest(".n-slider--wrap") && q(".n-slider--wrap")) {
      // Focused element is outside of any slider
    } else {
      current_slider = el.closest(".n-slider--wrap") ? el.closest(".n-slider--wrap").querySelector(".n-slider") : null;
    }

    if (focusWithin(".n-slider")) {
      current_slider = focusWithin(".n-slider");
    }

    if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" && (el = q(".n-ovrl .n-slider") || current_slider || q(".n-slider"))) {
      // Priority: full window slider, active slider, first slider

      if (hasClass(document.activeElement, "n-slider")) {
        el = document.activeElement;
      }

      if (e.key !== "Escape") {
        e.stopPropagation();
      }

      switch (e.which) {
        case 38:
          if (shouldNotSlideVertically(el)) {
            // Page can be scrolled by the arrow key so don't slide

            return;
          }
        case 37:
          slide(el, "left");
          break;
        case 40:
          if (shouldNotSlideVertically(el)) {
            return;
          }
        case 39:
          slide(el, "right");
          break;
        default:
          return;
      }
    }
  }

  function cancelTouchEvent(el) {
    el.addEventListener("touchstart", (e) => {
      e.stopPropagation();
      return false;
    });
  }

  function makeSlider(el, current_slide) {
    if (!!el.dataset.ready) {
      // Already created

      return;
    }

    observerOff();

    addClass(el, "n-slider");
    el.setAttribute("tabindex", 0); // For keyboard events
    makeReady(el);

    if (hasClass(el, "n-full-window")) {
      addClass(el, "n-slider__overlay");
      componentModal.openFullWindow(el.outerHTML);
    }

    var container = el.parentNode;

    if (!container || !hasClass(container, "n-slider--wrap")) {
      container = wrap(el);
      addClass(container, "n-slider--wrap");
    }

    if (hasClass(container, "n-pad")) {
      addClass(wrap(el), "n-pad");
      removeClass(container, "n-pad");
    }

    ["n-slider__vertical", "n-wrap", "n-slider__top", "n-slider__right", "n-slider__overlay"].forEach((item) => transferClass(el, container, item));

    var peek = el.dataset.peek;
    if (peek) {
      addClass(container, "n-slider__peek");

      container.style.padding = hasClass(el, "n-slider__vertical") ? peek + " 0" : "0 " + peek;
    }

    // Generate controls if needed

    var slider_nav = false;

    if (el.id && (slider_nav = q(`.n-slider--nav[data-for=${el.id}]`))) {
      // Detached nav

      addClass(container, "n-slider__detached-nav");
      addClass(el, "n-slider__detached-nav");
      transferClass(container, slider_nav, "n-slider__vertical");
    } else {
      container.childNodes.forEach((el) => {
        slider_nav = el.nodeName === "DIV" && el.matches(".n-slider--nav") ? el : slider_nav;
      });

      if (!slider_nav) {
        container.insertAdjacentHTML(hasClass(container, "n-slider__top") ? "afterbegin" : "beforeend", "<div class=n-slider--nav></div>");
        slider_nav = hasClass(container, "n-slider__top") ? container.firstChild : container.lastChild;
      }
    }

    // Populate controls

    if (hasClass(el, "n-tabs")) {
      addClass(container, "n-tabs");
      addClass(slider_nav, "n-row");
      addClass(slider_nav, "n-tabs");
      transferClass(container, slider_nav, "n-wrap");
      transferClass(el, container, "n-slider__vertical");
    }

    if (slider_nav.children.length !== el.children.length) {
      // Nav doesn't already exist

      slider_nav.innerHTML = "";
      for (var i = 0; i < el.children.length; i++) {
        if (hasClass(el, "n-tabs")) {
          var tab_title = el.children[i].dataset.tabTitle || (el.children[i].querySelector(".n-tab-title") ? el.children[i].querySelector(".n-tab-title").innerHTML : i + 1);
          slider_nav.insertAdjacentHTML("beforeend", `<button>${tab_title}</button>`);
        } else {
          slider_nav.insertAdjacentHTML("beforeend", `<button>${i + 1}</button>`);
        }
      }
    }

    let slideKeyboardHandler = (e) => {
      var scrollable = e.target; // Don't slide when current element is scrollable
      if (e.key === "Escape" || hasClass(scrollable.parentNode, ".n-slider__overlay")) {
        return;
      }
      if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) {
        e.stopPropagation();
        return;
      }
    };

    Array.from(el.children).forEach((el, i) => {
      let nav_item = slider_nav.children[i];
      nav_item.onclick = (e) => {
        slide(
          // Select slider either through id or as a parent
          slider_nav.dataset.for ? q(".n-slider#" + slider_nav.dataset.for) : e.target,
          "index",
          thisIndex(e.target)
        );

        return false;
      };

      cancelTouchEvent(nav_item);

      el.setAttribute("tabindex", 0);
      el.addEventListener("keyup", slideKeyboardHandler);
    });

    // Generate arrows

    container.insertAdjacentHTML("beforeend", '<button class="n-slider--arrow n-slider--left"></button><button class="n-slider--arrow n-slider__right"></button>');

    let setArrowEvents = (selector, direction) => {
      let arrow = container.querySelector(".n-slider--arrow" + selector);
      arrow.onclick = arrow.onkeyup = (e) => {
        if (e.type === "keyup" && e.keyCode !== 13) {
          // Slide on Enter key

          return;
        }

        slide(e.target, direction);
      };

      cancelTouchEvent(arrow);
    };

    setArrowEvents("", "left");
    setArrowEvents(".n-slider__right", "right");

    // Set mouse and touch events

    mouseEvents(container);

    swipeEvents(container);

    container.addEventListener("swipeLeft", (e) => {
      slide(e.target, "right");
    });

    container.addEventListener("swipeRight", (e) => {
      slide(e.target, "left");
    });

    container.addEventListener("mouseover", (e) => {
      clearTimeout(el.dataset.timeout);
    });

    // Don't slide when using a range input in a form in a slider
    el.querySelectorAll("input[type=range]").forEach((el) => {
      el.ontouchmove = (e) => {
        e.stopPropagation();
      };
    });

    if (!!el.dataset.autoslide) {
      // auto slide

      var delay = el.dataset.autoslide;
      delay = delay.length > 0 ? 1000 * delay : 4000;
      var autoSlide = () => {
        slide(el, "right");
        el.dataset.timeout = setTimeout(autoSlide, delay);
      };

      setTimeout(autoSlide, delay);
    }

    var _current_slide = current_slide;

    // If URI #id matches a slide #id, go to that slide and scroll the page to the slider.
    if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
      _current_slide = thisIndex(el.querySelector(window.location.hash));
      current_slider = container;
    }

    endSlide(el, _current_slide || 0); // Start from (other than) the first slide

    // Detect text direction
    el.setAttribute("dir", getComputedStyle(el, null).getPropertyValue("direction"));

    el.addEventListener("keyup", sliderKeyboard);

    if (hasClass(el, "n-lightbox__inline")) {
      // It's an inline lightbox and needs to become full window/screen when clicked. If it's not a dynamically generated lightbox for full-window lightbox

      el.onclick = (e) => {
        if (e.target.tagName === "IMG") {
          componentLightbox.openLightbox(e);
        }
      };
    }

    observerOn();

    return container;
  }

  let init = (host) => {
    host.querySelectorAll(".n-slider:not([data-ready])").forEach((el) => {
      makeSlider(el);
    });

    window.addEventListener("keyup", sliderKeyboard);
  };
  registerComponent("slider", init);

  window.addEventListener(
    "hashchange",
    () => {
      let new_hash_slide = q(".n-slider > :target, .n-slider > .n-target");
      if (new_hash_slide) {
        slide(new_hash_slide.parentNode, "index", thisIndex(new_hash_slide));
      }
    },
    false
  );

  return { makeSlider, getSliderNav, slide, mouseEvents };
})();

// Component Fold – end

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

	const comparer = (idx, asc) => (a, b) =>
		((v1, v2) => (v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

	let init = (host) => {
		host.querySelectorAll(".n-table:not([data-ready])").forEach((el) => {
			el.querySelectorAll("thead td button.n-table-sort, th button.n-table-sort").forEach((button) =>
				button.addEventListener("click", (e) => {
					let th = e.target.closest("th") || e.target.closest("td");
					const tbody = th.closest("table").querySelector("tbody");
					Array.from(tbody.querySelectorAll("tr"))
						.sort(comparer(Array.from(th.parentNode.children).indexOf(th), toggleSort(th)))
						.forEach((tr) => tbody.appendChild(tr));
				})
			);

			addClass(wrap(el), "n-table--wrap");
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
		return document.querySelector('.n-tool--tip[for="' + e.target.closest(".n-tool").dataset.nTool + '"]');
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
			let tip = el.querySelector(".n-tool--tip");
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
initComponents(); return { initComponents, animate, copyButton, componentModal, addComponent, componentSlider, componentNotify } })();
