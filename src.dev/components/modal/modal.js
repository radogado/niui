var componentModal = (function () {
	/* Modal – start */
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

	function closeFullWindow() {
		let full_window = qa(".n-ovrl");
		full_window = full_window[full_window.length - 1];
		if (full_window) {
			window.scrollTo(previousScrollX, previousScrollY);
			let direction_option = 'normal';
			var animation = full_window.querySelector(".n-ovrl__content > div").dataset.anim; // Custom animation?
			if (animation.length < 11) {				// '', 'null' or 'undefined'?
				animation = '[{ "transform": "translate3d(0,0,0)" }, { "transform": "translate3d(0,-100%,0)" }]';
			} else {
				direction_option = 'reverse';
			}

			full_window.animate(JSON.parse(animation), { duration: 200, direction: direction_option }).onfinish = () => {
				nuiDisableBodyScroll(false, full_window.querySelector(".n-ovrl__content")); // Turn off and restore page scroll
				full_window.parentNode.removeChild(full_window);
				full_window_content = null;
				if (!q(".n-ovrl")) {
					// A single overlay is gone, leaving no overlays on the page
					window.removeEventListener("resize", adjustModal);
					window.removeEventListener("keydown", arrow_keys_handler); // To do: unglobal this and apply only to modal
					window.removeEventListener("keyup", keyUpClose);
					removeClass(q("html"), "no-scroll");
				} else {
					nuiDisableBodyScroll(true, full_window.querySelector(".n-ovrl__content"));
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
		addClass(wrapper, "n-ovrl");
		wrapper.insertAdjacentHTML("beforeend", "<div class=n-ovrl__content tabindex=0></div><div class=n-ovrl__bg></div>");
		wrapper.firstChild.appendChild(full_window_content);
		full_window_content = wrapper;
		full_window_content.insertAdjacentHTML("afterbegin", `<button class=n-ovrl__close> ← ${document.title}</button>`);
		full_window_content.querySelector(".n-ovrl__bg").onclick = full_window_content.querySelector(".n-ovrl__close").onclick = closeFullWindow;
		full_window_content.querySelector(".n-ovrl__close").addEventListener("touchmove",
			(e) => {
				e.preventDefault();
			}, { passive: false });
		full_window_content.querySelector(".n-ovrl__bg").addEventListener("touchmove",
			(e) => {
				e.preventDefault();
			}, { passive: false });
		window.addEventListener("keyup", keyUpClose);
		document.body.appendChild(full_window_content);
		let full_window_container = full_window_content.querySelector(".n-ovrl__content");
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
			full_window_content.animate(typeof animation === "string" ? JSON.parse(animation) : [{ transform: "translate3d(0,-100%,0)" }, { transform: "translate3d(0,0,0)" }], 200);
		}
		return false;
	}

	function modalWindow(e) {
		// Modal window of external file content
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
				transferClass(el.closest(".n-modal"), q(".n-ovrl"), "n-modal--imited");
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