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