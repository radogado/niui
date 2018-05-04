// Component Slider – start

var componentSlider = (function (){
    
/* natUIve Slider */

	var last_slide_time = 14045017000;
	var slide_duration = .5;
	
	function sliderElement(e) { // Get the active slider instance
	
		if (closest(document.activeElement, 'n-sldr') === focusWithin('.n-sldr')) {
	
			return focusWithin('.n-sldr').querySelector('.slider');
	
		}
	
	    var el = e.target;
	
	    if (hasClass(el, 'n-sldr')) {
	
	        return el.querySelector('.slider');
	
	    } else {
	
	        var container = closest(el, '.n-sldr');
	        return container && container.querySelector('.slider');
	
	    }
	
	}
	
	function getSliderNav(slider_wrap) {
	
		// Select either a child slider-nav or the one specified by the slider id, if it exists
		var slider = slider_wrap.querySelector('.slider');
		var slider_nav;
	
		if (slider.id && (slider_nav = q('.slider-nav[data-for=' + slider.id + ']'))) { // Detached nav
	
			return slider_nav;
	
		} else {
	
			return slider_wrap.querySelectorAll('.slider-nav')[slider_wrap.querySelectorAll('.slider-nav').length-1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .pad direct child, taken as the last one of all.
	
		}
	
	}
	
	/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */
	
	function swipeEvents(el) {
	
	    var startX, startY;
	
	    el.addEventListener('touchstart', touchStart);
	
	    function touchStart(e) {
	
	/*
			if (hasClass(q('html'), 'sliding_now')) {
	
				endSlide(sliderElement(e));
				return;
	
			}
	*/
	
	        var touches = e.touches;
	        if (touches && touches.length) {
	
	            startX = touches[0].pageX;
	            startY = touches[0].pageY;
	            el.addEventListener('touchmove', touchMove);
	
	//             q('html').addClass('sliding_now');
	
	        }
	
	    }
	
	    function touchMove(e) {
		    
	        var touches = e.touches;
	// 	    var slider = sliderElement(e);
	
	        if (touches && touches.length && !(hasClass(el, 'vertical') && !closest(el, '.n-ovrl'))) { // Don't slide vertically if not full window
	
	            var deltaX = startX - touches[0].pageX;
	            var deltaY = startY - touches[0].pageY;
	            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;
				
				// Allow vertical page scrol by swiping over the slider 
	            if ((hasClass(el, 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.n-ovrl .n-sldr')) {
	
	//                 removeClass(q('html'), 'sliding_now');
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
	
	/*
		if (hasClass(q('html'), 'sliding_now')) {
			
			stopEvent(e); 
			return;
		
		}
	*/
	
		var el = e.target;
		
		if (closest(el, '.slider-nav')) {
			
			return;
	
		}
	
	    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
	    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
	/* To do: stop generating events while sliding */	
	    if (/* !hasClass(q('html'), 'sliding_now') && */ Math.abs(hasClass(sliderElement(e), 'vertical') ? deltaY : deltaX) > 50) {
	
	        e.preventDefault();
	        initScroll(e, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);
	
		}
	    
	}
	
	function mouseEvents(el, toggle) {
	
	    if (!('onwheel' in window) || (hasClass(el, 'vertical') && !closest(el, '.n-ovrl'))) { // Check for mouse wheel and Don't slide vertically if not full window
		    
		    return;
		   
		}
	
		var slider_wrap = closest(el, '.n-sldr');
	
	    if (toggle === 'off') {
	
	        slider_wrap.removeEventListener('wheel', mouseWheelHandler);
	
	    } else {
	
	        slider_wrap.addEventListener('wheel', mouseWheelHandler);
	        if (getSliderNav(slider_wrap)) {
	
		        getSliderNav(slider_wrap).addEventListener('wheel', function (e) {
		
			        // Scroll as usual instead of sliding
		
		        });
	        
	        }
	
	    }
	
	}
	
	function endSlide(slider, index, old_index) {
	
	    if (hasClass(slider, 'lightbox')) {
			
			componentLightbox.populateLightbox(slider, index);
	        
	    }
	
		var slider_wrap = closest(slider, '.n-sldr');
	
		if (getSliderNav(slider_wrap)) { // Multiple slides? // To do: get the proper slider nav, if it's detached
	
			getSliderNav(slider_wrap).children[index].setAttribute('data-active', true);
		
		}
	    //slider.style.cssText = '';
	
		slider.children[index].setAttribute('data-active', true);
	
	    if (!hasClass(slider, 'vertical')) {
		    
		    slider.style.marginLeft = -100*index + '%';
		   
		}
	
		slider.style.pointerEvents = '';
	
	    window.addEventListener('keyup', sliderKeyboard);
	    setTimeout(function () {
	
	// 	    removeClass(q('html'), 'sliding_now');
		    mouseEvents(slider);
	
		    // Make this slider active
		
	/*
			if (q('.n-sldr.active')) {
				
				removeClass(q('.n-sldr.active'), 'active')
				
			}
		
			addClass(closest(slider, '.n-sldr'), 'active');
	*/
	
			if (slider.children[index].id) { // Scroll page to slide hash. To do: restore focus
		
				scrollToAnimated(getCumulativeOffset(slider.children[index]).y, .2, function () {
					
					var focused = document.activeElement;
					window.location.hash = slider.children[index].id;
					focused.focus();
		
				});
				
			} else { // To do: If previous slide id is in URI, remove URI hash
				
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
	
		var slider_wrap = closest(el, '.n-sldr');
	    var slider = slider_wrap.querySelector('.slider');
	
	    if (slider.children.length < 2) {
	
			endSlide(el, 0);
	        return el;
	
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
	
		// To do: auto-height slider to take the height of the taller element
		var computed_height;
		var computed_height_old;
	
		var target_slide = slider.children[index];
	
		var height_change = (hasClass(slider, 'auto-height') ? 'height: ' + target_slide.scrollHeight + 'px;': '');
	
		if (hasClass(slider, 'vertical')) {
			target_slide.style.cssText = 'display: block'; // Temporarily display the target slide to get its height
			computed_height = getComputedStyle(target_slide).height;
			target_slide.style.cssText = '';
			computed_height_old = getComputedStyle(slider.children[old_index]).height;
	
		} else {
		
			computed_height = getComputedStyle(slider).height;
			if (slider.getAttribute('dir') === 'rtl') {
				
				offset_sign = 1;
		
			}
			
		}
	
		slider.style.height = computed_height;
	
		if (slider_nav.querySelector('[data-active]')) {
	
		    slider_nav.querySelector('[data-active]').removeAttribute('data-active');
	
	    }
	
		var duration = slider.getAttribute('data-duration') || slide_duration;
	
		target_slide.setAttribute('data-active', true);
	
		var translate_from, translate_to;
		
	    if (hasClass(slider, 'vertical')) {
	
		    translate_from = 'translate3d(0,' + ((index<old_index) ? '-100%' : '0') + ',0)';
			
			computed_height = parseInt(computed_height, 10);
			computed_height_old = parseInt(computed_height_old, 10);
		    var difference = Math.abs(computed_height - computed_height_old);
		    if (computed_height > computed_height_old) { // Shortened statement results in larger Closure Compiler file, let it optimise
			    
			    difference = Math.max(computed_height, computed_height_old) - difference;
			    
		    } else {
			    
			    difference = Math.min(computed_height, computed_height_old) + difference;
			    
		    }
		    translate_to = 'translate3d(0,' + ((index<old_index) ? '0' : ('-' + difference + 'px')) + ',0)';
		    slider.children[old_index].style.transition = 'opacity ' + duration/2 + 's linear';
		    slider.children[old_index].style.opacity = 0;
		
		} else {
			
			if (slider.getAttribute('data-peek')) {
			
			    translate_from = 'translate3d(0,0,0)';
			    translate_to = 'translate3d(' + (offset_sign * (index - old_index)) + '00%,0,0)';
		    
		    } else {
	
			    translate_from = 'translate3d(' + offset_sign * ((index<old_index) ? 1 : 0) + '00%,0,0)';
			    translate_to = 'translate3d(' + offset_sign * ((index<old_index) ? 0 : 1) + '00%,0,0)';
			    
		    }
			
		}
	
		var animation_code;
	
		if (hasClass(slider, 'fade')) {
	
			animation_code = '0% { opacity: 1; transform: ' + translate_from + ' } 49% { transform: ' + translate_from + ' } 51% { opacity: 0; transform:' + translate_to + ' } 100% { opacity: 1; transform:' + translate_to + ' }';
		
		} else {
			
			animation_code = '0% { transform: ' + translate_from + '; } 100% { ' + height_change + ' transform: ' + translate_to + '; }';
	
		}
	
		slider.setAttribute('data-sliding', true);
	
		if (!slider.getAttribute('data-peek')) {
			
			slider.style.margin = 0;
			
		}
	
		animate(slider, animation_code, duration, function slideEndHandler(e) { // On slide end
	
			slider.removeAttribute('data-sliding');
			slider.children[old_index].removeAttribute('data-active');
		    slider.children[old_index].style.transition = '';
		    slider.children[old_index].style.opacity = '';
	
			slider.style.height = '';
			current_slider = slider;
			endSlide(slider, index, old_index);
	
	    });
	
	}
	
	function shouldNotSlideVertically(el) {
		
		if (q('.n-ovrl')) { 
			
			return false; 
		
		}
		return !hasClass(el, 'vertical') || window.innerHeight < q('body').scrollHeight;
		
	}
	
	function sliderKeyboard(e) {
	
	    if (typeof e === 'undefined' || 
	//     	hasClass(q('html'), 'sliding_now') || 
	    	q('.slider[data-sliding]') || 
	    	(q('.n-ovrl') && !q('.n-ovrl .n-sldr')) // There is an overlay open and it doesn't have a slider in it
			) {
	
	        return;
	
	    }
	
		var el = e.target;
	
		if (!closest(el, '.n-sldr') && q('.n-sldr')) { // Focused element is outside of any slider
			
	// 		current_slider = q('.n-sldr').querySelector('.slider');
			var scrollable = el; // Don't slide when current element is scrollable. Check all parent nodes for scrollability – cheak each parent until body.
			while (scrollable.nodeName !== 'BODY') {
				
				if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) { 
					
					return;
			
				}
		
				scrollable = scrollable.parentElement;
		
			}
			
		} else {
			
			current_slider = closest(el, '.n-sldr').querySelector('.slider');
	
		}
	
		if (focusWithin('.slider')) {
			
			current_slider = focusWithin('.slider');
			
		}
	
		if 	(el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && 
	// 		(document.activeElement === el ? (el.scrollWidth <= el.clientWidth) : true) &&
	// 		(!closest(document.activeElement, '.n-sldr.active') && (el.scrollWidth <= el.clientWidth) ) &&
			(el = q('.n-ovrl .slider') || current_slider || q('.slider'))
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
		
		el.addEventListener('touchstart', function (e) {
			
			e.stopPropagation(); return false; 
		
		});
		
	}
	
	function makeSlider(el, current_slide) {
	
		if (el.getAttribute('data-ready')) { // Already created
			
			return;
			
		}
	
	// 	observerOff();
		
	    addClass(el, 'slider');
	    makeReady(el);
	
		if (hasClass(el, 'full-window')) {
			
		    addClass(el, 'overlay');
			openFullWindow(el.outerHTML);
			
		}
	
		var container = el.parentNode;
	
		if (!container || !hasClass(container, 'n-sldr')) {
	
		    container = wrap(el);
			addClass(container, 'n-sldr');
		    el = container.querySelector('.slider');
			
			if (hasClass(el, 'pad')) {
				
			    container = wrap(el);
				addClass(container, 'pad');
			    container = container.parentNode;
			    el = container.querySelector('.slider');
	
			}
			
		    transferClass(el, container, 'vertical');
	        transferClass(el, container, 'wrap');
	        transferClass(el, container, 'top');
	        transferClass(el, container, 'right');
	        transferClass(el, container, 'overlay');
			var peek = el.getAttribute('data-peek');
			if (peek) {
				
				if (hasClass(el, 'vertical')) {
	
		        	container.style.padding = peek + ' 0';
				
				} else {
	
		        	container.style.padding = '0 ' + peek;
					
				}
	
			}
	    
	    }
		
		if (el.children.length > 1) { // Add controls only to a slider with multiple slides
			
			var slider_nav;
	
			if (el.id && (slider_nav = q('.slider-nav[data-for=' + el.id + ']'))) { // Detached nav
				
				addClass(container, 'detached-nav');
				addClass(el, 'detached-nav');
		
			} else {
	
			    container.insertAdjacentHTML(hasClass(container, 'top') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
	            slider_nav = container.querySelector('.slider-nav:not([data-for])'); // Not data-for to avoid nested detached nav for nested sliders
			
			}
			
		    container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left" tabindex=0></a><a class="slider-arrow right" tabindex=0></a>');
		
		    // Generate controls
	
		    for (var i = 0; i < el.children.length; i++) {
		
		        if (hasClass(el, 'tabs')) {
		
		            addClass(container, 'tabs');
		            addClass(slider_nav, 'row');
		            transferClass(container, slider_nav, 'wrap');
		            transferClass(el, container, 'vertical');
		            var tab_title = el.children[i].getAttribute('data-tab_title') || (el.children[i].querySelector('.tab-title') ? el.children[i].querySelector('.tab-title').innerHTML : i+1);
		            slider_nav.insertAdjacentHTML('beforeend', '<a tabindex="0">' + tab_title + '</a>');
	
		        } else {
		
		            slider_nav.insertAdjacentHTML('beforeend', '<a tabindex=0>' + (i + 1) + '</a>');
		
		        }
		
				slider_nav.lastChild.onclick = slider_nav.lastChild.onkeyup = function(e) {
					
					if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
						
						return;
	
					}
					
		            slide( // Select slider either through id or as a parent
			            slider_nav.getAttribute('data-for') ? q('.slider#' + slider_nav.getAttribute('data-for')) : e.target,
						'index', thisIndex(e.target)
					);
		
		        };
		        
		        cancelTouchEvent(slider_nav.lastChild);
		        
		    }
		
		    container.querySelector('.slider-arrow').onclick = container.querySelector('.slider-arrow').onkeyup = function(e) {
		
				if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
					
					return;
	
				}
	
		        slide(e.target, 'left');
		
		    };
		    
		    cancelTouchEvent(container.querySelector('.slider-arrow'));
		
		    container.querySelector('.slider-arrow.right').onclick = container.querySelector('.slider-arrow.right').onkeyup = function(e) {
		
				if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
					
					return;
	
				}
		        slide(e.target, 'right');
		
		    };
		
		    cancelTouchEvent(container.querySelector('.slider-arrow.right'));
		
		    mouseEvents(el);
		
		    swipeEvents(container);
		
		    container.addEventListener('swipeLeft', function(e) {
		
		        var el = sliderElement(e);
		        slide(el, 'right');
		
		    });
		
		    container.addEventListener('swipeRight', function(e) {
		
		        var el = sliderElement(e);
		        slide(el, 'left');
		
		    });
		    
		    container.addEventListener('mouseover', function(e) {
	
			    clearTimeout(el.getAttribute('data-timeout'));
			   
			});
		    
		    // Don't slide when using a range input in a form in a slider
		    if (el.querySelector('input[type=range]')) {
			   	
			   	forEach(el.querySelector('input[type=range]'), function (el) {
		        
			        el.ontouchmove = function(e) {
			
						e.stopPropagation();
	// 					removeClass(q('html'), 'sliding_now');
				        
			        };
			        
			    });
		    
		    }
		
		    if (el.getAttribute('data-autoslide')) { // auto slide
		
				var delay = el.getAttribute('data-autoslide');
				delay = delay.length > 0 ? (1000 * delay) : 4000;
		        var autoSlide = function() {
		
		            slide(el, 'right');
		            el.setAttribute('data-timeout', setTimeout(autoSlide, delay));
		
		        };
		
		        setTimeout(autoSlide, delay);
		
		    }
			
			// If URI #id matches a slide #id, go to that slide and scroll the page to the slider.
			if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
				
				var current_slide = thisIndex(el.querySelector(window.location.hash));
				current_slider = container;
				
			} 
			endSlide(el, current_slide || 0); // Start from (other than) the first slide
		    
		} else {
			
			el.children[0].setAttribute('data-active', true);
	
		}
	
		// Detect text direction
		el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
		    
	    window.addEventListener('keyup', sliderKeyboard);
		
	// 	observerOn();
	
	    return container;
	
	}

	var selector = '.slider';
	var init = function(host) {
		
		forEach(host.querySelectorAll('.slider:not([data-ready])'), function(el) {
		
		    makeSlider(el);
		
		});
		
	};
	registerComponent('slider', selector, init);
	
	return { makeSlider: makeSlider, getSliderNav: getSliderNav };

})();

// Component Fold – end
