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
		document.body.insertAdjacentHTML("afterbegin", `<div class="n-notify${option && option.indexOf("fixed") !== -1 ? " n-notify--fixed" : ""}">${content}</div>`);
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