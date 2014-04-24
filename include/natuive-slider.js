/* natUIve by rado.bg */

var scrollTimer = null;
var slider;
var scroll_start = 0;
var original_scroll = 0;
	
function scrollSlider (e) {

	var event = e || window.event;
	slider = event.target || event.srcElement;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
		scroll_start = slider.scrollLeft;
        slide (event, 'snap');
    }, 50);

};

function moveIndex () {

	removeClass ( slider.parentNode.querySelector('.slider-nav a.active'), 'active' );
	var index = Math.round( slider.scrollLeft / slider.offsetWidth ) + 1;

	addClass( slider.parentNode.querySelector('.slider-nav').childNodes[index-1], 'active');
	
}

function slideEnd () {

	slider.onscroll = scrollSlider;
	clearTimeout(scrollTimer);
	removeClass( document.body, 'disable-hover' );
  	moveIndex();
  	original_scroll = slider.scrollLeft;
	document.onkeyup = sliderKeyboard;
	
}

/* Make slide universal with parameter specifying target scroll */

function slide ( e, target ) {

    clearTimeout(scrollTimer);
	slider.onscroll = function () { return false; };
	stopEvent(e);
	var event = e || window.event;
	el = event.target || event.srcElement;
	var change = 0;
	
	addClass( document.body, 'disable-hover');
	
	if (target == 'index') {

		slider = el.parentNode.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = thisIndex(el) * slider.offsetWidth - start;
		
	}
	
	if ( target == 'left') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = slider.scrollLeft - slider.offsetWidth - start;

	}
	
	if ( target == 'right') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = slider.scrollLeft + slider.offsetWidth - start;

	}
	
	if ( target == 'snap') {

		console.log('From ' + original_scroll + ' to ' + slider.scrollLeft);

		if (slider.scrollLeft > original_scroll) { 
			change = slider.offsetWidth - slider.scrollLeft % slider.offsetWidth;
		} else {
			change = slider.scrollLeft % slider.offsetWidth - slider.offsetWidth;
			change = -1 * (slider.offsetWidth + change);
		}
		
		start = slider.scrollLeft;
		console.log(start + ' ' + change); 

	}
	
	currentTime = 0,
	increment = 20;
	duration = 400;
	
	var animateScroll = function() {
		// increment the time
		currentTime += increment;
		// find the value with the quadratic in-out easing function
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		// move the document.body
		slider.scrollLeft = val;
		// do the animation unless its over
		if(currentTime < duration) {
			requestAnimFrame(animateScroll);
		} else {
			if (slideEnd && typeof(slideEnd) === 'function') { // the animation is done so lets callback
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

	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML.replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>'); // 'replace' function removes spaces between slides to glue them together
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	
	for (var i = 0; i < el.children.length; i++) {
		
		if ( el.children[i].querySelector('.thumbnail') ) {
			
			addClass( el.parentNode.querySelector('.slider-nav'), 'thumbnails' );
			addClass( el.parentNode.querySelector('.slider-nav'), 'row' );
			el.parentNode.querySelector('.slider-nav').insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + el.children[i].querySelector('.thumbnail').innerHTML + '</a>' );
			
						
		} else {
			
			container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + (i + 1) + '</a>');

		}
		
		container.querySelector('.slider-nav').lastChild.onclick = function (e) {
			slide(e, 'index');
		};

	}

	container.querySelector('.slider-arrow.left').onclick = function (e) {

		slide(e, 'left');

	}
	
	container.querySelector('.slider-arrow.right').onclick = function (e) {

		slide(e, 'right');

	}
	
	el.onscroll = scrollSlider;

	// Get scrollbar width and hide it by reducing the .slider-container height proportionally

	el.style.overflowX = 'hidden';
	var height_scroll = el.offsetHeight;
	el.style.overflowX = 'scroll';
	height_scroll = el.offsetHeight - height_scroll;
	container.style.height = (container.offsetHeight - height_scroll) + 'px';
	
	el.style.width = el.offsetWidth + 'px'; // Chrome fix
	
}

addEventHandler ( window, 'load', function() {

	document.onkeyup = sliderKeyboard;
	
	/* Initialise JS extras: create arrows/numbers navigation */
	forEach('.slider', function(el, i) {

		if (!i) {
			slider = el;
		}
		
		makeSlider(el);
		
	});
	
});
