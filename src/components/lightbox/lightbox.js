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
