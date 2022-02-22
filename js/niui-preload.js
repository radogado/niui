(() => {
	// Height adjustment during DOM population
	let observer = new MutationObserver((mutations) => {
		for (let mutation of mutations) {
			for (let el of mutation.addedNodes) {
				// We're iterating through _all_ the elements as the parser parses them,
				// deciding if they're the one we're looking for.
				if (!!el.matches && el.matches(".n-adjust-height")) {
					el.style.removeProperty("--adjust-height");
					let style = getComputedStyle(el);
					let line_height = parseFloat(style.lineHeight);
					let adjust = line_height - (parseFloat(style.height) % line_height);
					if (adjust !== line_height) {
						el.style.setProperty("--adjust-height", adjust);
					}
					// We found our element, we're done:
					observer.disconnect();
				}
			}
		}
	});
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});
})();