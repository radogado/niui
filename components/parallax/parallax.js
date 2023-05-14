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