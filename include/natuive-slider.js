/* natUIve by rado.bg */

var scrollTimer = null;
var slider;
var original_scroll = 0;

function scrollSlider (e) {

	var event = e || window.event;
	el = event.target || event.srcElement;
	if ( slider != el ) { // on switching to another slider
		original_scroll = el.scrollLeft; 
	}
	slider = el;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
    
        slide (event, 'snap');

    }, 50);

};

function moveIndex () {

	removeClass ( slider.parentNode.querySelector('.slider-nav a.active'), 'active' );
	var index = Math.round( slider.scrollLeft / slider.offsetWidth ) + 1;

	if ( slider.parentNode.querySelector('.slider-nav').childNodes[index-1] ) {
		addClass( slider.parentNode.querySelector('.slider-nav').childNodes[index-1], 'active');
	}
	
}

function slideEnd () {

	original_scroll = slider.scrollLeft;
	moveIndex();

	document.onkeyup = sliderKeyboard;

	forEach('.slider', function(el, i) {

		el.onscroll = scrollSlider;
		
	});
	
}

function slide ( e, target ) {

	forEach('.slider', function(el, i) {

		el.onscroll = null;
		
	});
	
	var event = e || window.event; 

	if ( typeof event.srcElement == 'unknown' ) { return; } // IE8
	el = event.target || event.srcElement;

	stopEvent(event);

	var change = 0;

	if (target == 'index') {
			
		slider = el.parentNode.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = thisIndex(el) * slider.offsetWidth - start;

	}
	
	if ( target == 'arrow') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		if ( hasClass(el, 'left') ) {
			change = slider.scrollLeft - slider.offsetWidth - start;
		} else {
			change = slider.scrollLeft + slider.offsetWidth - start;
		}

	}
	
	if ( target == 'snap') {

		slider = el;

		if (slider.scrollLeft > original_scroll) { 
			change = slider.offsetWidth - slider.scrollLeft % slider.offsetWidth;
		} else {
			change = slider.scrollLeft % slider.offsetWidth - slider.offsetWidth;
			change = -1 * (slider.offsetWidth + change);
		}
		
		if ( original_scroll == slider.scrollLeft ) change = 0;
				
		start = slider.scrollLeft;
		
	}

	if ( !change ) {
		slideEnd();
		return;
		}

	currentTime = 0,
	increment = 20;
	duration = 400;
	
	var animateScroll = function() {
		// increment the time
		currentTime += increment;
		// find the value with the quadratic in-out easing function
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		// slide
		slider.scrollLeft = val;
		// do the animation unless its over
		if( (currentTime < duration) ) {
			requestAnimFrame(animateScroll);
		} else {

			if (slideEnd && typeof(slideEnd) === 'function') { // the animation is done so let's callback
				slideEnd();
			}

		}
	};
	animateScroll();

}

function sliderKeyboard (e) {


/*
	slider = document.querySelector('.slider'); // Move slider #1; to do: select nearest slider
	
	var event = e || window.event;
	stopEvent(event);
    if (event.keyCode == 37) { // left
    	
	document.onkeyup = function (e) { return false; };
		slide(e, 'left');

    }
    if (event.keyCode == 39) { // right

	document.onkeyup = function (e) { return false; };
		slide(e, 'right');
		
    }
*/

};

function makeSlider (el) {
	
	addClass (el, 'slider');
	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML.replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	
	// Get scrollbar width and hide it by reducing the .slider-container height proportionally

	el.style.overflowX = 'hidden';
	height_scroll = el.offsetHeight;
	el.style.overflowX = 'scroll';
	height_scroll = el.offsetHeight - height_scroll;
	
	// Generate controls

	for (var i = 0; i < el.children.length; i++) {
		
		if ( el.children[i].querySelector('.thumbnail') ) {

			slider_nav = el.parentNode.querySelector('.slider-nav');
			addClass( slider_nav, 'thumbnails' );
			addClass( slider_nav, 'row' );
			slider_nav.insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + el.children[i].querySelector('.thumbnail').innerHTML + '</a>' );
			slider_nav.style.marginTop = (-1 * height_scroll) + 'px';
			
						
		} else {
			
			container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + (i + 1) + '</a>');

		}
		
		container.querySelector('.slider-nav').lastChild.onclick = function (e) {

			slide(e, 'index');

		};

	}

	container.querySelector('.slider-arrow.left').onclick = container.querySelector('.slider-arrow.right').onclick = function (e) {

		slide(e, 'arrow');

	}
	
	el.onscroll = scrollSlider;
	
	return el;	
	
}

addEventHandler ( window, 'load', function() {

	document.onkeyup = sliderKeyboard;
	
	/* Initialise JS extras: create arrows/numbers navigation */
	forEach('.slider', function(el, i) {

		makeSlider(el);
		
	});
	
	slider = document.querySelector('.slider');
	
	window.onresize = function () { 
		
		forEach('.slider', function (el,i) {
			el.scrollLeft = 0;
			moveIndex ();
		});
		
	}
	
});
