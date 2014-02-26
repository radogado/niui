// Fix events while sliding, snap to direction instead of middle point

var scrollTimer = null;
var slider;
var slider_event;
var eventCopy = {};
	
function scrollslider(e) {

	var event = e || window.event;
	slider = event.target || event.srcElement;

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function(){
        slide (event, 'snap');
    },50);

};

function move_index() {

	if ( slider.parentNode.querySelector('.slider-nav a.active') ) removeclass ( slider.parentNode.querySelector('.slider-nav a.active'), 'active' );
	var index = Math.round( slider.scrollLeft / slider.offsetWidth ) + 1;

	if ( index > slider.parentNode.querySelector('.slider-nav').childNodes.length ) {
		index = slider.parentNode.querySelector('.slider-nav').childNodes.length;
	}

	addclass( slider.parentNode.querySelector('.slider-nav').childNodes[index-1], 'active');
	
}

function slide_end () {

	slider.onscroll = scrollslider;
	removeclass( document.body, 'disable-hover' );
  	
}

/* Make slide universal with parameter specifying target scroll */

function slide (e, target) {
    clearTimeout(scrollTimer);
	var event = e || window.event;
	var el = event.target || event.srcElement;

/* 	event.stopPropagation(); */

	addclass( document.body, 'disable-hover');
	
	if (target == 'index') {

		slider = el.parentNode.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = (el.innerHTML - 1) * slider.offsetWidth - start;
		removeclass( el.parentNode.querySelector('a.active'), 'active' );
		addclass( el, 'active');
		
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

		start = slider.scrollLeft;
		change = Math.round ( slider.scrollLeft / slider.offsetWidth ) * slider.offsetWidth - start;

	}
	
	currentTime = 0,
	increment = 20;
	duration = 400;
	
	var animateScroll = function(){
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
	  if (slide_end && typeof(slide_end) === 'function') {
	    // the animation is done so lets callback
	    slide_end();
	  }
	}
	};
	animateScroll();
	move_index();

}

addEventHandler(window, 'load', function() {

	document.onkeyup = function(e){

		/* Detect a slider into view and control it - not working el.offsetTop */

	    var docViewTop = window.scrollY;
	    var docViewBottom = docViewTop + document.body.offsetHeight;

		forEachElement('.slider', function(el, i) {
	
		    var elemTop = el.offsetTop;
		    var elemBottom = elemTop + el.offsetHeight;

			if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
				slider = el;
				return;
			}
	
		});
			
		var event = e || window.event;
		var e = event.target || event.srcElement;

	    if (e.keyCode == 37) { // left
	    	
			slide(e, 'left');

	    }
	    if (e.keyCode == 39) { // right
	
			slide(e, 'right');
			
	    }

	};
	
	/* Initialise JS extras: create arrows/numbers navigation */

	forEachElement('.slider', function(el, i) {

		if (!i) {
			slider = el;
		}
		el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
		container = el.previousSibling;
		container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
		container.nextSibling.outerHTML = '';
		el = container.querySelector('.slider');
		
		for (var i = 0; i < el.children.length; i++) {
			container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + (i + 1) + '</a>');
			container.querySelector('.slider-nav').lastChild.onclick = function (e) {
				slide(e, 'index');
			};
		}

		container.childNodes[0].onclick = function (e) {

			slide(e, 'left');

		}
		
		container.childNodes[2].onclick = function (e) {

			slide(e, 'right');

		}
		
		el.onscroll = function (e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			slider = target;
			scrollslider(event); 
		};

		// Get scrollbar width and hide it by reducing the .slider-container height proportionally

		el.style.overflowX = 'hidden';
		var height_scroll = el.offsetHeight;
		el.style.overflowX = 'scroll';
		height_scroll = el.offsetHeight - height_scroll;
		container.style.height = (container.offsetHeight - height_scroll) + 'px';
		
	});
	
});
