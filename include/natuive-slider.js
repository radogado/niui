/* natUIve Slider */
var new_event_support = 1;

try { // Android Browser etc?

    test_event = new Event('t');

} catch (err) {

    new_event_support = 0;

}

function sliderElement(e) {

    el = eventElement(e);

    if (hasClass(el, 'slider-wrap')) {

        return el.querySelector('.slider');

    } else {

        container = parentByClass(el, 'slider-wrap');
        return container && container.querySelector('.slider');

    }

}

/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

var last_animation = 0;
var sliding = 0;
swipeEvents = function(el) {

    var startX, startY;

    el.addEventListener('touchstart', touchStart);

    function touchStart(e) {

		if (sliding) {
			
			e.preventDefault();
			return;

		}

        var touches = e.touches;
        if (touches && touches.length) {

            startX = touches[0].pageX;
            startY = touches[0].pageY;

            el.addEventListener('touchmove', touchMove);

        }

    }

    function touchMove(e) {

        var touches = e.touches;
        if (touches && touches.length) {

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;

            if ((hasClass(sliderElement(e), 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.slider.lightbox')) {

                return;

            }

            e.preventDefault();

            if (Math.abs(delta) > 50) {

                if (new_event_support) {

                    var event = new Event((delta >= 50) ? 'swipeLeft' : 'swipeRight');
                    el.dispatchEvent(event);

                } else {

                    initScroll(e, -1 * delta);

                }

                el.removeEventListener('touchmove', touchMove);

            }
            
        }

    }

};

initScroll = function(e, delta) {

    deltaOfInterest = delta;
    timeNow = new Date().getTime();

    // Cancel scroll if currently animating or within quiet period
    if ((timeNow - last_animation) < 800 || sliding) {

        e.preventDefault();
        return;

    }

    last_animation = timeNow;

    slide(sliderElement(e), deltaOfInterest < 0 ? 'right' : 'left');

}

mouseWheelHandler = function(e) {

    deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail;
    deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;

    if (Math.abs(hasClass(sliderElement(e), 'vertical') ? deltaY : deltaX) > 50) { // Why no FF?

        e.preventDefault();
        initScroll(e, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);

    }

}

function mouseEvents(el, toggle) {

    if (!('onwheel' in window)) return;

    if (toggle == 'off') {

        el.parentNode.removeEventListener('wheel', mouseWheelHandler);

    } else {

        el.parentNode.addEventListener('wheel', mouseWheelHandler);
        el.parentNode.querySelector('.slider-nav').addEventListener('wheel', function (e) {

	        // Scroll as usual instead of sliding

        });

    }

}

function endSlide (slider, index) {
	
    if (hasClass(slider, 'lightbox')) {
		
		populateLightbox(slider, index);
        
    }
    
    sliding = 0;
	addClass(slider.parentNode.querySelector('.slider-nav').children[index], 'active');
    mouseEvents(slider);
	document.onkeyup = sliderKeyboard;
   	removeClass(q('html'), 'no-hover');
	
}

var	prefix = animationEvent == 'webkitAnimationEnd' ? '-webkit-' : ''; 
var slide_duration = 400;

function slide(el, method, index_number) {

	sliding = 1;
    mouseEvents(el.parentNode, 'off');

    if (window.sliderTimeout) {

        clearTimeout(window.sliderTimeout);

    }

    var slider = parentByClass(el, 'slider-wrap').querySelector('.slider');

	index = old_index = thisIndex(slider.parentNode.querySelector('.slider-nav a.active'));

    if (method == 'index') {

		if (typeof index_number == 'undefined' || index_number == index) { /* Don't slide to current slide */

			endSlide(slider, index);
			return;

		}
        index = index_number;

    }

    if (method == 'right') {

        if (index == (slider.children.length - 1)) {

            index = 0;

        } else {
	        
	        index++; 
	        
        }
        
    }

    if (method == 'left') {

        if (index == 0) {

            index = slider.children.length-1;

        } else {
	        
	        index--;
	        
        }

    }

	if (!hasClass(slider, 'vertical')) {
		
		slider.style.cssText = 'height: ' + slider.offsetHeight + 'px !important';
	
	}

    removeClass(slider.parentNode.querySelector('.slider-nav .active'), 'active');

    if (animationEvent) { // CSS transition-enabled browser...

	    if (hasClass(slider, 'vertical')) {
		
		    translate_from = 'translate3d(0,' + ((index<old_index) ? -1 : 0) + '00%,0)';
		    translate_to = 'translate3d(0,' + ((index<old_index) ? 0 : -1) + '00%,0)';
		
		} else {
			
		    translate_from = 'translate3d(' + ((index<old_index) ? -1 : 0) + '00%,0,0)';
		    translate_to = 'translate3d(' + ((index<old_index) ? 0 : -1) + '00%,0,0)';
			
		}
	    
		if (!index_number) {
	
			addClass(q('html'), 'no-hover');
		
		}

		var styles = document.createElement('style');
		styles.innerHTML = '@' + prefix + 'keyframes sliding { from { ' + prefix + 'transform: ' + translate_from + '; } to { ' + prefix + 'transform: ' + translate_to + '; }}';
		document.getElementsByTagName('head')[0].appendChild(styles);
		addClass(styles, 'sliding-style');
		addClass(slider.children[index], 'visible');
		addClass(slider, 'sliding');

        slider.addEventListener(animationEvent, function(e) { // On slide end

            slider.removeEventListener(animationEvent, arguments.callee);

			removeClass(slider.children[old_index], 'visible');
			removeClass(slider,'sliding');
			slider.style.cssText = prefix + 'transform: ' + (hasClass(slider, 'vertical') ? 'translateY' : 'translateX') + '(-' + index + '00%);';
			q('.sliding-style').outerHTML = '';
			
			endSlide(slider, index);

        }, false);

    } else { // ... or without animation on old browsers

		slider.style.cssText = (hasClass(slider, 'vertical') ? 'top' : 'left') + ': -' + index + '00%';

		endSlide(slider, index);

    }

}

function sliderKeyboard(e) {

    e = e || window.event;

    if (typeof e == 'undefined' || sliding) {

        return;

    }

    el = e.target || e.srcElement;

    if (q('.slider')) {

        tag = el.tagName.toLowerCase();
        if (tag != 'input' && tag != 'textarea') {

            el = q('.slider.full-window') || q('.slider.lightbox') || q('.slider');

            switch (e.which) {

                case 38:
                	if (!hasClass(el,'vertical')) {
	                	
	                	return;

                	}
                case 37:
                    slide(el, 'left');
                    break;
                case 40:
                	if (!hasClass(el,'vertical')) {
	                	
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

};

function makeSlider(el, current_slide) {

    if (el.children.length < 2) {

        return el;

    }

    addClass(el, 'slider');

	if (hasClass(el, 'full-window')) { // To do: move nodes properly; this loses event handlers
		
		openFullWindow(el);
		
	}

    container = wrap(el).parentNode;
	addClass(container, 'slider-wrap');
    el = container.querySelector('.slider');
    transferClass(el, container, 'vertical');
	
    container.insertAdjacentHTML(hasClass(el, 'toptabs') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
    container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left"></a><a class="slider-arrow right"></a>');
	
	
    // Generate controls

    for (var i = 0; i < el.children.length; i++) {

        		// IE8 counts comments as children and produces an empty slide.			
//         		if ( el.children[i].nodeName == '#comment' ) {	}

        if (el.children[i].querySelector('.tab')) {

            slider_nav = el.parentNode.querySelector('.slider-nav');
            addClass(el.parentNode, 'tabs');
            addClass(slider_nav, 'row');
            slider_nav.insertAdjacentHTML('beforeend', (!i ? '<a class=active>' : '<a>') + el.children[i].querySelector('.tab').innerHTML + '</a>');
            if (hasClass(el, 'vertical')) {
	            
	            addClass(el.parentNode, 'vertical-tabs');
	            
            }

        } else {

            container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', (!i ? '<a class=active>' : '<a>') + (i + 1) + '</a>');

        }

        container.querySelector('.slider-nav').lastChild.onclick = function(e) {
			
            slide(eventElement(e), 'index', thisIndex(eventElement(e)));

        };

    }

    container.querySelector('.slider-arrow').onclick = function(e) {

        slide(eventElement(e), 'left');

    }

    container.querySelector('.slider-arrow.right').onclick = function(e) {

        slide(eventElement(e), 'right');

    }

    addClass(el.children[0], 'visible');

    if (current_slide) {

		slide(el, 'index', current_slide);
		
    }

    document.onkeyup = sliderKeyboard;

    mouseEvents(el);

    if ('ontouchstart' in window) {

        swipeEvents(el.parentNode);

        el.parentNode.addEventListener('swipeLeft', function(e) {

            el = sliderElement(e);
            slide(el, 'right');

        });

        el.parentNode.addEventListener('swipeRight', function(e) {

            el = sliderElement(e);
            slide(el, 'left');

        });

    }

    if (el.getAttribute('data-autoslide')) { // auto slide

        function autoSlide() {

            slide(el, 'right');
            window.sliderTimeout = setTimeout(autoSlide, 1000 * el.getAttribute('data-autoslide'));

        }

        setTimeout(autoSlide, 1000 * el.getAttribute('data-autoslide'));

    }
	
    return el;

}

/* Start */

/* Initialise JS extras: create arrows/numbers navigation */
forEach('.slider', function(el) {

    makeSlider(el);

});
