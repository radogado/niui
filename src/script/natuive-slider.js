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
q('html').setAttribute('data-last_slide', 14045017000);
// q('html').dataset.slide_duration = 0.5;
q('html').setAttribute('data-slide_duration', 0.5);

function sliderElement(e) { // Get the active slider instance

	if (q('.n-sldr:focus-within')) {
		
		return q('.n-sldr:focus-within').querySelector('.slider');

	}

    var el = e.target;

    if (hasClass(el, 'n-sldr')) {

        return el.querySelector('.slider');

    } else {

        var container = closest(el, '.n-sldr');
        return container && container.querySelector('.slider');

    }

}

/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

function swipeEvents(el) {

    var startX, startY;

    el.addEventListener('touchstart', touchStart);

    function touchStart(e) {

		if (hasClass(q('html'), 'sliding_now')) {

			endSlide(sliderElement(e));
			return;

		}

        var touches = e.touches;
        if (touches && touches.length) {

            startX = touches[0].pageX;
            startY = touches[0].pageY;
            el.addEventListener('touchmove', touchMove);

//             addClass(q('html'), 'sliding_now');

        }

    }

    function touchMove(e) {
	    
        var touches = e.touches;
// 	    var slider = sliderElement(e);

        if (touches && touches.length && !(hasClass(el, 'vertical') && !closest(el, '.n-ovrl'))) { // Don't slide vertically if not full window

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;

            if ((hasClass(el, 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.slider.lightbox')) {

                removeClass(q('html'), 'sliding_now');
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
    if ((timeNow - q('html').getAttribute('data-last_slide')) < q('html').getAttribute('data-slide_duration')*2000 || hasClass(q('html'), 'sliding_now')) {

        stopEvent(e);
		return;

    }

// 	q('html').dataset.last_slide = timeNow;
	q('html').setAttribute('data-last_slide', timeNow);

    slide(sliderElement(e), delta < 0 ? 'right' : 'left');

}

function mouseWheelHandler(e) {

	if (hasClass(q('html'), 'sliding_now')) {
		
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
    if (!hasClass(q('html'), 'sliding_now') && Math.abs(hasClass(sliderElement(e), 'vertical') ? deltaY : deltaX) > 50) {

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

function endSlide (slider, index) {

    if (hasClass(slider, 'lightbox')) {
		
		populateLightbox(slider, index);
        
    }

	var slider_wrap = closest(slider, '.n-sldr');
	
	if (getSliderNav(slider_wrap)) { // Multiple slides? // To do: get the proper slider nav, if it's detached

		addClass(getSliderNav(slider_wrap).children[index], 'active');
	
	}
    slider.style.cssText = '';

	addClass(slider.children[index], 'active');

    if (!hasClass(slider, 'vertical')) {
	    
	    slider.style.marginLeft = -100*index + '%';
	   
	}

	slider.style.pointerEvents = '';

	window.onkeyup = sliderKeyboard;
    setTimeout(function () {

	    removeClass(q('html'), 'sliding_now');
	    mouseEvents(slider);

	    // Make this slider active
	
		if (q('.n-sldr.active')) {
			
			removeClass(q('.n-sldr.active'), 'active')
			
		}
	
		addClass(closest(slider, '.n-sldr'), 'active');

	}, q('html').slide_duration/2);
	
}

function slide(el, method, index_number) {

	if (hasClass(q('html'), 'sliding_now')) {
		
		return;
	
	}

    var slider = closest(el, '.n-sldr').querySelector('.slider');

    if (slider.children.length < 2) {

		endSlide(el, 0);
        return el;

    }
    
	var slider_wrap = closest(el, '.n-sldr');

    mouseEvents(slider_wrap, 'off');
    slider.style.pointerEvents = 'none'; // Speed up animation
    mouseEvents(el, 'off');
	document.onkeyup = function () { return false; };
// 	addClass(q('html'), 'sliding_now'); // iOS errors

    if (window.sliderTimeout) {

        clearTimeout(window.sliderTimeout);

    }
	
	var index;
	var old_index;
	var slider_wrap = closest(slider, '.n-sldr');
	var slider_nav = getSliderNav(slider_wrap);
	index = old_index = thisIndex(slider_nav.querySelector('a.active'));

    if (method === 'index') {

		if (typeof index_number === 'undefined' || index_number === index || !slider.querySelector('.active')) { /* Don't slide to current slide */
			
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

	if (hasClass(slider, 'vertical')) {
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

	if (slider_nav.querySelector('.active')) {

	    removeClass(slider_nav.querySelector('.active'), 'active');

    }

	var duration = slider.getAttribute('data-duration') ? slider.getAttribute('data-duration') : q('html').getAttribute('data-slide_duration');

	addClass(target_slide, 'active');

	var translate_from, translate_to;
	
    if (hasClass(slider, 'vertical')) {

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

	if (hasClass(slider, 'fade')) {

		animation_code = '0% { opacity: 1; transform: ' + translate_from + ' } 49% { transform: ' + translate_from + ' } 51% { opacity: 0; transform:' + translate_to + ' } 100% { opacity: 1; transform:' + translate_to + ' }';
	
	} else {
		
		animation_code = '0% { transform: ' + translate_from + '; } 100% { transform: ' + translate_to + '; }';

	}

	addClass(slider, 'sliding');

	slider.style.margin = 0;

	animate(slider, animation_code, duration, function slideEndHandler(e) { // On slide end

		removeClass(slider, 'sliding');
		removeClass(slider.children[old_index], 'active');
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

function sliderKeyboard(e) {

    if (typeof e === 'undefined' || hasClass(q('html'), 'sliding_now') || q('.slider.sliding') || 
    	(q('.n-ovrl') && !q('.n-ovrl .n-sldr.active')) // There is an overlay open and it doesn't have a slider in it
		) {

        return;

    }

	var el = e.target;

	var tag = el.tagName.toLowerCase();

	function shouldNotSlideVertically() {
		
		if (q('.n-ovrl')) { return false; }
		return !hasClass(el,'vertical') || window.innerHeight < q('body').scrollHeight;
		
	}

	if (tag !== 'input' && tag !== 'textarea' && (el = q('.n-ovrl .slider') || q('.n-sldr.active .slider') || q('.slider'))) { // Priority: full window slider, active slider, first slider
        switch (e.which) {

            case 38:
            	if (shouldNotSlideVertically()) { // Page can be scrolled by the arrow key so don't slide
                	
                	return;

            	}
            case 37:
                slide(el, 'left'); 
                break;
            case 40:
            	if (shouldNotSlideVertically()) {
                	
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
	
	addEventHandler(el, 'touchstart', function (e) { e.stopPropagation(); return false; });
	
}

function makeSlider(el, current_slide) {

	if (hasClass(el.parentNode, 'n-sldr') || hasClass(el.parentNode.parentNode, 'n-sldr')) { // Already created
		
		return;
		
	}
	
    addClass(el, 'slider');

	if (hasClass(el, 'full-window')) {
		
		openFullWindow(el);
		
	}

	var container = el.parentNode;

	if (!hasClass(container, 'n-sldr')) {

	    container = wrap(el).parentNode;
		addClass(container, 'n-sldr');
	    el = container.querySelector('.slider');
		
		if (hasClass(el, 'pad')) {
			
		    container = wrap(el).parentNode;
			addClass(container, 'pad');
		    container = container.parentNode;
		    el = container.querySelector('.slider');

		}
		
	    transferClass(el, container, 'vertical');
        transferClass(el, container, 'wrap');
        transferClass(el, container, 'top');
        transferClass(el, container, 'right');
    
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
	
		var slider_wrap = closest(el, '.n-sldr');
	
	    // Generate controls

	    for (var i = 0; i < el.children.length; i++) {
	
	        if (hasClass(el, 'tabs')) {
	
	            addClass(slider_wrap, 'tabs');
	            addClass(slider_nav, 'row');
	            transferClass(slider_wrap, slider_nav, 'wrap');
	            transferClass(el, slider_wrap, 'vertical');
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
	        
	        if (el.children[i].querySelector('video')) { // Because tabbing scrolls to video and breaks the slider. To do: allow focusing video when it's in the active slide.
	        
		        el.children[i].querySelector('video').setAttribute('tabindex', -1);
	        
	        }
	        
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
	    forEach(el.querySelectorAll('input[type=range]'), function (el) {
	        
	        el.ontouchmove = function(e) {
	
				e.stopPropagation();
				removeClass(q('html'), 'sliding_now');
		        
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
		if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
			
			var current_slide = thisIndex(el.querySelector(window.location.hash));
			addClass(slider_wrap, 'active');
			
		} 
		endSlide(el, current_slide || 0); // Start from (other than) the first slide
	    
	} else {
		
		addClass(el.children[0], 'active');

	}

	// Detect text direction
	el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
	    
    window.onkeyup = sliderKeyboard;
	
    return el;

}
