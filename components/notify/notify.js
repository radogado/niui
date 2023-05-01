// Component Notification bar – start
(function() {
	function notifyClose(el) {
		if (!!el) {
			el.parentNode.removeChild(el);
		}
	}

	function notifyCloseEvent() {
		if (document.querySelector(".n-notify")) {
			document.querySelector(".n-notify").onclick = (e) => {
				notifyClose(e.target);
			};
		}
	}

	function notify(content, option) {
		document.body.insertAdjacentHTML("afterbegin", `<button class="n-notify${option && option.indexOf("fixed") !== -1 ? " n-notify--fixed" : ""}">${content}</button>`);
		document.querySelector(".n-notify").focus();
		notifyCloseEvent();
		if (option && option.indexOf("timeout") !== -1) {
			setTimeout(() => {
				notifyClose(document.querySelector(".n-notify"));
			}, 2000);
		}
	}
	let init = (host) => {
		/* Tooltip */
		host.querySelectorAll(".n-notify:not([data-ready])").forEach((el, i) => {
			notifyCloseEvent();
			el.dataset.ready = true;
		});
	};
	nui.registerComponent("notify", init, {
		'name': 'notify',
		'code': notify
	});
})();
// Component Notification bar – end