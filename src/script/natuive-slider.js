/* natUIve Slider */

// "use strict";

q('html').setAttribute('data-last_slide', '14045017000');
q('html').setAttribute('data-slide_duration', '0.5');

function sliderElement(e) {

    var el = eventElement(e);

    if (hasClass(el, 'slider-wrap')) {

        return el.querySelector('.slider');

    } else {

        var container = getClosest(el, '.slider-wrap');
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
	    var slider = sliderElement(e);

        if (touches && touches.length && !(hasClass(slider, 'vertical') && !getClosest(slider, '.full-window-wrap'))) { // Don't slide vertically if not full window

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;

            if ((hasClass(slider, 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.slider.lightbox')) {

                removeClass(q('html'), 'sliding_now');
                return;

            }

            e.preventDefault();

            if (Math.abs(delta) > 50) {

                if (!hasClass(q('html'), 'no_new_event_support')) {

                    var event = new Event((delta >= 50) ? 'swipeLeft' : 'swipeRight');
                    el.dispatchEvent(event);

                } else {

                    initScroll(e, -1 * delta);

                }

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

    q('html').setAttribute('data-last_slide', timeNow);

    slide(sliderElement(e), delta < 0 ? 'right' : 'left');

}

function mouseWheelHandler(e) {

	if (hasClass(q('html'), 'sliding_now')) {
		
		stopEvent(e); 
		return;
	
	}

	var el = eventElement(e);

    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
/* To do: stop generating events while sliding */	
    if (!hasClass(q('html'), 'sliding_now') && Math.abs(hasClass(sliderElement(e), 'vertical') ? deltaY : deltaX) > 50) {

        e.preventDefault();
        initScroll(e, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);

	}
    
}

function mouseEvents(el, toggle) {

    if (!('onwheel' in window) || (hasClass(el, 'vertical') && !getClosest(el, '.full-window-wrap'))) { // Check for mouse wheel and Don't slide vertically if not full window
	    
	    return;
	   
	}

    if (toggle == 'off') {

        el.parentNode.removeEventListener('wheel', mouseWheelHandler);

    } else {

        el.parentNode.addEventListener('wheel', mouseWheelHandler);
        childByClass(el.parentNode, 'slider-nav').addEventListener('wheel', function (e) {

	        // Scroll as usual instead of sliding

        });

    }

}

function endSlide (slider, index) {

    if (hasClass(slider, 'lightbox')) {
		
		populateLightbox(slider, index);
        
    }

	addClass(childByClass(slider.parentNode, 'slider-nav').children[index], 'active');
	document.onkeyup = sliderKeyboard;
    setTimeout(function () { 
	    removeClass(q('html'), 'sliding_now');
	    mouseEvents(slider); 
	}, q('html').getAttribute('data-slide_duration')/2);
	
}

function slide(el, method, index_number) {

    var slider = getClosest(el, '.slider-wrap').querySelector('.slider');

    if (getClosest(el, '.slider-wrap').querySelector('.slider').children.length < 2) {

		endSlide(el, 0);
        return el;

    }

    mouseEvents(el.parentNode, 'off');
    mouseEvents(el, 'off');
	document.onkeyup = function () { return false; };
	addClass(q('html'), 'sliding_now');

    if (window.sliderTimeout) {

        clearTimeout(window.sliderTimeout);

    }
	
	var index;
	var old_index;
	index = old_index = thisIndex(childByClass(slider.parentNode, 'slider-nav').querySelector('a.active'));

    if (method == 'index') {

		if (typeof index_number == 'undefined' || index_number == index) { /* Don't slide to current slide */

			endSlide(slider, index);
			return;

		}
        index = index_number;

    }

    if (method == 'right') {

        if (index == (slider.children.length-1)) {

            index = 0;

        } else {
	        
	        index++; 
	        
        }
        
    }

    if (method == 'left') {

        if (index === 0) {

            index = slider.children.length-1;

        } else {
	        
	        index--;
	        
        }

    }

    var offset_sign = '-'; // Slider offset depending on direction. '-' for LTR or '' (plus) for RTL. Vertical is always '-'

	// To do: auto-height slider to take the height of the taller element
	var computed_height;
	if (hasClass(slider, 'vertical')) {
		
		computed_height = getComputedStyle(slider.children[index]).height; // To do: get proper target slide height

	} else {
	
		computed_height = getComputedStyle(slider).height;
		if (slider.getAttribute('dir') == 'rtl') {
			
			offset_sign = '';
	
		}
		
	}

	slider.style.height = computed_height;

	addClass(slider.children[index], 'visible');

	var duration = (slider.getAttribute('data-duration') ? slider.getAttribute('data-duration') : q('html').getAttribute('data-slide_duration'));

	if (childByClass(slider.parentNode, 'slider-nav').querySelector('.active')) {

	    removeClass(childByClass(slider.parentNode, 'slider-nav').querySelector('.active'), 'active');

    }

    if (animationEndEvent) { // CSS transition-enabled browser...

		var translate_from, translate_to;
		
	    if (hasClass(slider, 'vertical')) {
		
		    translate_from = 'translate3d(0,' + ((index<old_index) ? -1 : 0) + '00%,0)';
		    translate_to = 'translate3d(0,' + ((index<old_index) ? 0 : -1) + '00%,0)';
		
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

		animate(slider, animation_code, duration, function slideEndHandler(e) { // On slide end

			removeClass(slider, 'sliding');
			if (slider.children[old_index]) {
	
				removeClass(slider.children[old_index], 'visible');
	
			}

			slider.style.transform = hasClass(slider, 'vertical') ? 'translateY(0)' : 'translate3d(' + offset_sign + index + '00%, 0, 0)';
			slider.style.height = 'auto';
			endSlide(slider, index);

        });

    } else { // ... or without animation on old browsers

		if (hasClass(slider, 'vertical')) {

			slider.style.top = offset_sign + index + '00%';
		
		} else {
			
			slider.style.left = offset_sign + index + '00%';

		}

		endSlide(slider, index);

    }

}

function sliderKeyboard(e) {

    e = e || window.event;

    if (typeof e == 'undefined' || hasClass(q('html'), 'sliding_now') || q('.slider.sliding')) {

        return;

    }

	var el = eventElement(e);
	var tag = el.tagName.toLowerCase();

	if (tag != 'input' && tag != 'textarea' && (el = q('.full-window-wrap .slider') || qa('.slider'))) {
		
		if (typeof el.length != 'undefined') { /* An array of sliders */
			
			el = el[0]; /* To do: choose the proper, visible in viewport slider, by its index */
			
		}

        switch (e.which) {

            case 38:
            	if (!hasClass(el,'vertical')) {
                	
                	return;

            	}
            case 37:
                slide(el, 'left');
            case 40:
            	if (!hasClass(el,'vertical')) {
                	
                	return;

            	}
            case 39:
                slide(el, 'right');
            default:
                return;

        }
		
	}

}

function makeSlider(el, current_slide) {

    addClass(el, 'slider');

	if (hasClass(el, 'full-window')) {
		
		openFullWindow(el);
		
	}

	var container = el.parentNode;

	if (!hasClass(container, 'slider-wrap')) {

	    container = wrap(el).parentNode;
		addClass(container, 'slider-wrap');
	    el = container.querySelector('.slider');
	    transferClass(el, container, 'vertical');
        transferClass(el, container, 'wrap');
    
    }
	
    container.insertAdjacentHTML(hasClass(el, 'toptabs') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
    container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left"></a><a class="slider-arrow right"></a>');

    // Generate controls

    for (var i = 0; i < el.children.length; i++) {

        		// IE8 counts comments as children and produces an empty slide.			
//         		if ( el.children[i].nodeName == '#comment' ) {	}

        if (el.children[i].querySelector('.tab-title')) {

            var slider_nav = el.parentNode.querySelector('.slider-nav');
            addClass(el.parentNode, 'tabs');
            addClass(slider_nav, 'row');
            transferClass(el.parentNode, slider_nav, 'wrap');
            slider_nav.insertAdjacentHTML('beforeend', (!i ? '<a class=active>' : '<a>') + el.children[i].querySelector('.tab-title').innerHTML + '</a>');
            if (hasClass(el, 'vertical')) {
	            
	            addClass(el.parentNode, 'vertical-tabs');
	            
            }

        } else {

            container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', (!i ? '<a class=active>' : '<a>') + (i + 1) + '</a>');

        }

        container.querySelector('.slider-nav').lastChild.onclick = function(e) {
			
			/* To fix: error when clicking during a slide */
            slide(eventElement(e), 'index', thisIndex(eventElement(e)));

        };

    }

    container.querySelector('.slider-arrow').onclick = function(e) {

        slide(eventElement(e), 'left');

    };

    container.querySelector('.slider-arrow.right').onclick = function(e) {

        slide(eventElement(e), 'right');

    };

    addClass(el.children[0], 'visible');

    document.onkeyup = sliderKeyboard;

    mouseEvents(el);

    if (touchSupport()) {

        swipeEvents(el.parentNode);

        el.parentNode.addEventListener('swipeLeft', function(e) {

            var el = sliderElement(e);
            slide(el, 'right');

        });

        el.parentNode.addEventListener('swipeRight', function(e) {

            var el = sliderElement(e);
            slide(el, 'left');

        });
        
        forEach(el.querySelectorAll('input[type=range]'), function (el) {
	        
	        el.ontouchmove = function(e) {

				e.stopPropagation();
		        
	        };
	        
        });

    }

    if (el.getAttribute('data-autoslide') !== null) { // auto slide

		var delay = el.getAttribute('data-autoslide');
		delay = delay.length > 0 ? (1000 * el.getAttribute('data-autoslide')) : 4000;
        var autoSlide = function() {

            slide(el, 'right');
            window.sliderTimeout = setTimeout(autoSlide, delay);

        };

        setTimeout(autoSlide, delay);

    }

	if (window.getComputedStyle) { // Detect direction

        el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));

    }
    
    if (current_slide) {

		slide(el, 'index', current_slide);
		
    }

    return el;

}

/* Start */

/* Initialise JS extras: create arrows/numbers navigation */
forEach('.slider', function(el) {

    makeSlider(el);

});

