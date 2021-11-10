// Component Fold – start
(function () {
	/* Fold – start */
	// let closeAccordion = (el, content) => {
	// 	let content_height = content.style.getPropertyValue("--start-height") || 0;
	// 	// animate(content, `0% { max-height: ${content.scrollHeight}px; } 100% { max-height: ${content_height}; }`, 0.2, () => {
	// 	// 	toggleAttribute(el, "aria-expanded");
	// 	// });
	// 	content.animate([{ maxHeight: `${content.scrollHeight}px` }, { maxHeight: content_height }], 200).onfinish = () => {
	// 		// toggleAttribute(el, "aria-expanded");
	// 		el.removeAttribute("aria-expanded");
	// 	};
	// };
	// let openAccordion = (el, content) => {
	// 	let content_height = content.style.getPropertyValue("--start-height") || 0;
	// 	toggleAttribute(el, "aria-expanded");
	// 	// animate(content, `0% { max-height: ${content_height}; } 100% { max-height: ${content.scrollHeight}px; }`);
	// 	content.animate([{ maxHeight: content_height }, { maxHeight: `${content.scrollHeight}px` }], { duration: 200 }).onfinish = () => {
	// 		// toggleAttribute(el, "aria-expanded");
	// 		el.setAttribute("aria-expanded", true);
	// 	};
	// };
	
	const openAccordion = el => {
		
		window.requestAnimationFrame(() => {
			el.style.height = 0;
			el.style.overflow = 'hidden';
			el.animate([{height: 0}, {height: `${el.scrollHeight}px`}], 200).onfinish = () => {
				el.style.height = el.style.overflow = '';
			};
		});
				
	};

	const closeAccordion = el => {
			window.requestAnimationFrame(() => {
				el.parentNode.open = true;
				el.style.overflow = 'hidden';
				el.animate([{height: `${el.scrollHeight}px`}, {height: 0}], 200).onfinish = () => {
					el.style.height = el.style.overflow = '';
					el.parentNode.removeAttribute('open');
				};
			});
					
		};
	
		function toggleAccordion(e) {
		let el = e.target.parentNode;
		// console.log(!!el.open);
		if (!el.open) {
			openAccordion(e.target.nextElementSibling);
		} else {
			closeAccordion(e.target.nextElementSibling);
		}
		let container = el.closest('.n-accordion__popin');
		if (el.parentNode.classList.contains('n-accordion__group') || container) {
			el.parentNode.querySelectorAll(':scope > details[open]').forEach(el2 => {
				if (el2 !== el) {
					// el2.open = false;
					closeAccordion(el2.querySelector(':scope > :not(summary)'))
				}
			});
		}
		if (container) {
			let row = Math.floor([...container.children].indexOf(el) / getComputedStyle(container).getPropertyValue('--n-popin-columns') * 1) + 2;
			container.style.setProperty('--n-popin-open-row', row);
		} // stopEvent(e);
		// var el = e.target.closest(".n-fold");
		// var content = el.querySelector(".n-fold__content");
		// content.style.display = "block"; // To get proper width when horizontal
		// content.style.setProperty("--width", content.scrollWidth + "px");
		// content.style.removeProperty("display");
		// content.style.setProperty("--max-height", content.scrollHeight + "px");
		// if (hasClass(el, "n-fold__horizontal")) {
		// 	toggleAttribute(el, "aria-expanded");
		// } else {
		// 	if (el.hasAttribute("aria-expanded")) {
		// 		// Close
		// 		closeAccordion(el, content);
		// 	} else {
		// 		// Open
		// 		let other = hasClass(el.parentNode, "n-fold__group") && el.parentNode.querySelector("[aria-expanded]");
		// 		openAccordion(el, content);
		// 		if (other && other !== el) {
		// 			// There is another one open, close it if in a group
		// 			closeAccordion(other, other.querySelector(".n-fold__content"));
		// 		}
		// 	}
		// }
		// return false;
	}
	// Close all Fold elements when clicking/tapping outside of them
	// function closeFoldClickOutside(e) {
	// 	var el = e.target;
	// 	if (!el.closest(".n-fold") && !el.closest(".n-tool")) {
	// 		// Clicking/tapping outside of a fold/tooltip element...
	// 		qa(".n-fold.n-fold__mobile[aria-expanded], .n-tool--tip[aria-expanded]").forEach((el) => {
	// 			// ... closes all n-burger nav menus and tooltips
	// 			el.removeAttribute("aria-expanded");
	// 		});
	// 	}
	// 	// Focus on clicked slider
	// 	if (el.closest(".n-slider")) {
	// 		current_slider = el.closest(".n-slider");
	// 	}
	// }
	function init(host) {
		host.querySelectorAll(".n-accordion:not([data-ready]) > summary").forEach((el) => {
			el.addEventListener('click', toggleAccordion);
			el = el.parentNode;
			// var content = el.querySelector(".n-fold__content");
			// if (!hasClass(el, "n-fold__mobile")) {
			// 	content.addEventListener("focusin", (e) => {
			// 		if (!e.target.closest(".n-fold").hasAttribute("aria-expanded")) {
			// 			toggleAccordion(e);
			// 		}
			// 	});
			// }
			// if (hasClass(el, "n-fold__horizontal")) {
			// 	el.dataset.init = true;
			// 	content.style.setProperty("--width", content.scrollWidth + "px");
			// 	content.style.height = "auto";
			// 	delete el.dataset.init;
			// 	setTimeout(() => {
			// 		content.style.transition = "width .2s ease-in-out";
			// 	}, 100);
			// }
			// content.style.setProperty("--max-height", content.scrollHeight + "px");
			// el.querySelectorAll("input.n-trigger").forEach((el) => {
			// 	// Remove CSS-only triggers
			// 	el.parentNode.removeChild(el);
			// });
			// if (hasClass(el, "n-fold--defocus")) {
			// 	el.addEventListener("focusout", (e) => {
			// 		// Close it when tabbing outside
			// 		let el = e.target.closest(".n-fold");
			// 		if (!el.contains(e.relatedTarget)) {
			// 			el.removeAttribute("aria-expanded");
			// 		}
			// 	});
			// }
			makeReady(el);
		});
	}
	// window.addEventListener("pointerup", closeFoldClickOutside); // Close all Fold elements when clicking outside of them
	// window.addEventListener("touchend", closeFoldClickOutside); // Close all Fold elements when clicking outside of them
	// window.addEventListener("scroll", () => {
	// 	// Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
	// 	let expanded_nav = q(".n-header__fixed-mobile .n-fold.n-fold__mobile[aria-expanded]");
	// 	if (expanded_nav) {
	// 		expanded_nav.removeAttribute("aria-expanded");
	// 	}
	// });
	/* Fold – end */
	registerComponent("fold", init);
})();
// Component Fold – end
// function setDetailsHeight(selector, wrapper = document) {
// 	const setHeight = (detail, open = false) => {
// 		detail.open = open;
// 		const rect = detail.getBoundingClientRect();
// 		detail.dataset.width = rect.width;
// 		detail.style.setProperty(open ? `--expanded` : `--collapsed`, `${rect.height}px`);
// 	}
// 	const details = wrapper.querySelectorAll(selector);
// 	const RO = new ResizeObserver(entries => {
// 		return entries.forEach(entry => {
// 			const detail = entry.target;
// 			const width = parseInt(detail.dataset.width, 10);
// 			if (width !== entry.contentRect.width) {
// 				detail.removeAttribute('style');
// 				setHeight(detail);
// 				setHeight(detail, true);
// 				detail.open = false;
// 			}
// 		})
// 	});
// 	details.forEach(detail => {
// 		RO.observe(detail);
// 	});
// }
// /* Run it */
// setDetailsHeight('details');