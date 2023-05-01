// Component Button – start
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
		}
		document.querySelectorAll('.n-btn--ripple:not([data-ready])').forEach(el => {
			el.addEventListener('pointerdown', ripple);
			el.addEventListener('keydown', ripple);
			el.dataset.ready = true;
		});
	};
	nui.registerComponent("button", init);
})();
// Component Button – end