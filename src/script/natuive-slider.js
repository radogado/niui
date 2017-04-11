/* natUIve Slider */

// "use strict";

q('html').setAttribute('data-last_slide', '14045017000');
q('html').setAttribute('data-slide_duration', '0.5');

function sliderElement(e) {

    var el = eventElement(e);

    if (hasClass(el, 'slider-wrap')) {

        return el.querySelector('.slider');

    } else {

        var container = closest(el, '.slider-wrap');
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

        if (touches && touches.length && !(hasClass(el, 'vertical') && !closest(el, '.full-window-wrap'))) { // Don't slide vertically if not full window

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;

            if ((hasClass(el, 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.slider.lightbox')) {

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

    if (!('onwheel' in window) || (hasClass(el, 'vertical') && !closest(el, '.full-window-wrap'))) { // Check for mouse wheel and Don't slide vertically if not full window
	    
	    return;
	   
	}

	var slider_wrap = closest(el, '.slider-wrap');

    if (toggle === 'off') {

        slider_wrap.removeEventListener('wheel', mouseWheelHandler);

    } else {

        slider_wrap.addEventListener('wheel', mouseWheelHandler);
        childByClass(slider_wrap, 'slider-nav').addEventListener('wheel', function (e) {

	        // Scroll as usual instead of sliding

        });

    }

}

function endSlide (slider, index) {

    if (hasClass(slider, 'lightbox')) {
		
		populateLightbox(slider, index);
        
    }
	
	var slider_wrap = closest(slider, '.slider-wrap');
	
	addClass(childByClass(slider_wrap, 'slider-nav').children[index], 'active');
    slider.style.cssText = '';

    if (!hasClass(slider, 'vertical')) {
	    
	    slider.style.marginLeft = -100*index + '%';
	   
	}

	slider.style.pointerEvents = '';

	window.onkeyup = sliderKeyboard;
    setTimeout(function () {

	    removeClass(q('html'), 'sliding_now');
	    mouseEvents(slider);

	}, q('html').getAttribute('data-slide_duration')/2);
	
}

function slide(el, method, index_number) {

	if (hasClass(q('html'), 'sliding_now')) {
		
		return;
	
	}

    var slider = closest(el, '.slider-wrap').querySelector('.slider');

    if (closest(el, '.slider-wrap').querySelector('.slider').children.length < 2) {

		endSlide(el, 0);
        return el;

    }

	var slider_wrap = closest(el, '.slider-wrap');

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
	var slider_wrap = closest(slider, '.slider-wrap');
	index = old_index = thisIndex(childByClass(slider_wrap, 'slider-nav').querySelector('a.active'));

    if (method === 'index') {

		if (typeof index_number === 'undefined' || index_number === index) { /* Don't slide to current slide */

			endSlide(slider, index);
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
	addClass(slider.children[index], 'visible');

	if (hasClass(slider, 'vertical')) {
		
		computed_height = getComputedStyle(slider.children[index]).height; // To do: get proper target slide height
		computed_height_old = getComputedStyle(slider.children[old_index]).height; // To do: get proper target slide height

	} else {
	
		computed_height = getComputedStyle(slider).height;
		if (slider.getAttribute('dir') === 'rtl') {
			
			offset_sign = '';
	
		}
		
	}

	slider.style.height = computed_height;

	var duration = (slider.getAttribute('data-duration') ? slider.getAttribute('data-duration') : q('html').getAttribute('data-slide_duration'));

	if (childByClass(slider_wrap, 'slider-nav').querySelector('.active')) {

	    removeClass(childByClass(slider_wrap, 'slider-nav').querySelector('.active'), 'active');

    }

    if (animationSupport()) { // CSS animation-enabled browser...

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
			if (slider.children[old_index]) {
	
				removeClass(slider.children[old_index], 'visible');
			    slider.children[old_index].style.transition = '';
			    slider.children[old_index].style.opacity = '';
	
			}

// 			slider.style.transform = hasClass(slider, 'vertical') ? 'translate3d(0, 0, 0)' : 'translate3d(' + offset_sign + index + '00%, 0, 0)';
			slider.style.height = '';
			endSlide(slider, index);

        });

    } else { // ... or without animation on old browsers

		slider.style.transition = 'all ' + duration + 's ease-in-out';

		removeClass(slider.children[old_index], 'visible');
		
		if (hasClass(slider, 'vertical')) {
			
			if (q('.full-window-wrap')) {
				
				forEach(slider.children, function (el) {
					
					addClass(el, 'visible');
					
				});
			
			}
			
			slider.style.top = offset_sign + index + '00%';
		
		} else {
			
			slider.style.left = offset_sign + index + '00%';

		}

		endSlide(slider, index);

    }

}

function sliderKeyboard(e) {

    e = e || window.event;

    if (typeof e === 'undefined' || hasClass(q('html'), 'sliding_now') || q('.slider.sliding')) {

        return;

    }

	var el = eventElement(e);
	var tag = el.tagName.toLowerCase();

	function shouldNotSlideVertically() {
		
		if (q('.full-window-wrap')) { return false; }
		return !hasClass(el,'vertical') || window.innerHeight < q('body').scrollHeight;
		
	}

	if (tag != 'input' && tag != 'textarea' && (el = q('.full-window-wrap .slider') || qa('.slider'))) {
		
		if (typeof el.length != 'undefined') { /* An array of sliders */
			
			el = el[0]; /* To do: choose the proper slide, currently visible in viewport, by its index */
			
		}
		
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

	if (hasClass(el.parentNode, 'slider-wrap') || hasClass(el.parentNode.parentNode, 'slider-wrap')) { // Already created
		
		return;
		
	}
	
	if (hasClass(q('html'), 'no_new_event_support')) { // Old browser
		
		addClass(el, 'overthrow');
		loadScriptFile(scripts_location + 'overthrow.js');

		return;
	
	}
	
    addClass(el, 'slider');

	if (hasClass(el, 'full-window')) {
		
		openFullWindow(el);
		
	}

	var container = el.parentNode;

	if (!hasClass(container, 'slider-wrap')) {

	    container = wrap(el).parentNode;
		addClass(container, 'slider-wrap');
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
	
    container.insertAdjacentHTML(hasClass(container, 'top') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
    container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left"></a><a class="slider-arrow right"></a>');

	var slider_wrap = closest(el, '.slider-wrap');

    // Generate controls

    for (var i = 0; i < el.children.length; i++) {

        		// IE8 counts comments as children and produces an empty slide.			
//         		if ( el.children[i].nodeName === '#comment' ) {	}

        if (hasClass(el, 'tabs')) {

            var slider_nav = slider_wrap.querySelector('.slider-nav');
            addClass(slider_wrap, 'tabs');
            addClass(slider_nav, 'row');
            transferClass(slider_wrap, slider_nav, 'wrap');
            var tab_title = el.children[i].getAttribute('data-tab-title') || (el.children[i].querySelector('.tab-title') ? el.children[i].querySelector('.tab-title').innerHTML : i+1);
            slider_nav.insertAdjacentHTML('beforeend', (!i ? '<a class=active>' : '<a>') + tab_title + '</a>');
            if (hasClass(el, 'vertical')) {
	            
	            addClass(slider_wrap, 'vertical');
	            
            }

        } else {

            container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', (!i ? '<a class=active>' : '<a>') + (i + 1) + '</a>');

        }

		container.querySelector('.slider-nav').lastChild.onclick = function(e) {
			
            slide(eventElement(e), 'index', thisIndex(eventElement(e)));

        };
        
        cancelTouchEvent(container.querySelector('.slider-nav').lastChild);

    }

    container.querySelector('.slider-arrow').onclick = function(e) {

        slide(eventElement(e), 'left');

    };
    
    cancelTouchEvent(container.querySelector('.slider-arrow'));

    container.querySelector('.slider-arrow.right').onclick = function(e) {

        slide(eventElement(e), 'right');

    };

    cancelTouchEvent(container.querySelector('.slider-arrow.right'));

    addClass(el.children[0], 'visible');

    window.onkeyup = sliderKeyboard;

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
    
    forEach(el.querySelectorAll('input[type=range]'), function (el) {
        
        el.ontouchmove = function(e) {

			e.stopPropagation();
			removeClass(q('html'), 'sliding_now');
	        
        };
        
    });

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
