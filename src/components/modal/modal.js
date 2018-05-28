var componentModal = (function (){

/* Modal – start */

/**
 * This is a function where type checking is disabled.
 * @suppress {misplacedTypeAnnotation}
 */
	var disableBodyScroll = (function () { // Thanks Thijs Huijssoon

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
	    var preventBodyScroll = function (event) {
	        if (!_element || typeof event.target.closest === 'undefined' || !event.target.closest(_selector)) {
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
	    var captureClientY = function (event) {
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
	    var preventOverscroll = function (event) {
	        // only respond to a single touch
		    if (event.targetTouches.length !== 1) {
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
			if ((_element.scrollHeight - _element.scrollTop <= _element.clientHeight) && clientY < 0) {
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
	    	if (typeof selector !== "undefined") {
		        _selector = selector;
		        _element = document.querySelector(selector);
	    	}
	
	        if (true === allow) {
	        	if (false !== _element) {
		            _element.addEventListener('touchstart', captureClientY, { passive: false });
		            _element.addEventListener('touchmove', preventOverscroll, { passive: false });
	        	}
	            document.body.addEventListener("touchmove", preventBodyScroll, { passive: false });
	        } else {
	        	if (false !== _element) {
		            _element.removeEventListener('touchstart', captureClientY, { passive: false });
		            _element.removeEventListener('touchmove', preventOverscroll, { passive: false });
		        }
	          document.body.removeEventListener("touchmove", preventBodyScroll, { passive: false });
	        }
	    };
	}());
	
	function adjustModal(e) {
		
		if (!iOSSafari || Math.abs(window.orientation) !== 90) { // Only for mobile Safari in landscape mode
			
			document.body.style.setProperty('--overlay-top', 0);
			document.body.style.setProperty('--overlay-bottom', 0);
			return;

		}
		
		var modal = q('.n-ovrl');
		if (typeof e !== 'undefined') { // On resize event (toolbars have appeared by tapping at the top or bottom area

			var offset_y = modal.getBoundingClientRect().y;
			var total_screen_height = modal.scrollHeight;
			var previous_overlay_top = parseInt(document.body.style.getPropertyValue('--overlay-top'));
			if ((previous_overlay_top + '') === 'NaN') {
				
				previous_overlay_top = 0;

			}
			document.body.style.setProperty('--overlay-top', (previous_overlay_top - offset_y) + 'px');
			document.body.style.setProperty('--overlay-bottom', (total_screen_height - window.innerHeight + offset_y) + 'px');
			
		} else {
		
			document.body.style.setProperty('--overlay-top', 0);
			document.body.style.setProperty('--overlay-bottom', 0);

			if (qa('.n-ovrl').length > 1) { // Multiple modals: offset has been set, no need to do anything
				
				return;
	
			}

			var screen_height = modal.scrollHeight;
			var actual_viewport = window.innerHeight;

			if (actual_viewport <= screen_height) { // modal is cropped, adjust its top/bottom
				
				if ((document.body.scrollHeight + document.body.getBoundingClientRect().y) === actual_viewport) {// page scrolled at the bottom

					document.body.style.setProperty('--overlay-bottom', 0);
					document.body.style.setProperty('--overlay-top', (screen_height - actual_viewport) + 'px');
	
				} else {
	
					document.body.style.setProperty('--overlay-top', 0);
					document.body.style.setProperty('--overlay-bottom', (screen_height - actual_viewport) + 'px');
				}
			
			}
		
			if (modal.getBoundingClientRect().y !== 0) { // A little off
	
				document.body.style.setProperty('--overlay-top', (parseInt(document.body.style.getPropertyValue('--overlay-top')) - modal.getBoundingClientRect().y) + 'px');
				document.body.style.setProperty('--overlay-bottom', (parseInt(document.body.style.getPropertyValue('--overlay-bottom')) + modal.getBoundingClientRect().y) + 'px');
				
			}
			
			if ((actual_viewport + parseInt(document.body.style.getPropertyValue('--overlay-top')) + parseInt(document.body.style.getPropertyValue('--overlay-bottom'))) > screen_height) { // Extra bug when scrolled near the bottom
				
				document.body.style.setProperty('--overlay-bottom', (screen_height - actual_viewport - parseInt(document.body.style.getPropertyValue('--overlay-top'))) + 'px');
				
			}
		
		}
		
	}

	function keyUpClose(e) {
		
	    if ((e || window.event).keyCode === 27) { // Esc
	
	        closeFullWindow();
	
	    }
	
	}

	function closeFullWindow() {
	
		var full_window = q('.n-ovrl:last-of-type');
	
		if (full_window) {
			
			var animation = full_window.querySelector('.content > div').getAttribute('data-anim'); // Custom animation?
			if (animation.length < 11) { // '', 'null' or 'undefined'?
				
				animation = '0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(0,-100%,0) }'; // 100% instead of 100vh, bc IE fails
				
			} else {
				
				full_window.style.cssText = 'animation-direction: reverse;';
	
			}
	
			animate(full_window, animation, .2, function (e) {
	
				disableBodyScroll(false, '.n-ovrl:last-of-type .content'); // Turn off and restore page scroll
				full_window.parentNode.removeChild(full_window);
				full_window_content = null;
		
				if (!q('.n-ovrl')) { // A single overlay is gone, leaving no overlays on the page
	
					window.removeEventListener('resize', adjustModal);
					window.removeEventListener('keydown', arrow_keys_handler); // To do: unglobal this and apply only to modal
					window.removeEventListener('keyup', keyUpClose);
					removeClass(q('html'), 'no-scroll');
	
					if (!q('.slider')) { // No sliders on the page to control with arrow keys
					
						window.removeEventListener('keydown', arrow_keys_handler, false);
						
					}
				
				} else {
				
					disableBodyScroll(true, '.n-ovrl:last-of-type .content');
					
				}
				
			   	if (previouslyFocused) {
	
				   	previouslyFocused.focus();
				   
				}
					
			});
			
		}
	    
	}

	function openFullWindow(el, animation) { // el is an HTML string

		previouslyFocused = document.activeElement;
		
		full_window_content = document.createElement('div');
		
		if (typeof el === 'string') {
	
			full_window_content.innerHTML = el;
	
		} else {
	
			full_window_content.appendChild(el);
	
		}
	
		full_window_content.setAttribute('data-anim', animation);
	
		var wrapper = document.createElement('div');
		addClass(wrapper, 'n-ovrl');
		wrapper.insertAdjacentHTML('beforeend', '<div class=content tabindex=0></div><div class=overlay-bg></div>');
		wrapper.firstChild.appendChild(full_window_content);
		full_window_content = wrapper;
	
	    full_window_content.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		full_window_content.querySelector('.overlay-bg').onclick = full_window_content.querySelector('.close').onclick = closeFullWindow;
		full_window_content.querySelector('.close').addEventListener("touchmove", function (e) { e.preventDefault();}, { passive: false });
		full_window_content.querySelector('.overlay-bg').addEventListener("touchmove", function (e) { e.preventDefault();}, { passive: false });
		window.addEventListener('keyup', keyUpClose);
		   
		q('body').appendChild(full_window_content);
	
	    full_window_content.querySelector('.content').focus();
	
		disableBodyScroll(true, '.n-ovrl:last-of-type .content'); // Turn on and block page scroll
		
		if (qa('.n-ovrl').length === 1) { // Sole (first) modal

			addClass(q('html'), 'no-scroll');
			window.addEventListener('resize', adjustModal);
			adjustModal();

		}
			
		if (full_window_content.querySelector('.full-screen')) {
	
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
	
			animate(full_window_content, typeof animation === 'string' ? animation : '0% { transform: translate3d(0,-100%,0) } 100% { transform: translate3d(0,0,0) }', .2);
	
		}
		
	    return false;
		
	}

	function modalWindow(e) {

    // Modal window of an external file content

	    var el = e.target;
	
	    var link = closest(el, '.modal').href;
	    var animation = closest(el, '.modal').getAttribute('data-anim');
	
	    if (!php_support && external.test(link) || !(new XMLHttpRequest().upload)) { // No PHP or XHR?
	
	        window.open(link, '_blank');
	        return false;
	
	    }
	
	    var request = new XMLHttpRequest();
	    request.open('GET', external.test(link) ? (scripts_location + 'request.php?targetformurl=' + link.split('#')[0]) : link.split('#')[0], true);
	
	    request.onload = function() {
	
	        if (request.status >= 200 && request.status < 400) {
	            // Success
	            if (!request.responseText) { // No PHP?
	
	                closeFullWindow();
	                window.open(link, 'Modal');
	                return false;
	
	            }
	            var container = (typeof link.split('#')[1] != 'undefined') ? ('#' + link.split('#')[1]) : 0;
	
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
				transferClass(closest(el, '.modal'), q('.n-ovrl'), 'limited');
	
	        } else {
	            // Error
	            closeFullWindow();
	
	        }
	
	    };
	
	    request.onerror = function() {
	        // Error
	        closeFullWindow();
	
	    };
	
	    request.send();
	
	    return false;
	
	}

	var init = function(host) {
		
	// Modal window: open a link's target inside it
	
		forEach(host.querySelectorAll('a.modal[href]:not([data-ready])'), function(el) {
		
			if (el.href !== (location.href.split('#')[0] + '#')) { // Is it an empty anchor?
				
			    el.onclick = modalWindow;
		
		    }
		    
		    if (!el.getAttribute('rel')) {
			    
			    el.setAttribute('rel', 'prefetch');
		
		    }
		    
		    makeReady(el);
		
		});
		
	};
	registerComponent('modal', init);

	return { closeFullWindow: closeFullWindow, openFullWindow: openFullWindow };

/* Modal – end */

})();

// To do: √ adjust multiple modals – if a prior modal exists, don't re-adjust, use the current offsets
// To do: √ When second modal triggers a resize (toolbars appear), it should call adjustModal()
// To do: √ allow scrolling in modal content, don't let a slider inside the modal block modal's vertical swipe scroll 
// To do: disable page scroll by arrow keys
// To do: √ after closing the second modal, page is scrollable
