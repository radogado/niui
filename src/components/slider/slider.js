// Component Slider – start

var componentSlider = (function (){
    
/* niui Slider */

	var last_slide_time = 14045017000;
	var slide_duration = .5;
	
	function sliderElement(e) { // Get the active slider instance
		
// 		var closest_slider_wrap = document.activeElement.closest('.n-slider--wrap');
		var closest_slider_wrap = e.target.closest('.n-slider--wrap');
		
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
			
			let nav = slider_wrap.querySelectorAll('.n-slider--nav');
			return nav[nav.length-1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .n-pad direct child, taken as the last one of all.
	
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
	
	        if (touches && touches.length && !(hasClass(el, 'n-slider__vertical') && !el.closest('.n-ovrl'))) { // Don't slide vertically if not full window
	
	            var deltaX = startX - touches[0].pageX;
	            var deltaY = startY - touches[0].pageY;
	            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;				
				var overlay_content = el.closest('.n-ovrl') ? el.closest('.n-ovrl').querySelector('.n-ovrl--content') : null;

				// Allow vertical page scroll by swiping over the slider. Also when parent modal is scrollable vertically
	            if (((hasClass(el, 'n-slider__vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.n-ovrl .n-slider--wrap'))
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
	
	var scroll_timestamp = 0;

	function mouseWheelHandler(e) {
	
		let el = e.target;
		
		let current_slider_wrap = el.closest('.n-slider--wrap');
		let current_slider = el.closest('.n-slider');

		if ((e.timeStamp - scroll_timestamp > 1666) && current_slider && !el.closest('.n-slider--nav') && !current_slider_wrap.getAttribute('data-active')) {
		
		    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
		    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
	
		    if (Math.abs(hasClass(current_slider, 'n-slider__vertical') ? deltaY : deltaX) > 50) {
	
				scroll_timestamp = e.timeStamp;
		        e.stopPropagation();
				slide(current_slider, ((Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY) < 0 ? 'right' : 'left');
		
			}
		
		}
	    
	}
	
	function mouseEvents(el, toggle) {
	
	    if (!('onwheel' in window) || (hasClass(el, 'n-slider__vertical') && !el.closest('.n-ovrl'))) { // Check for mouse wheel and don't slide vertically if not full window
		    
		    return;
		   
		}
	
	    if (toggle === 'off') {

	        el.removeEventListener('wheel', mouseWheelHandler);
	
	    } else {
	
	        el.addEventListener('wheel', mouseWheelHandler);

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
	
	    if (!hasClass(slider, 'n-slider__vertical')) {
		    
		    slider.style.marginLeft = `${-100*index}%`;
		   
		}
	
		slider.style.pointerEvents = slider.style.height = '';
	
	    window.addEventListener('keyup', sliderKeyboard);
	    mouseEvents(slider_wrap);
	    var timeNow = new Date().getTime();
		last_slide_time = timeNow;

		if (slider.children[index].id) {

				var focused = document.activeElement;
				window.location.hash = slider.children[index].id;
				focused.focus();
			
		} else {
			
			if (!!old_index && location.hash === '#' + slider.children[old_index].id) {
				
				removeHash();
				
			}
			
		}

	}
	
	function slide(el, method, index_number) {
	
// 2 directions: horizontal/vertical
// 3 animations: slide/fade/fade overlap
	
		var slider_wrap = el.closest('.n-slider--wrap');
	
	    var slider = slider_wrap.querySelector('.n-slider');
	
	    if (slider.children.length < 2) {
	
			endSlide(slider, 0);
	        return slider;
	
	    }
	    
	    slider.style.pointerEvents = 'none'; // Speed up animation
	    mouseEvents(slider_wrap, 'off');
	    window.removeEventListener('keyup', sliderKeyboard);
	
		clearTimeout(slider.dataset.timeout);
		
		var index;
		var old_index;
		var slider_nav = getSliderNav(slider_wrap);
		var active_nav_item = slider_nav.querySelector('[data-active]');
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
		
		if (hasClass(slider, 'n-slider__auto-height')) {
			
			height_change =	`height: ${target_slide.scrollHeight}px`;
			height_current = `height: ${slider.scrollHeight}px`;
			
		}
		
		var original_slider_height = slider.scrollHeight;
		target_slide.dataset.active = true;

		var next_slide_image = target_slide.querySelector('img');
		if (hasClass(slider, 'n-slider__vertical') || (hasClass(slider, 'n-slider__auto-height') && hasClass(slider, 'n-lightbox__inline'))) {
			
			if (hasClass(slider, 'n-lightbox__inline') && !hasClass(slider, 'n-slider__overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'n-aspect')) { // Inline lightbox only. To do: integrate n-aspect with n-slider--wrap
			
				let next_image_width = next_slide_image.getAttribute('width') ? next_slide_image.getAttribute('width') * 1 : next_slide_image.naturalWidth; // To do: set data-width, data-height from the anochor link
				let next_image_height = next_slide_image.getAttribute('height') ? next_slide_image.getAttribute('height') * 1 : next_slide_image.naturalHeight;
				
				var height_change_number = slider.clientWidth * next_image_height / next_image_width;
				if (slider.clientWidth >= next_image_width) {
					
					height_change_number = next_image_height;
					
				}
				if (hasClass(next_slide_image.parentNode, 'n-aspect')) {
					
					height_change_number = next_slide_image.parentNode.offsetHeight;
					
				}
				height_change =	`height: ${height_change_number}px`;
	
			} else { // Vertical, not a lightbox, non-img content (video, iframe)
				
				if (hasClass(slider, 'n-slider__auto-height')) {

					target_slide.style.position = 'absolute';
	
				}
				height_change =	`height: ${target_slide.clientHeight}px`;
				target_slide.style.cssText = '';

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
	
		    delete slider_nav.querySelector('[data-active]').dataset.active;
	
	    }
	
		var duration = slider.dataset.duration || slide_duration;
	
		var translate_from, translate_to;
		
	    if (hasClass(slider, 'n-slider__vertical')) {
			
			computed_height = parseInt(computed_height, 10);
			computed_height_old = parseInt(computed_height_old, 10);

			var next_height =  (!hasClass(slider, 'n-slider__overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'n-aspect')) ? (`-${height_change_number}px`) : '-100%';
		    translate_from = `translate3d(0,${index<old_index ? ('-' + computed_height + 'px') : 0},0)`;
		    if (hasClass(slider, 'n-tabs') && computed_height < original_slider_height && index < old_index) {
				
				slider.style.overflow = 'hidden';

		    }
			
/*
		    var difference = Math.abs(computed_height - computed_height_old);

		    if (computed_height > computed_height_old) {
			    
			    difference = Math.max(computed_height, computed_height_old) - difference;
			    
		    } else {
			    
			    difference = Math.min(computed_height, computed_height_old) + difference;
			    
		    }

		    if (computed_height === computed_height_old) {
			    
			    difference = 0;
			    
			}
*/

		    translate_to = `translate3d(0,${index<old_index ? '0' : ('-' + original_slider_height + 'px')},0)`;
/*
		    slider.children[old_index].style.transition = `opacity ${duration/2}s linear`; // On Safari, this delays the sliding, making the slider jump
		    slider.children[old_index].style.opacity = 0;
*/
		
		} else {
			
			if (!!slider.dataset.peek) {
			
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
			slider.style.overflow = '';

			[slider.children[index], slider.children[old_index]].forEach((el) => {
				
				el.style.transition = el.style.opacity = el.style.height = el.style.margin = '';
				
			});

			current_slider = slider;
			endSlide(slider, index, old_index);
	
	    }
		    
		if (hasClass(slider, 'n-slider__fade-overlap')) { // fade slides in/out directly. Overlap new and old slides.
			
		    slider.children[index].style.opacity = 0;
			slider.children[index > old_index ? index : old_index].style.marginLeft = '-100%';
		    slider.children[old_index].style.opacity = 1;

			// Animate both simultaneously

			animate(slider, `0% { ${height_current}; } 100% { ${height_change}; }`, duration);
			animate(slider.children[index], '0% { opacity: 0; } 100% { opacity: 1; }', duration, slideEndHandler);
			animate(slider.children[old_index], '0% { opacity: 1; } 100% { opacity: 0; }', duration);
			
		} else {
			
			var animation_code;
	
			if (hasClass(slider, 'n-slider__fade')) { // fade out to a color and fade in to the new slide
		
				animation_code = `0% { opacity: 1; transform: ${translate_from}; ${height_current}} 49% { transform: ${translate_from} } 51% { opacity: 0; transform: ${translate_to} } 100% { ${height_change}; opacity: 1; transform: ${translate_to} }`;
			
			} else {

				if (hasClass(slider, 'n-slider__vertical') && !hasClass(slider, 'n-lightbox') && old_index > index && computed_height < original_slider_height) {
					
					animation_code = `0% { margin-top: -${computed_height}px; height: ${computed_height + computed_height_old}px; } 100% { margin-top: 0; ${height_change}; }`;

				} else {

					animation_code = `0% { transform: ${translate_from}; ${height_current}; } 100% { ${height_change}; transform: ${translate_to}; }`;
				
				}

			}
			
			animate(slider, animation_code, duration, slideEndHandler);
			
		}
	
	}
	
	function shouldNotSlideVertically(el) {
		
		if (q('.n-ovrl')) { 
			
			return false; 
		
		}
		return !hasClass(el, 'n-slider__vertical') || window.innerHeight < document.body.scrollHeight;
		
	}
	
	function sliderKeyboard(e) { // e.target can be either body or a slider, choose accordingly

	    if (!e || 

	    	q('.n-slider--wrap[data-active]') || 
	    	(q('.n-ovrl') && !q('.n-ovrl .n-slider--wrap')) // There is an overlay open and it doesn't have a slider in it
			) {
	
	        return;
	
	    }
	
		var el = e.target;

		if (!el.closest('.n-slider--wrap') && q('.n-slider--wrap')) { // Focused element is outside of any slider
			
		} else {
			
			current_slider = el.closest('.n-slider--wrap') ? el.closest('.n-slider--wrap').querySelector('.n-slider') : null;
	
		}
	
		if (focusWithin('.n-slider')) {
			
			current_slider = focusWithin('.n-slider');
			
		}
	
		if 	(el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && 
			(el = q('.n-ovrl .n-slider') || current_slider || q('.n-slider'))
			) { // Priority: full window slider, active slider, first slider
				
				if (hasClass(document.activeElement, 'n-slider')) {
					
					el = document.activeElement;
					
				}
				
				if (e.key !== 'Escape') {
				
					e.stopPropagation();
				
				}
				
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
		                break;
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
	
		if (!!el.dataset.ready) { // Already created
			
			return;
			
		}
	
		observerOff();
		
	    addClass(el, 'n-slider');
		el.setAttribute('tabindex', 0); // For keyboard events
	    makeReady(el);
	
		if (hasClass(el, 'n-full-window')) {
			
		    addClass(el, 'n-slider__overlay');
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
		
        ['n-slider__vertical', 'n-wrap', 'n-slider__top', 'n-slider__right', 'n-slider__overlay'].forEach(item => transferClass(el, container, item));

		var peek = el.dataset.peek;
		if (peek) {
			
			addClass(container, 'n-slider__peek');
			
        	container.style.padding = hasClass(el, 'n-slider__vertical') ? (peek + ' 0') : ('0 ' + peek);

		}
		
	    // Generate controls if needed
		
		var slider_nav = false;

		if (el.id && (slider_nav = q(`.n-slider--nav[data-for=${el.id}]`))) { // Detached nav
			
			addClass(container, 'n-slider__detached-nav');
			addClass(el, 'n-slider__detached-nav');
			transferClass(container, slider_nav, 'n-slider__vertical');
	
		} else {
			
			container.childNodes.forEach(el => {
				
				slider_nav = (el.nodeName === 'DIV' && el.matches('.n-slider--nav')) ? el : slider_nav; 
			
			});
			
			if (!slider_nav) {
				
			    container.insertAdjacentHTML(hasClass(container, 'n-slider__top') ? 'afterbegin' : 'beforeend', '<div class=n-slider--nav></div>');
	            slider_nav = hasClass(container, 'n-slider__top') ? container.firstChild : container.lastChild;

			}
		
		}
		
		// Populate controls
		
        if (hasClass(el, 'n-tabs')) {

            addClass(container, 'n-tabs');
            addClass(slider_nav, 'n-row');
            addClass(slider_nav, 'n-tabs');
            transferClass(container, slider_nav, 'n-wrap');
            transferClass(el, container, 'n-slider__vertical');

		}

		if (slider_nav.children.length !== el.children.length) { // Nav doesn't already exist
			
			slider_nav.innerHTML = '';
		    for (var i = 0; i < el.children.length; i++) {
		
		        if (hasClass(el, 'n-tabs')) {
		
		            var tab_title = el.children[i].dataset.tabTitle || (el.children[i].querySelector('.n-tab-title') ? el.children[i].querySelector('.n-tab-title').innerHTML : i+1);
		            slider_nav.insertAdjacentHTML('beforeend', `<button>${tab_title}</button>`);
	
		        } else {
		
		            slider_nav.insertAdjacentHTML('beforeend', `<button>${i+1}</button>`);
		
		        }
		        
		    }
		
		}

		let slideKeyboardHandler = (e) => {
			
			var scrollable = e.target; // Don't slide when current element is scrollable
			if (e.key === 'Escape' || hasClass(scrollable.parentNode, '.n-slider__overlay')) {
				
				return;
				
			}
			if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) { 
				
				e.stopPropagation();
				return;
		
			}

        };
		
		Array.from(el.children).forEach((el, i) => {
			
			let nav_item = slider_nav.children[i];
			nav_item.onclick = (e) => {
				
	            slide( // Select slider either through id or as a parent
		            slider_nav.dataset.for ? q('.n-slider#' + slider_nav.dataset.for) : e.target,
					'index', thisIndex(e.target)
				);
				
				return false;
	
	        };
	        
	        cancelTouchEvent(nav_item);
	        
	        el.setAttribute('tabindex', 0);
	        el.addEventListener('keyup', slideKeyboardHandler);
			
		});
	
		    
	    // Generate arrows
	
	    container.insertAdjacentHTML('beforeend', '<button class="n-slider--arrow n-slider--left"></button><button class="n-slider--arrow n-slider__right"></button>');
	    
	    let setArrowEvents = (selector, direction) => {
		    
		    let arrow = container.querySelector('.n-slider--arrow' + selector);
		    arrow.onclick = arrow.onkeyup = (e) => {
		
				if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
					
					return;
	
				}
	
		        slide(e.target, direction);
		
		    };
		    
			cancelTouchEvent(arrow);

	    };
	    
	    setArrowEvents('', 'left');
	    setArrowEvents('.n-slider__right', 'right');
	
	    // Set mouse and touch events
	
	    mouseEvents(container);
	
	    swipeEvents(container);
	
	    container.addEventListener('swipeLeft', (e) => {
	
	        slide(e.target, 'right');
	
	    });
	
	    container.addEventListener('swipeRight', (e) => {
	
	        slide(e.target, 'left');
	
	    });
	    
	    container.addEventListener('mouseover', (e) => {

		    clearTimeout(el.dataset.timeout);
		   
		});
	    
	    // Don't slide when using a range input in a form in a slider
	   	el.querySelectorAll('input[type=range]').forEach((el) => {
        
	        el.ontouchmove = (e) => {
	
				e.stopPropagation();
		        
	        };
	        
	    });
	
	    if (!!el.dataset.autoslide) { // auto slide
	
			var delay = el.dataset.autoslide;
			delay = delay.length > 0 ? (1000 * delay) : 4000;
	        var autoSlide = () => {
	
	            slide(el, 'right');
	            el.dataset.timeout = setTimeout(autoSlide, delay);
	
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
		
	    if (hasClass(el, 'n-lightbox__inline')) { // It's an inline lightbox and needs to become full window/screen when clicked. If it's not a dynamically generated lightbox for full-window lightbox
		    
		    el.onclick = e => {
			    
			    if (e.target.tagName === 'IMG') {
				    
				    componentLightbox.openLightbox(e);
	
			    }
			    
		    };
		    
	    }

		observerOn();
	
	    return container;
	
	}

	let init = host => {
		
		host.querySelectorAll('.n-slider:not([data-ready])').forEach((el) => {
		
		    makeSlider(el);
		
		});
		
	    window.addEventListener('keyup', sliderKeyboard);

	};
	registerComponent('slider', init);
	
	window.addEventListener('hashchange', () => {
		
		let new_hash_slide = q('.n-slider > :target, .n-slider > .n-target');
		if (new_hash_slide) {
			
			slide(new_hash_slide.parentNode, 'index', thisIndex(new_hash_slide));		
			
		}
		
	}, false);
	
	return { makeSlider, getSliderNav, slide, mouseEvents };

})();

// Component Fold – end
