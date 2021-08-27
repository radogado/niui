/**
 * This is a function where type checking is disabled.
 * @suppress {misplacedTypeAnnotation}
 */
window.nuiDisableBodyScroll = (function () {
	// Thanks Thijs Huijssoon https://gist.github.com/thuijssoon

	/**
	 * Private variables
	 */
	var _selector = false,
		_element = false,
		_clientY;

	/**
	 * Prevent default unless within _selector
	 *
	 * @param  event object event
	 * @return void
	 */
	var preventBodyScroll = (event) => {
		if (!_element || !event.target.closest || !_selector.contains(event.target)) {
			event.preventDefault();
		}
	};

	/**
	 * Cache the clientY co-ordinates for
	 * comparison
	 *
	 * @param  event object event
	 * @return void
	 */
	var captureClientY = (event) => {
		// only respond to a single touch
		if (event.targetTouches.length === 1) {
			_clientY = event.targetTouches[0].clientY;
		}
	};

	/**
	 * Detect whether the element is at the top
	 * or the bottom of their scroll and prevent
	 * the user from scrolling beyond
	 *
	 * @param  event object event
	 * @return void
	 */
	var preventOverscroll = (event) => {
		// only respond to a single touch
		if (event.targetTouches.length !== 1 || event.target.closest(".n-slider--nav")) {
			// also if trying to swipe slider/lightbox nav
			return;
		}

		var clientY = event.targetTouches[0].clientY - _clientY;

		// The element at the top of its scroll,
		// and the user scrolls down
		if (_element.scrollTop === 0 && clientY > 0) {
			event.preventDefault();
		}

		// The element at the bottom of its scroll,
		// and the user scrolls up
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
		if (_element.scrollHeight - _element.scrollTop <= _element.clientHeight && clientY < 0) {
			event.preventDefault();
		}
	};

	/**
	 * Disable body scroll. Scrolling with the selector is
	 * allowed if a selector is provided.
	 *
	 * @param  boolean allow
	 * @param  string selector Selector to element to change scroll permission
	 * @return void
	 */
	return function (allow, selector) {
		if (!!selector) {
			_selector = selector;
			_element = selector;
		}

		if (true === allow) {
			if (false !== _element) {
				_element.addEventListener("touchstart", captureClientY, { passive: false });
				_element.addEventListener("touchmove", preventOverscroll, { passive: false });
			}
			document.body.addEventListener("touchmove", preventBodyScroll, { passive: false });
		} else {
			if (false !== _element) {
				_element.removeEventListener("touchstart", captureClientY, { passive: false });
				_element.removeEventListener("touchmove", preventOverscroll, { passive: false });
			}
			document.body.removeEventListener("touchmove", preventBodyScroll, { passive: false });
		}
	};
})();
