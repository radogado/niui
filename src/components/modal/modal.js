var componentModal = (function (){

/* Modal – start */

	function getWindowInnerHeight() { // Fix iOS Safari's fake viewport height
		
		console.log('updating inner height');
		q('.n-ovrl').style.setProperty('--window-inner-height', window.innerHeight + 'px');
		var offset_top = document.body.scrollHeight - window.innerHeight;
		if (offset_top > 60) {
			
			offset_top = 0;

		}
		q('.n-ovrl').style.setProperty('--top', offset_top + 'px');

		if (q('.n-ovrl').offsetTop > 25) {
			
			q('.n-ovrl').setAttribute('data-offset-top', true);

		} else {
			
			q('.n-ovrl').removeAttribute('data-offset-top');

		}

	}

	function closeFullWindow() {
	
		var full_window = q('.n-ovrl:last-of-type') || q('.n-ovrl');
	
		if (full_window) {
			
		   	q('html').style.pointerEvents = 'none';
	
			if (qa('.n-ovrl').length === 1) { // A single overlay
				
			    removeClass(q('html'), 'nooverflow');
		    	q('body').scrollTop = q('html').scrollTop = -1 * previousScrollOffset;
				
			}
			var animation = full_window.querySelector('.content > div').getAttribute('data-anim'); // Custom animation?
	
			if (animation === 'null' || animation === 'undefined') {
				
				animation = '0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(0,-100vh,0) }';
				
			} else {
				
	// 			full_window.style.animationDirection = 'reverse'; // Not working with Closure Compiler, hence:
				full_window.style.cssText = 'animation-direction: reverse;';
	
			}
	
			animate(full_window, animation, .2, function (e) {
	
	//			if (true/* full_window_content */) { // Remove disposable generated content. To do: In which case it's not dynamic?
		
					 // If lightbox/slider, crashes iOS Safari. not crashing with an empty div
					full_window.parentNode.removeChild(full_window);
					full_window_content = null;
		
						
	//			} else { // or keep previously existing content
		
	//				full_window.parentNode.replaceChild(full_window.querySelector('.content > *'), full_window);
				
	//			}
		
				if (qa('.n-ovrl').length === 0) { // A single overlay
	
					window.removeEventListener('keydown', arrow_keys_handler);
					window.removeEventListener('keyup', keyUpClose);
					if (!q('.slider')) { // No sliders on the page to control with arrow keys
					
		// 				document.onkeyup = function () {};
						window.removeEventListener('keydown', arrow_keys_handler, false);
						
					}
				
				}
				
			   	q('html').style.pointerEvents = 'initial';
			   	removeClass(q('html'), 'nooverflow');
			   	
			   	if (previouslyFocused) {
	
				   	previouslyFocused.focus();
				   
				}
					
				window.removeEventListener('resize', getWindowInnerHeight);
	
			});
			
		}
	    
	}

	function openFullWindow(el, animation) { // el is an HTML string

		previouslyFocused = document.activeElement;
		
	   	q('html').style.pointerEvents = 'none';
		var offset_top = q('html').getBoundingClientRect().top;
		previousScrollOffset = offset_top; // Remember the page position.
	
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
	
	/*     if (!hasClass(el, 'headless')) { */
		    
		    full_window_content.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
			full_window_content.querySelector('.overlay-bg').onclick = full_window_content.querySelector('.close').onclick = closeFullWindow;
			window.addEventListener('keyup', keyUpClose);
		   
	/*
		} else {
			
			addClass(full_window_content, 'headless');
			
		}
	*/
	
		q('body').appendChild(full_window_content);
	//	initComponents(full_window_content.querySelector('.content')); // replaced by the Mutation Observer
	
	    full_window_content.querySelector('.content').focus();
	
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
		
	    	q('html').style.pointerEvents = 'initial';
	
		} else {
	
			animate(full_window_content, typeof animation === 'string' ? animation : '0% { transform: translate3d(0,-100vh,0) } 100% { transform: translate3d(0,0,0) }', .2, function () { 
				
				addClass(q('html'), 'nooverflow');
		    	q('body').scrollTop = q('html').scrollTop = -1 * previousScrollOffset;
		    	q('html').style.pointerEvents = 'initial';
				getWindowInnerHeight();
				window.addEventListener('resize', getWindowInnerHeight);
			
			});
	
		}
		
	    return false;
		
	}

	function modalWindow(e) {

    // Modal window of an external file

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
