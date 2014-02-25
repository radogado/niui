// Fix events while sliding, snap to direction instead of middle point

var scrollTimer = null;
var slider;
var slider_event;
	
function scrollslider(e) {

	slider = e.target;
   	console.log(slider.scrollLeft);
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function(){
        slide (e, 'snap');
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

	e.stopPropagation();
	el = e.target; // Activated button

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

document.addEventListener("DOMContentLoaded", function() {
	
	document.onkeyup = function(e){

		/* Detect a slider into view and control it - not working el.offsetTop */

	    var docViewTop = window.scrollY;
	    var docViewBottom = docViewTop + document.body.offsetHeight;

		var elements = document.querySelectorAll('.slider');
		Array.prototype.forEach.call(elements, function(el, i) {
	
		    var elemTop = el.offsetTop;
		    var elemBottom = elemTop + el.offsetHeight;

			if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
				slider = el;
				return;
			}
	
		});
			
	    if (e.keyCode == 37) { // left
	    	
			slide(e, 'left');

	    }
	    if (e.keyCode == 39) { // right
	
			slide(e, 'right');
			
	    }

	};
	
	/* Initialise JS extras: create arrows/numbers navigation */

	elements = document.querySelectorAll('.slider');
	Array.prototype.forEach.call(elements, function(el, i) {
		
		el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
		
		el.previousElementSibling.appendChild(el);
		
		el.insertAdjacentHTML('beforebegin', '<a class="slider-arrow left">←</a>');

		el.insertAdjacentHTML('afterend', '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
		
		Array.prototype.forEach.call(el.children, function(el, i) { // Populate the numbered control buttons

			el.parentNode.nextElementSibling.nextElementSibling.insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + (i + 1) + '</a>');
			
		});

		el.parentNode.childNodes[0].onclick = function (e) {

			slide(e, 'left');

		}
		
		el.parentNode.childNodes[2].onclick = function (e) {

			slide(e, 'right');

		}
		
		Array.prototype.forEach.call( el.nextElementSibling.nextElementSibling.children, function(el, i) { // Bind event handler to all numbered buttons
			
			el.onclick = function (e) {
				slide(e, 'index');
			};
		
		});
		
		el.onscroll = function (e) {
			slider = e.target;
			scrollslider(e); 
		};
		
	});
	
});

document.addEventListener("load", function() {
	
	// Get scrollbar width and hide it by reducing the .slider-container height proportionally

	el = document.body.querySelector('.slider');
	el.style.overflow = 'hidden';
	var height_scroll = slider.offsetHeight;
	el.style.overflow = 'scroll';
	height_scroll = slider.offsetHeight - height_scroll;

	var elements = document.querySelectorAll('slider-container');
	Array.prototype.forEach.call(elements, function(el, i) {
		
		el.style.height = el.offsetHeight - height_scroll;
		
	});
	
});
