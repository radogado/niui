// Component Fold – start

(function (){
    
/* Fold – start */

	function toggleAccordion(e) {
	
	    stopEvent(e);
	    var el = e.target.closest('.n-fold');
	    var content = el.querySelector('.n-fold--content');
	
		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.setProperty('--max-height', content.scrollHeight + 'px');
	
		var content_height = content.style.getPropertyValue('--start-height') || 0;
		
		// Animation, not CSS, because of nested accordions
		
		if (hasClass(el, 'n-fold--horizontal')) {
			
			toggleAttribute(el, aria_expanded);
			
		} else {
		
			if (el.hasAttribute(aria_expanded)) {
		
				animate(content, `0% { max-height: ${content.scrollHeight}px; } 100% { max-height: ${content_height}; }`, .2, () => {
					
					toggleAttribute(el, aria_expanded);
					
				});
				
			} else {
				
				toggleAttribute(el, aria_expanded);
				animate(content, `0% { max-height: ${content_height}; } 100% { max-height: ${content.scrollHeight}px; }`);
				
			}
		
		}
	
	    return false;
	
	}
	
	// Close all Fold elements when clicking/tapping outside of them
	
	function closeFoldClickOutside(e) {
		
		var el = e.target;
	
		if (!el.closest('.n-fold') && !el.closest('.n-tool')) { // Clicking/tapping outside of a fold/tooltip element...
			
			qa('.n-fold.n-fold--mobile, .n-tool').forEach((el) => { // ... closes all n-burger nav menus and tooltips
				
				el.removeAttribute(aria_expanded);
				
			});
			
		}
		
		// Focus on clicked slider
		
		if (el.closest('.n-slider')) {
	
			current_slider = el.closest('.n-slider');
		
		}
		
	}
	
	function initFold(host) {
		
		host.querySelectorAll('.n-fold:not([data-ready]) > .n-fold--label').forEach((el) => {
	
		    el.onclick = toggleAccordion;
			el.setAttribute('tabindex', 0);
			el.onkeyup = (e) => {
		
				if (e.key === 'Enter') {
					
					toggleAccordion(e);
		
				}
				
			};
		
		    el = el.parentNode;
			var content = el.querySelector('.n-fold--content');
			
			if (hasClass(el, 'n-fold--horizontal')) {
				
				el.setAttribute('data-init', true);
				content.style.setProperty('--width', content.scrollWidth + 'px');
				content.style.height = 'auto';
				el.removeAttribute('data-init');
				setTimeout(() => { content.style.transition = 'width .2s ease-in-out'; }, 100);
				
			}
		
			content.style.setProperty('--max-height', content.scrollHeight + 'px');
		
		    if (el.querySelector('input.n-trigger')) { // Remove CSS-only triggers
		
		        el.querySelector('input.n-trigger').outerHTML = '';
		
		    }
		
		    if (!hasClass(el, 'n-fold--mobile')) { // Keep the accordion content clickable
			    
			    content.onclick = (e) => {
		
			        stopEvent(e);
			
			    };
		
		    }
		    
		    makeReady(el);
		    
		});
		
	}
	
	window.addEventListener('click', closeFoldClickOutside); // Close all Fold elements when clicking outside of them
	
	window.addEventListener('touchend', closeFoldClickOutside); // Close all Fold elements when clicking outside of them
		
	window.addEventListener('scroll', () => {  // Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
		
		let expanded_nav = q('.n-fixed-mobile .n-fold.n-fold--mobile[aria-expanded]');
		if (expanded_nav) {
			
			expanded_nav.removeAttribute(aria_expanded);
		
		}
		
	});

/* Fold – end */

	registerComponent('fold', initFold);

})();

// Component Fold – end
