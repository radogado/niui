// Component Fold – start

(function (){
    
/* Fold – start */

	function toggleAccordion(e) {
	
	    stopEvent(e);
	    var el = closest(e.target, '.n-fold');
	    var content = el.querySelector('.content');
	
		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.setProperty('--max-height', content.scrollHeight + 'px');
	
		var content_height = content.style.getPropertyValue('--start-height') || 0;
		
		// Animation, not CSS, because of nested accordions
		
		if (hasClass(el, 'horizontal')) {
			
			toggleAttribute(el, aria_expanded);
			
		} else {
		
			if (el.hasAttribute(aria_expanded)) {
		
				animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: ' + content_height + '; }', .2, function () {
					
					toggleAttribute(el, aria_expanded);
					
				});
				
			} else {
				
				toggleAttribute(el, aria_expanded);
				animate(content, '0% { max-height: ' + content_height + '; } 100% { max-height: ' + content.scrollHeight + 'px; }');
				
			}
		
		}
	
	    return false;
	
	}
	
	// Close all Fold elements when clicking/tapping outside of them
	
	function closeFoldClickOutside(e) {
		
		var el = e.target;
	
		if (!closest(el, '.n-fold') && !closest(el, '.n-tool')) { // Clicking/tapping outside of a fold/tooltip element...
			
			forEach('.n-fold.mobile, .n-tool', function (el) { // ... closes all burger nav menus and tooltips
				
				el.removeAttribute(aria_expanded);
				
			});
			
		}
		
		// Focus on clicked slider
		
	/*
		if (q('.n-sldr.active')) {
			
			removeClass(q('.n-sldr.active'), 'active')
			
		}
		
		if (closest(el, '.slider')) {
			
			addClass(closest(el, '.n-sldr'), 'active');
			
		}
	*/
	
		if (closest(el, '.slider')) {
	
			current_slider = closest(el, '.slider');
		
		}
		
	}
	
	function initFold(host) {
		
		forEach(host.querySelectorAll('.n-fold:not([data-ready]) > .label'), function(el) {
	
		    el.onclick = toggleAccordion;
			el.setAttribute('tabindex', 0);
			el.onkeyup = function (e) {
		
				if (e.key === 'Enter') {
					
					toggleAccordion(e);
		
				}
				
			};
		
		    el = el.parentNode;
			var content = el.querySelector('.content');
			
			if (hasClass(el, 'horizontal')) {
				
				el.setAttribute('data-init', true);
				content.style.setProperty('--width', content.scrollWidth + 'px');
				content.style.height = 'auto';
				el.removeAttribute('data-init');
				setTimeout(function () { content.style.transition = 'width .2s ease-in-out'; }, 100);
				
			}
		
			content.style.setProperty('--max-height', content.scrollHeight + 'px');
		
		    if (el.querySelector('input.trigger')) { // Remove CSS-only triggers
		
		        el.querySelector('input.trigger').outerHTML = '';
		
		    }
		
		    if (!hasClass(el, 'mobile')) { // Keep the accordion content clickable
			    
			    content.onclick = function(e) {
		
			        stopEvent(e);
			
			    };
		
		    }
		    
		    makeReady(el);
		    
		});
		
	}
	
	window.addEventListener('click', function (e) { // Close all Fold elements when clicking outside of them
		
		closeFoldClickOutside(e);
		
	});
	
	window.addEventListener('touchend', function (e) { // Close all Fold elements when clicking outside of them
		
		closeFoldClickOutside(e);
		
	});
		
	window.addEventListener('scroll', function() {  // Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
		
		if (q('.fixed-mobile .n-fold.mobile[aria-expanded]')) {
			
			q('.fixed-mobile .n-fold.mobile[aria-expanded]').removeAttribute(aria_expanded);
		
		}
		
	});

/* Fold – end */

	registerComponent('fold', initFold);

})();

// Component Fold – end
