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
