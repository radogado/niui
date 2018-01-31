/* natUIve Slider */

// "use strict";

(function () {

	"use strict";
	if (Function.prototype.bind && !this) { // Supports ES5

		return;

	} else { // Doesn't support ES5, going CSS-only
	
	  noSuchFunction();
	  return;

	}

}());

// q('html').dataset.last_slide = 14045017000;
// q('html').setAttribute('data-last_slide', 14045017000);
window.lastSlideTime = 14045017000;
// q('html').dataset.slide_duration = 0.5;
window.slideDuration = .5;

function sliderElement(e) { // Get the active slider instance

	if (closest(document.activeElement, 'n-sldr') === q('.n-sldr:focus-within')) {

		return q('.n-sldr:focus-within .slider');

	}

    var el = e.target;

    if (el.hasClass('n-sldr')) {

        return el.q('.slider');

    } else {

        var container = closest(el, '.n-sldr');
        return container && container.q('.slider');

    }

}

/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

function swipeEvents(el) {

    var startX, startY;

    el.addEventListener('touchstart', touchStart);

    function touchStart(e) {

		if (q('html').hasClass('sliding_now')) {

			endSlide(sliderElement(e));
			return;

		}

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

        if (touches && touches.length && !(el.hasClass('vertical') && !closest(el, '.n-ovrl'))) { // Don't slide vertically if not full window

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;
			
			// Allow vertical page scrol by swiping over the slider 
            if ((el.hasClass('vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.n-ovrl .n-sldr')) {

                q('html').removeClass('sliding_now');
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
    if ((timeNow - window.lastSlideTime) < window.slideDuration * 2000 || q('html').hasClass('sliding_now')) {

        stopEvent(e);
		return;

    }

	window.lastSlideTime = timeNow;

    slide(sliderElement(e), delta < 0 ? 'right' : 'left');

}

function mouseWheelHandler(e) {

	if (q('html').hasClass('sliding_now')) {
		
		stopEvent(e); 
		return;
	
	}

	var el = e.target;
	
	if (closest(el, '.slider-nav')) {
		
		return;

	}

    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
/* To do: stop generating events while sliding */	
    if (!q('html').hasClass('sliding_now') && Math.abs(sliderElement(e).hasClass('vertical') ? deltaY : deltaX) > 50) {

        e.preventDefault();
        initScroll(e, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);

	}
    
}

function mouseEvents(el, toggle) {

    if (!('onwheel' in window) || (el.hasClass('vertical') && !closest(el, '.n-ovrl'))) { // Check for mouse wheel and Don't slide vertically if not full window
	    
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

function endSlide (slider, index) {

    if (slider.hasClass('lightbox')) {
		
		populateLightbox(slider, index);
        
    }

	var slider_wrap = closest(slider, '.n-sldr');
	
	if (getSliderNav(slider_wrap)) { // Multiple slides? // To do: get the proper slider nav, if it's detached

		getSliderNav(slider_wrap).children[index].addClass('active');
	
	}
    slider.style.cssText = '';

	slider.children[index].addClass('active');

    if (!slider.hasClass('vertical')) {
	    
	    slider.style.marginLeft = -100*index + '%';
	   
	}

	slider.style.pointerEvents = '';

	window.onkeyup = sliderKeyboard;
    setTimeout(function () {

	    q('html').removeClass('sliding_now');
	    mouseEvents(slider);

	    // Make this slider active
	
		if (q('.n-sldr.active')) {
			
			q('.n-sldr.active').removeClass('active')
			
		}
	
		closest(slider, '.n-sldr').addClass('active');

	}, window.slideDuration/2);
	
}

function slide(el, method, index_number) {

	if (q('html').hasClass('sliding_now')) {
		
		return;
	
	}

    var slider = closest(el, '.n-sldr').q('.slider');

    if (slider.children.length < 2) {

		endSlide(el, 0);
        return el;

    }
    
	var slider_wrap = closest(el, '.n-sldr');

    mouseEvents(slider_wrap, 'off');
    slider.style.pointerEvents = 'none'; // Speed up animation
    mouseEvents(el, 'off');
	document.onkeyup = function () { return false; };
// 	q('html').addClass('sliding_now'); // iOS errors

    if (window.sliderTimeout) {

        clearTimeout(window.sliderTimeout);

    }
	
	var index;
	var old_index;
	var slider_wrap = closest(slider, '.n-sldr');
	var slider_nav = getSliderNav(slider_wrap);
	index = old_index = thisIndex(slider_nav.q('a.active'));

    if (method === 'index') {

		if (typeof index_number === 'undefined' || index_number === index || !slider.q('.active')) { /* Don't slide to current slide */
			
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

    var offset_sign = '-'; // Slider offset depending on direction. '-' for LTR or '' (plus) for RTL. Vertical is always '-'

	// To do: auto-height slider to take the height of the taller element
	var computed_height;
	var computed_height_old;

	var target_slide = slider.children[index];

	if (slider.hasClass('vertical')) {
		target_slide.style.cssText = 'display: block'; // Temporarily display the target slide to get its height
		computed_height = getComputedStyle(target_slide).height;
		target_slide.style.cssText = '';
		computed_height_old = getComputedStyle(slider.children[old_index]).height;

	} else {
	
		computed_height = getComputedStyle(slider).height;
		if (slider.getAttribute('dir') === 'rtl') {
			
			offset_sign = '';
	
		}
		
	}

	slider.style.height = computed_height;

	if (slider_nav.q('.active')) {

	    slider_nav.q('.active').removeClass('active');

    }

	var duration = slider.getAttribute('data-duration') ? slider.getAttribute('data-duration') : window.slideDuration;

	target_slide.addClass('active');

	var translate_from, translate_to;
	
    if (slider.hasClass('vertical')) {

	    translate_from = 'translate3d(0,' + ((index<old_index) ? '-100%' : '0') + ',0)';
		
		computed_height = parseInt(computed_height, 10);
		computed_height_old = parseInt(computed_height_old, 10);
	    var difference = Math.abs(computed_height - computed_height_old);
	    if (computed_height > computed_height_old) {
		    
		    difference = Math.max(computed_height, computed_height_old) - difference;
		    
	    } else {
		    
		    difference = Math.min(computed_height, computed_height_old) + difference;
		    
	    }
	    translate_to = 'translate3d(0,' + ((index<old_index) ? '0' : ('-' + difference + 'px')) + ',0)';
	    slider.children[old_index].style.transition = 'opacity ' + duration/2 + 's linear';
	    slider.children[old_index].style.opacity = 0;
	
	} else {
		
	    translate_from = 'translate3d(' + offset_sign + ((index<old_index) ? 1 : 0) + '00%,0,0)';
	    translate_to = 'translate3d(' + offset_sign + ((index<old_index) ? 0 : 1) + '00%,0,0)';
		
	}
    
	var animation_code;

	if (slider.hasClass('fade')) {

		animation_code = '0% { opacity: 1; transform: ' + translate_from + ' } 49% { transform: ' + translate_from + ' } 51% { opacity: 0; transform:' + translate_to + ' } 100% { opacity: 1; transform:' + translate_to + ' }';
	
	} else {
		
		animation_code = '0% { transform: ' + translate_from + '; } 100% { transform: ' + translate_to + '; }';

	}

	slider.setAttribute('data-sliding', true);

	slider.style.margin = 0;

	animate(slider, animation_code, duration, function slideEndHandler(e) { // On slide end

		slider.removeAttribute('data-sliding');
		slider.children[old_index].removeClass('active');
	    slider.children[old_index].style.transition = '';
	    slider.children[old_index].style.opacity = '';

		slider.style.height = '';
		endSlide(slider, index);

    });

	if (target_slide.id) { // Scroll page to slide hash

		scrollToAnimated(getCumulativeOffset(target_slide).y, .2, function () {

			window.location.hash = target_slide.id;

		});
		
	}

}

function shouldNotSlideVertically(el) {
	
	if (q('.n-ovrl')) { 
		
		return false; 
	
	}
	return !el.hasClass('vertical') || window.innerHeight < q('body').scrollHeight;
	
}

function sliderKeyboard(e) {

    if (typeof e === 'undefined' || q('html').hasClass('sliding_now') || q('.slider[data-sliding]') || 
    	(q('.n-ovrl') && !q('.n-ovrl .n-sldr.active')) // There is an overlay open and it doesn't have a slider in it
		) {

        return;

    }

	var el = e.target;

	var tag = el.tagName.toLowerCase();

	if (!closest(el, '.n-sldr')) { // Focused element is outside of any slider
		
		if (q('.n-sldr')) {
			
			q('.n-sldr').addClass('active');

		}
		
	}

	if (tag !== 'input' && tag !== 'textarea' && 
		(document.activeElement === el ? (el.scrollWidth <= el.clientWidth) : true) &&
		(el = q('.n-ovrl .slider') || q('.n-sldr.active .slider') || q('.slider'))
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
	
	el.addEventListener('touchstart', function (e) { e.stopPropagation(); return false; });
	
}

function makeSlider(el, current_slide) {

	if (el.parentNode.hasClass('n-sldr') || el.parentNode.parentNode.hasClass('n-sldr')) { // Already created
		
		return;
		
	}
	
    el.addClass('slider');

	if (el.hasClass('full-window')) {
		
		openFullWindow(el);
		
	}

	var container = el.parentNode;

	if (!container.hasClass('n-sldr')) {

	    container = wrap(el).parentNode;
		container.addClass('n-sldr');
	    el = container.q('.slider');
		
		if (el.hasClass('pad')) {
			
		    container = wrap(el).parentNode;
			container.addClass('pad');
		    container = container.parentNode;
		    el = container.q('.slider');

		}
		
	    transferClass(el, container, 'vertical');
        transferClass(el, container, 'wrap');
        transferClass(el, container, 'top');
        transferClass(el, container, 'right');
    
    }
	
	if (el.children.length > 1) { // Add controls only to a slider with multiple slides
		
		var slider_nav;

		if (el.id && (slider_nav = q('.slider-nav[data-for=' + el.id + ']'))) { // Detached nav
			
			container.addClass('detached-nav');
			el.addClass('detached-nav');
	
		} else {

		    container.insertAdjacentHTML(container.hasClass('top') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
            slider_nav = container.q('.slider-nav:not([data-for])'); // Not data-for to avoid nested detached nav for nested sliders
		
		}
		
	    container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left" tabindex=0></a><a class="slider-arrow right" tabindex=0></a>');
	
		var slider_wrap = closest(el, '.n-sldr');
	
	    // Generate controls

	    for (var i = 0; i < el.children.length; i++) {
	
	        if (el.hasClass('tabs')) {
	
	            slider_wrap.addClass('tabs');
	            slider_nav.addClass('row');
	            transferClass(slider_wrap, slider_nav, 'wrap');
	            transferClass(el, slider_wrap, 'vertical');
	            var tab_title = el.children[i].getAttribute('data-tab_title') || (el.children[i].q('.tab-title') ? el.children[i].q('.tab-title').innerHTML : i+1);
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
	
	    container.q('.slider-arrow').onclick = container.q('.slider-arrow').onkeyup = function(e) {
	
			if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
				
				return;

			}

	        slide(e.target, 'left');
	
	    };
	    
	    cancelTouchEvent(container.q('.slider-arrow'));
	
	    container.q('.slider-arrow.right').onclick = container.q('.slider-arrow.right').onkeyup = function(e) {
	
			if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
				
				return;

			}
	        slide(e.target, 'right');
	
	    };
	
	    cancelTouchEvent(container.q('.slider-arrow.right'));
	
	    mouseEvents(el);
	
	    swipeEvents(slider_wrap);
	
	    slider_wrap.addEventListener('swipeLeft', function(e) {
	
	        var el = sliderElement(e);
	        slide(el, 'right');
	
	    });
	
	    slider_wrap.addEventListener('swipeRight', function(e) {
	
	        var el = sliderElement(e);
	        slide(el, 'left');
	
	    });
	    
	    // Don't slide when using a range input in a form in a slider
	    forEach(el.q('input[type=range]'), function (el) {
	        
	        el.ontouchmove = function(e) {
	
				e.stopPropagation();
				q('html').removeClass('sliding_now');
		        
	        };
	        
	    });
	
	    if (el.getAttribute('data-autoslide')) { // auto slide
	
			var delay = el.getAttribute('data-autoslide');
			delay = delay.length > 0 ? (1000 * delay) : 4000;
	        var autoSlide = function() {
	
	            slide(el, 'right');
	            window.sliderTimeout = setTimeout(autoSlide, delay);
	
	        };
	
	        setTimeout(autoSlide, delay);
	
	    }
		
		// If URI #id matches a slide #id, go to that slide and scroll the page to the slider.
		if (!current_slide && window.location.hash && el.q(window.location.hash)) {
			
			var current_slide = thisIndex(el.q(window.location.hash));
			slider_wrap.addClass('active');
			
		} 
		endSlide(el, current_slide || 0); // Start from (other than) the first slide
	    
	} else {
		
		el.children[0].addClass('active');

	}

	// Detect text direction
	el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
	    
    window.onkeyup = sliderKeyboard;
	
    return el;

}
