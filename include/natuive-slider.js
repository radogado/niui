/* natUIve Slider */

var scrollTimer = null;
var slider;
var original_scroll = 0;
var slider_animation = 0;
var current_scroll = 0;
var	currentTime = 0;
var	increment = 20;
var	duration = 400;
var slider_change = 0;

function scrollSlider (e) {

	if ( navigator.userAgent.indexOf('Android') != -1 )	{ // Fix Android snapping
		
		return;

	}

	var event = e || window.event;
	el = event.target || event.srcElement;

	stopEvent(e);

	if ( slider_animation ) return;

	slider = el;

	original_scroll = el.getAttribute('data-original-scroll');

    clearTimeout(scrollTimer);
    current_scroll = slider.scrollLeft;

    scrollTimer = setTimeout( function(e) {
		
		if ( current_scroll == slider.scrollLeft ) { /* If all scroll, including inertia, has ended */

			if ( navigator.userAgent.indexOf('Android') != -1 )	{ 
		
				slider.style.overflow = 'hidden';
			
			}
			
			slide (event, 'snap');
		
		}

    }, 50);

};

function moveIndex (i) {

	removeClass ( slider.parentNode.querySelector('.slider-nav a.active'), 'active' );
	var index = (typeof i == 'undefined' ) ? (Math.round( slider.scrollLeft / slider.offsetWidth )) : (i);

	if ( slider.parentNode.querySelector('.slider-nav').children[index] ) {
		addClass( slider.parentNode.querySelector('.slider-nav').children[index], 'active');
	}
	
}

function slideEnd () {

	original_scroll = slider.scrollLeft;
	slider.setAttribute('data-original-scroll', original_scroll);

	moveIndex();

	slider_animation = 0;

	forEach('.slider', function(el, i) {

		el.onscroll = scrollSlider;
		
	});

	if ( navigator.userAgent.indexOf('Android') != -1 )	{ 

		slider.style.overflow = 'scroll';
	
	}

}

function animateScroll () {
	// increment the time
	currentTime += increment;
	// find the value with the quadratic in-out easing function
	var val = Math.easeInOutQuad(currentTime, start, slider_change, duration);
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
}

function slide ( e, method ) {

	if (slider_animation) return;

	forEach('.slider', function(el, i) {

		el.onscroll = null;
		
	});
	
	var event = e || window.event; 

	if ( typeof event.srcElement == 'unknown' ) {  // IE8
		
		slideEnd(); 
		return; 
	
	}

	el = event.target || event.srcElement;

	stopEvent(event);

	if (typeof el == 'undefined' ) { 

		el = e; 

	}
	
	slider_change = 0;

	if ( method == 'index' ) {
		
		slider = el.parentNode.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		slider_change = slider.children[thisIndex(el)].offsetLeft - start;

	}
	
	if ( method == 'arrow') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		
		var current_index = thisIndex(slider.parentNode.querySelector('a.active'));

		if ( hasClass(el, 'left') ) { // left arrow
			
			i = 0;

			while ( i < slider.children.length ) {
				
				el = slider.children[i++];
				if ( el.offsetLeft >= slider.scrollLeft ) {

					if (i>1) {
						slider_change = -1 * ( slider.scrollLeft - el.previousSibling.offsetLeft );
					}
					break;
				
				}
				
			}

		} else { // right arrow

			i = 0;
			
			while ( i < slider.children.length ) {
				
				el = slider.children[i++];
				if ( el.offsetLeft >= slider.scrollLeft ) {

					slider_change = el.offsetLeft - slider.scrollLeft;
					break;
				
				}
				
			}
			
			if (!slider_change) {
				
				slider_change = (slider.children.length-1 > current_index) ? slider.children[ current_index+1 ].offsetLeft - slider.children[ current_index ].offsetLeft : 0;

			}

		}

	}
	
	if ( method == 'snap') {

		slider = el;
		start = slider.scrollLeft;

		if (slider.scrollLeft > original_scroll) { // Going left

			slider_change = slider.offsetWidth - slider.scrollLeft % slider.offsetWidth;
			var current_index = Math.round( (slider_change+start) / slider.offsetWidth );
			if (current_index >= slider.children.length) current_index = slider.children.length-1;
			slider_change = slider.children[current_index].offsetLeft - slider.scrollLeft;

		} else { // Going right

			slider_change = slider.scrollLeft % slider.offsetWidth - slider.offsetWidth;
			slider_change = -1 * (slider.offsetWidth + slider_change);
			var current_index = Math.round( (slider_change+start) / slider.offsetWidth );
			if ( current_index < 0 ) current_index = 0;
			slider_change = -1 * (start - slider.children[current_index].offsetLeft);

		}
		
		if ( original_scroll == slider.scrollLeft ) {
			
			slider_change = 0;

		}
		
	}

	if ( !slider_change ) {

		slideEnd();
		return;

	}
	
	slider_animation = 1;
	currentTime = 0;
	increment = 20;
	duration = 400;
	
	animateScroll();

}

function sliderKeyboard (e) {

	var event = e || window.event;
	el = event.target || event.srcElement;

    if (event.keyCode == 37) { // left
    	
		slide(el, 'left');

    }

    if (event.keyCode == 39) { // right

		slide(el, 'right');
		
    }

};

function scrollBarWidth() {

	if ( navigator.userAgent.indexOf('MSIE 8') != -1 )	{ 
		
		return 17;

	}

	var doc = (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Trident') != -1) ? document.documentElement.querySelector('body') : document.body;

    doc.insertAdjacentHTML('beforeend', '<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;" id="outer"><div style="width: 100%; height:200px;" id="inner">test</div></div>');
    inner = document.getElementById('inner');
    outer = document.getElementById('outer');
    var width1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var width2 = outer.clientWidth;
    outer.parentNode.removeChild( outer );
 
    return (width1 - width2);

}

function makeSlider (el, current_slide) {
	
	addClass (el, 'slider');
	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML.replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	el.scrollLeft = (current_slide) ? (el.children[current_slide].offsetLeft) : 0;
	
	// Generate controls

	el.style.marginBottom = '-' + scrollBarWidth() + 'px';

	for (var i = 0; i < el.children.length; i++) {
		
		if ( el.children[i].querySelector('.thumbnail') ) {

			slider_nav = el.parentNode.querySelector('.slider-nav');
			addClass( slider_nav, 'thumbnails' );
			addClass( slider_nav, 'row' );
			slider_nav.insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + el.children[i].querySelector('.thumbnail').innerHTML + '</a>' );
			
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
	
	el.setAttribute('data-original-scroll', el.scrollLeft);
	el.onscroll = scrollSlider;
	el.style.maxHeight = window.innerHeight + 'px';
	
	return el;
	
}

/* Start */

document.onkeyup = sliderKeyboard;

/* Initialise JS extras: create arrows/numbers navigation */
forEach('.slider', function(el, i) {

	makeSlider(el);
	
});

slider = document.querySelector('.slider');

/*
window.onresize = function () { 
	
	forEach('.slider', function (el,i) {
		el.scrollLeft = 0;
		moveIndex ();

	});
	
}
*/
