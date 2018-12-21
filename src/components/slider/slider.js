// Component Slider – start

var componentSlider = (function (){
    
/* natUIve Slider */

	var last_slide_time = 14045017000;
	var slide_duration = .5;
	
	function sliderElement(e) { // Get the active slider instance
		
		var closest_slider_wrap = document.activeElement.closest('.n-slider--wrap');
		
		if (closest_slider_wrap && closest_slider_wrap === focusWithin('.n-slider--wrap')) {
	
			return focusWithin('.n-slider--wrap').querySelector('.n-slider');
	
		}
	
	    var el = e.target;
	
	    if (hasClass(el, 'n-slider--wrap')) {
	
	        return el.querySelector('.n-slider');
	
	    } else {
	
	        var container = el.closest('.n-slider--wrap');
	        return container && container.querySelector('.n-slider');
	
	    }
	
	}
	
	function getSliderNav(slider_wrap) {
	
		// Select either a child n-slider--nav or the one specified by the slider id, if it exists
		var slider = slider_wrap.querySelector('.n-slider');
		var slider_nav;
	
		if (slider.id && (slider_nav = q(`.n-slider--nav[data-for=${slider.id}]`))) { // Detached nav
	
			return slider_nav;
	
		} else {
	
			return slider_wrap.querySelectorAll('.n-slider--nav')[slider_wrap.querySelectorAll('.n-slider--nav').length-1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .n-pad direct child, taken as the last one of all.
	
		}
	
	}
	
	/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */
	
	function swipeEvents(el) {
	
	    var startX, startY;
	
	    el.addEventListener('touchstart', touchStart);
	
	    function touchStart(e) {
	
	        var touches = e.touches;
	        if (touches && touches.length) {
	
	            startX = touches[0].pageX;
	            startY = touches[0].pageY;
	            el.addEventListener('touchmove', touchMove);
	
	        }
	
	    }
	
	    function touchMove(e) {
		    
	        var touches = e.touches;
	
	        if (touches && touches.length && !(hasClass(el, 'n-slider--vertical') && !el.closest('.n-ovrl'))) { // Don't slide vertically if not full window
	
	            var deltaX = startX - touches[0].pageX;
	            var deltaY = startY - touches[0].pageY;
	            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;				
				var overlay_content = el.closest('.n-ovrl') ? el.closest('.n-ovrl').querySelector('.n-ovrl--content') : null;

				// Allow vertical page scroll by swiping over the slider. Also when parent modal is scrollable vertically
	            if (((hasClass(el, 'n-slider--vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.n-ovrl .n-slider--wrap'))
	            	|| (overlay_content && (overlay_content.scrollHeight > overlay_content.offsetHeight) && (Math.abs(deltaX) < Math.abs(deltaY)))
	            	|| (e.target.nodeName === 'INPUT' && e.target.type === 'range')
	            	|| hasClass(e.target.parentNode, 'n-slider--nav') || hasClass(e.target, 'n-slider--nav')
					) {
	
	                return;
	
	            }
	
	            e.preventDefault();
	
	            if (Math.abs(delta) > 50) {
	
	                var event = new Event((delta >= 50) ? 'swipeLeft' : 'swipeRight');
	                el.dispatchEvent(event);
	                el.removeEventListener('touchmove', touchMove);
	
	            }
	            
	        }
	
	    }
	
	}
	
	function initScroll(e, delta) { // Scroll happens
	
	    var timeNow = new Date().getTime();
	
	    // Cancel scroll if currently animating or within quiet period – don't slide again automatically after a slide
	    if ((timeNow - last_slide_time) < slide_duration * 2000 /* || hasClass(q('html'), 'sliding_now') */) {
	
	        stopEvent(e);
			return;
	
	    }
	
		last_slide_time = timeNow;
	
	    slide(sliderElement(e), delta < 0 ? 'right' : 'left');
	
	}
	
	function mouseWheelHandler(e) {
	
		var el = e.target;
		
		if (el.closest('.n-slider--nav')) { // Allow scrolling the nav bar
						
			return;
	
		}
	
	    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
	    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
	/* To do: stop generating events while sliding */	
	    if (/* !hasClass(q('html'), 'sliding_now') && */ Math.abs(hasClass(sliderElement(e), 'n-slider--vertical') ? deltaY : deltaX) > 50) {
	
	        e.preventDefault();
	        initScroll(e, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);
	
		}
	    
	}
	
	function mouseEvents(el, toggle) {
	
	    if (!('onwheel' in window) || (hasClass(el, 'n-slider--vertical') && !el.closest('.n-ovrl'))) { // Check for mouse wheel and don't slide vertically if not full window
		    
		    return;
		   
		}
	
		var slider_wrap = el.closest('.n-slider--wrap');
	
	    if (toggle === 'off') {

	        slider_wrap.removeEventListener('wheel', mouseWheelHandler);
	
	    } else {
	
	        slider_wrap.addEventListener('wheel', mouseWheelHandler);
/*
	        if (getSliderNav(slider_wrap)) {
	
		        getSliderNav(slider_wrap).addEventListener('wheel', function (e) {
		
			        // Scroll as usual instead of sliding
		
		        });
	        
	        }
*/
	
	    }
	
	}
	
	function endSlide(slider, index, old_index) {
	
	    if (hasClass(slider, 'n-lightbox')) {
			
			componentLightbox.populateLightbox(slider, index);

	    }
	
		var slider_wrap = slider.closest('.n-slider--wrap');
	
		if (getSliderNav(slider_wrap)) { // Multiple slides? // To do: get the proper slider nav, if it's detached
	
			getSliderNav(slider_wrap).children[index].setAttribute('data-active', true);
		
		}
	
		slider.children[index].dataset.active = true; // Can't use 'sliding', because Closure Compiler obfuscates it
	
	    if (!hasClass(slider, 'n-slider--vertical')) {
		    
		    slider.style.marginLeft = `${-100*index}%`;
		   
		}
	
		slider.style.pointerEvents = slider.style.height = '';
	
	    window.addEventListener('keyup', sliderKeyboard);
	    setTimeout(() => {
	
	// 	    removeClass(q('html'), 'sliding_now');
		    mouseEvents(slider);
	
		    // Make this slider active
		
			if (slider.children[index].id) { // Scroll page to slide hash. To do: restore focus
		
				scrollToAnimated(getCumulativeOffset(slider.children[index]).y, .2, () => {
					
					var focused = document.activeElement;
					window.location.hash = slider.children[index].id;
					focused.focus();
		
				});
				
			} else { // If previous slide id is in URI, remove URI hash
				
				if (typeof old_index !== 'undefined' && location.hash === '#' + slider.children[old_index].id) {
					
					removeHash();
					
				}
				
			}
	
		}, slide_duration/2);
		
	}
	
	function slide(el, method, index_number) {
	
	/*
		if (hasClass(q('html'), 'sliding_now')) {
			
			return;
		
		}
	*/

// 2 directions: horizontal/vertical
// 3 animations: slide/fade/fade overlap
	
		var slider_wrap = el.closest('.n-slider--wrap');
	
	    var slider = slider_wrap.querySelector('.n-slider');
	
	    if (slider.children.length < 2) {
	
			endSlide(slider, 0);
	        return slider;
	
	    }
	    
	
	    mouseEvents(slider_wrap, 'off');
	    slider.style.pointerEvents = 'none'; // Speed up animation
	    mouseEvents(el, 'off');
	    window.removeEventListener('keyup', sliderKeyboard);
	
		clearTimeout(slider.getAttribute('data-timeout'));
		
		var index;
		var old_index;
		var slider_nav = getSliderNav(slider_wrap);
		var active_nav_item = slider_nav.querySelector('a[data-active]');
		if (!active_nav_item) {
	
			return;
	
		}
		index = old_index = thisIndex(active_nav_item);
	
	    if (method === 'index') {
	
			if (typeof index_number === 'undefined' || index_number === index || !slider.querySelector('[data-active]')) { /* Don't slide to current slide */
				
				endSlide(slider, index_number);
				return;
	
			}
	        index = index_number;
	
	    }
	
	    if (method === 'right') {
	
	        if (index === (slider.children.length-1)) {
	
	            index = 0;
	
	        } else {
		        
		        index++; 
		        
	        }
	        
	    }
	
	    if (method === 'left') {
	
	        if (index === 0) {
	
	            index = slider.children.length-1;
	
	        } else {
		        
		        index--;
		        
	        }
	
	    }

	    var offset_sign = -1; // Slider offset depending on direction. -1 for LTR or 1 for RTL. Vertical is always '-'
	
		var computed_height;
		var computed_height_old;
	
		var target_slide = slider.children[index];
	
		var height_change = '';
		var height_current = '';
		
		if (hasClass(slider, 'n-slider--auto-height')) {
			
			height_change =	`height: ${target_slide.scrollHeight}px`;
			height_current = `height: ${slider.scrollHeight}px`;
			
		}
		
		var original_slider_height = slider.scrollHeight;
		target_slide.dataset.active = true;

		var next_slide_image = target_slide.querySelector('img');
		if (hasClass(slider, 'n-slider--vertical')) {
			
			if (hasClass(slider, 'n-lightbox--inline') && !hasClass(slider, 'n-slider--overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'n-aspect')) { // Inline lightbox only. To do: integrate n-aspect with n-slider--wrap
			
				let next_image_width = next_slide_image.getAttribute('width') ? next_slide_image.getAttribute('width') * 1 : next_slide_image.naturalWidth; // To do: set data-width, data-height from the anochor link
				let next_image_height = next_slide_image.getAttribute('height') ? next_slide_image.getAttribute('height') * 1 : next_slide_image.naturalHeight;
				
				var height_change_number = slider.clientWidth * next_image_height / next_image_width;
				if (slider.clientWidth >= next_image_width) {
					
					height_change_number = next_image_height;
					
				}
				height_change =	`height: ${height_change_number}px`;
	
			} else { // Vertical, not a lightbox
				
				height_change =	`height: ${target_slide.scrollHeight}px`;

			}
		
			height_current = `height: ${original_slider_height}px`;
			target_slide.style.display = 'block'; // Temporarily display the target slide to get its height
			computed_height = getComputedStyle(target_slide).height;
			target_slide.setAttribute('style', target_slide.getAttribute('style').replace('display: block;', '')); // Keep any other inline styles
			computed_height_old = getComputedStyle(slider.children[old_index]).height;
	
		} else {
		
			computed_height = getComputedStyle(slider).height;
			if (slider.getAttribute('dir') === 'rtl') {
				
				offset_sign = 1;
		
			}
			
		}
	
		slider.style.height = computed_height;
	
		slider_wrap.dataset.active = true; // The correct position, after the above calculations
	
		if (slider_nav.querySelector('[data-active]')) {
	
		    slider_nav.querySelector('[data-active]').removeAttribute('data-active');
	
	    }
	
		var duration = slider.getAttribute('data-duration') || slide_duration;
	
		var translate_from, translate_to;
		
	    if (hasClass(slider, 'n-slider--vertical')) {
			
			computed_height = parseInt(computed_height, 10);
			computed_height_old = parseInt(computed_height_old, 10);

			var next_height =  (!hasClass(slider, 'n-slider--overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'n-aspect')) ? (`-${height_change_number}px`) : '-100%';
		    translate_from = `translate3d(0,${index<old_index ? ('-' + computed_height + 'px') : 0},0)`;
			
		    var difference = Math.abs(computed_height - computed_height_old);

		    if (computed_height > computed_height_old) {
			    
			    difference = Math.max(computed_height, computed_height_old) - difference;
			    
		    } else {
			    
			    difference = Math.min(computed_height, computed_height_old) + difference;
			    
		    }
		    translate_to = `translate3d(0,${index<old_index ? '0' : ('-' + original_slider_height + 'px')},0)`;
		    slider.children[old_index].style.transition = `opacity ${duration/2}s linear`;
		    slider.children[old_index].style.opacity = 0;
		
		} else {
			
			if (slider.getAttribute('data-peek')) {
			
			    translate_from = 'translate3d(0,0,0)';
			    translate_to = `translate3d(${offset_sign * (index - old_index)}00%,0,0)`;
		    
		    } else {
	
				slider.style.margin = 0;
			    translate_from = `translate3d(${offset_sign * ((index<old_index) ? 1 : 0)}00%,0,0)`;
			    translate_to = `translate3d(${offset_sign * ((index<old_index) ? 0 : 1)}00%,0,0)`;
			    
		    }
			
		}
	
		function slideEndHandler(e) { // On slide end
		
// 			slider.children[index].style.cssText = slider.children[old_index].style.cssText = '';
			
			delete slider_wrap.dataset.active;
			delete slider.children[old_index].dataset.active;

			[slider.children[index], slider.children[old_index]].forEach((el) => {
				
				el.style.transition = el.style.opacity = el.style.height = el.style.margin = '';
				
			});

			current_slider = slider;
			endSlide(slider, index, old_index);
	
	    }
		    
		if (hasClass(slider, 'n-slider--fade-overlap')) { // fade slides in/out directly. Overlap new and old slides.
			
		    slider.children[index].style.opacity = '0';
			slider.children[index > old_index ? index : old_index].style.marginLeft = '-100%';
		    slider.children[old_index].style.opacity = '1';

			// Animate both simultaneously

			animate(slider, `0% { ${height_current}; } 100% { ${height_change}; }`, duration);
			animate(slider.children[index], '0% { opacity: 0; } 100% { opacity: 1; }', duration, slideEndHandler);
			animate(slider.children[old_index], '0% { opacity: 1; } 100% { opacity: 0; }', duration);
			
		} else {
			
			var animation_code;
	
			if (hasClass(slider, 'n-slider--fade')) { // fade out to a color and fade in to the new slide
		
				animation_code = `0% { opacity: 1; transform: ${translate_from}; ${height_current}} 49% { transform: ${translate_from} } 51% { opacity: 0; transform: ${translate_to} } 100% { ${height_change}; opacity: 1; transform: ${translate_to} }`;
			
			} else {

				animation_code = `0% { transform: ${translate_from}; ${height_current}; } 100% { ${height_change}; transform: ${translate_to}; }`;

			}
			
			animate(slider, animation_code, duration, slideEndHandler);
			
		}
	
	}
	
	function shouldNotSlideVertically(el) {
		
		if (q('.n-ovrl')) { 
			
			return false; 
		
		}
		return !hasClass(el, 'n-slider--vertical') || window.innerHeight < bodyElement.scrollHeight;
		
	}
	
	function sliderKeyboard(e) { // e.target can be either body or a slider, choose accordingly
	
	    if (typeof e === 'undefined' || 
	//     	hasClass(q('html'), 'sliding_now') || 
	    	q('.n-slider--wrap[data-active]') || 
	    	(q('.n-ovrl') && !q('.n-ovrl .n-slider--wrap')) // There is an overlay open and it doesn't have a slider in it
			) {
	
	        return;
	
	    }
	
		var el = e.target;

		var scrollable = el; // Don't slide when current element is scrollable. Check all parent nodes for scrollability – cheak each parent until body.
		while (scrollable.nodeName !== 'BODY') {
			
			if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) { 
				
				e.stopPropagation();
				return;
		
			}
	
			scrollable = scrollable.parentElement;
	
		}
			
		if (!el.closest('.n-slider--wrap') && q('.n-slider--wrap')) { // Focused element is outside of any slider
			
	// 		current_slider = q('.n-slider--wrap').querySelector('.slider');
		} else {
			
			current_slider = el.closest('.n-slider--wrap') ? el.closest('.n-slider--wrap').querySelector('.n-slider') : null;
	
		}
	
		if (focusWithin('.n-slider')) {
			
			current_slider = focusWithin('.n-slider');
			
		}
	
		if 	(el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && 
	// 		(document.activeElement === el ? (el.scrollWidth <= el.clientWidth) : true) &&
	// 		(!closestElement(document.activeElement, '.n-slider--wrap.active') && (el.scrollWidth <= el.clientWidth) ) &&
			(el = q('.n-ovrl .n-slider') || current_slider || q('.n-slider'))
			) { // Priority: full window slider, active slider, first slider
	
	        switch (e.which) {
	
	            case 38:
	            	if (shouldNotSlideVertically(el)) { // Page can be scrolled by the arrow key so don't slide
	                	
	                	return;
	
	            	}
	            case 37:
	                slide(el, 'left');
	                break;
	            case 40:
	            	if (shouldNotSlideVertically(el)) {
	                	
	                	return;
	
	            	}
	            case 39:
	                slide(el, 'right');
	            default:
	                return;
	
	        }
			
		}
	
	}
	
	function cancelTouchEvent(el) {
		
		el.addEventListener('touchstart', (e) => {
			
			e.stopPropagation(); return false; 
		
		});
		
	}
	
	function makeSlider(el, current_slide) {
	
		if (el.getAttribute('data-ready')) { // Already created
			
			return;
			
		}
	
		observerOff();
		
	    addClass(el, 'n-slider');
	    makeReady(el);
	
		if (hasClass(el, 'n-full-window')) {
			
		    addClass(el, 'n-slider--overlay');
			componentModal.openFullWindow(el.outerHTML);
			
		}
	
		var container = el.parentNode;
	
		if (!container || !hasClass(container, 'n-slider--wrap')) {
	
		    container = wrap(el);
			addClass(container, 'n-slider--wrap');
			
		
		}

		if (hasClass(container, 'n-pad')) {
			
			addClass(wrap(el), 'n-pad');
			removeClass(container, 'n-pad');

		}
		
        ['n-slider--vertical', 'n-wrap', 'n-slider--top', 'n-slider--right', 'n-slider--overlay'].forEach(item => transferClass(el, container, item));

		var peek = el.getAttribute('data-peek');
		if (peek) {
			
			addClass(container, 'n-slider--peek');
			
        	container.style.padding = hasClass(el, 'n-slider--vertical') ? (peek + ' 0') : ('0 ' + peek);

		}
		
	    // Generate controls if needed
		
		var slider_nav;

		if (el.id && (slider_nav = q('.n-slider--nav[data-for=' + el.id + ']'))) { // Detached nav
			
			addClass(container, 'n-slider--detached-nav');
			addClass(el, 'n-slider--detached-nav');
			transferClass(container, slider_nav, 'n-slider--vertical');
	
		} else {
			
			if (!(slider_nav = container.querySelector(':scope > .n-slider--nav'))) {
				
			    container.insertAdjacentHTML(hasClass(container, 'n-slider--top') ? 'afterbegin' : 'beforeend', '<div class=n-slider--nav></div>');
	            slider_nav = container.querySelector(':scope > .n-slider--nav');
				
			}
		
		}
		
		// Populate controls
		
        if (hasClass(el, 'n-tabs')) {

            addClass(container, 'n-tabs');
            addClass(slider_nav, 'n-row');
            addClass(slider_nav, 'n-tabs');
            transferClass(container, slider_nav, 'n-wrap');
            transferClass(el, container, 'n-slider--vertical');

		}

		if (slider_nav.children.length !== el.children.length) { // Nav doesn't already exist
			
			slider_nav.innerHTML = '';
		    for (var i = 0; i < el.children.length; i++) {
		
		        if (hasClass(el, 'n-tabs')) {
		
		            var tab_title = el.children[i].getAttribute('data-tab_title') || (el.children[i].querySelector('.n-tab-title') ? el.children[i].querySelector('.n-tab-title').innerHTML : i+1);
		            slider_nav.insertAdjacentHTML('beforeend', `<a tabindex=0>${tab_title}</a>`);
	
		        } else {
		
		            slider_nav.insertAdjacentHTML('beforeend', `<a tabindex=0>${i+1}</a>`);
		
		        }
		        
		    }
		
		}
		
	    for (var i = 0; i < el.children.length; i++) {

			slider_nav.children[i].onclick = slider_nav.children[i].onkeyup = (e) => {
				
				if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
					
					return;

				}
				
	            slide( // Select slider either through id or as a parent
		            slider_nav.getAttribute('data-for') ? q('.n-slider#' + slider_nav.getAttribute('data-for')) : e.target,
					'index', thisIndex(e.target)
				);
				
				return false;
	
	        };
	        
	        cancelTouchEvent(slider_nav.children[i]);
	        
	    }
	    
	    // Generate arrows
	
	    container.insertAdjacentHTML('beforeend', '<a class="n-slider--arrow n-slider--left" tabindex=0></a><a class="n-slider--arrow n-slider--right" tabindex=0></a>');
	
	    container.querySelector('.n-slider--arrow').onclick = container.querySelector('.n-slider--arrow').onkeyup = (e) => {
	
			if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
				
				return;

			}

	        slide(e.target, 'left');
	
	    };
	    
	    cancelTouchEvent(container.querySelector('.n-slider--arrow'));
	
	    container.querySelector('.n-slider--arrow.n-slider--right').onclick = container.querySelector('.n-slider--arrow.n-slider--right').onkeyup = (e) => {
	
			if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
				
				return;

			}
	        slide(e.target, 'right');
	
	    };
	
	    cancelTouchEvent(container.querySelector('.n-slider--arrow.n-slider--right'));
	    
	    // Set mouse and touch events
	
	    mouseEvents(el);
	
	    swipeEvents(container);
	
	    container.addEventListener('swipeLeft', (e) => {
	
/*
	        var el = sliderElement(e);
	        slide(el, 'right');
*/
	        slide(e.target, 'right');
	
	    });
	
	    container.addEventListener('swipeRight', (e) => {
	
/*
	        var el = sliderElement(e);
	        slide(el, 'left');
*/
	        slide(e.target, 'left');
	
	    });
	    
	    container.addEventListener('mouseover', (e) => {

		    clearTimeout(el.getAttribute('data-timeout'));
		   
		});
	    
	    // Don't slide when using a range input in a form in a slider
	   	el.querySelectorAll('input[type=range]').forEach((el) => {
        
	        el.ontouchmove = (e) => {
	
				e.stopPropagation();
// 					removeClass(q('html'), 'sliding_now');
		        
	        };
	        
	    });
	
	    if (el.getAttribute('data-autoslide') !== null) { // auto slide
	
			var delay = el.getAttribute('data-autoslide');
			delay = delay.length > 0 ? (1000 * delay) : 4000;
	        var autoSlide = () => {
	
	            slide(el, 'right');
	            el.setAttribute('data-timeout', setTimeout(autoSlide, delay));
	
	        };
	
	        setTimeout(autoSlide, delay);
	
	    }
		
		var _current_slide = current_slide;
		
		// If URI #id matches a slide #id, go to that slide and scroll the page to the slider.
		if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
			
			_current_slide = thisIndex(el.querySelector(window.location.hash));
			current_slider = container;
			
		} 

		endSlide(el, _current_slide || 0); // Start from (other than) the first slide
	
		// Detect text direction
		el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
		    
	    el.addEventListener('keyup', sliderKeyboard);
		
	    if (hasClass(el, 'n-lightbox--inline') && el.closest('.n-slider--wrap').parentNode) { // It's an inline lightbox and needs to become full window/screen when clicked. If it's not a dynamically generated lightbox for full-window lightbox
		    
		    el.onclick = e => {
			    
			    if (e.target.tagName === 'IMG') {
				    
				    componentLightbox.openLightbox(e);
	
			    }
			    
		    };
		    
	    }

		observerOn();
	
	    return container;
	
	}

	var init = (host) => {
		
		host.querySelectorAll('.n-slider:not([data-ready])').forEach((el) => {
		
		    makeSlider(el);
		
		});
		
	    window.addEventListener('keyup', sliderKeyboard);

	};
	registerComponent('slider', init);
	
	return { makeSlider: makeSlider, getSliderNav: getSliderNav };

})();

// Component Fold – end
