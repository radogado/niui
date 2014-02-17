var scrollTimer;
var slider;
	
function scrollslider() {

    if (scrollTimer != -1)
        clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout("scrollFinished()", 50);

};

function scrollFinished() { // center the nearest scrolling item

	slider.scrollLeft = Math.round ( slider.scrollLeft / slider.offsetWidth ) * slider.offsetWidth; // animate this
	move_index();
	
}

function move_index() {

	slider.parentNode.querySelector('.slider-nav a.active').classList.remove('active');
	var index = Math.round( slider.scrollLeft / slider.offsetWidth ) + 1;

	if ( index > slider.parentNode.querySelector('.slider-nav').childNodes.length ) {
		index = slider.parentNode.querySelector('.slider-nav').childNodes.length;
	}

	slider.parentNode.querySelector('.slider-nav').childNodes[index-1].classList.add('active');
	
}

function slide( direction ) {
	
    clearTimeout(scrollTimer);
	
	document.body.classList.add('disable-hover');
	slider.onscroll = function (e) {};
	slider.scrollLeft = slider.scrollLeft + direction * slider.offsetWidth; // animate this
	slider.onscroll = scrollslider;
	move_index();
	document.body.classList.remove('disable-hover');
	
}

function slide_end () {

	slider.onscroll = scrollslider;
	document.body.classList.remove('disable-hover');
  	
}

/* Make slide_native universal with parameter specifying target scroll */

function slide_native (e) {

	e.stopPropagation();
	el = e.target; // Activated button
	n = el.innerHTML - 1;
	el.parentNode.querySelector('a.active').classList.remove('active');
	el.classList.add('active');
	slider = el.parentNode.parentNode.querySelector('.slider');

	if (document.body.classList)
	  document.body.classList.add('disable-hover');
	else
	  document.body.className += ' ' + 'disable-hover';
	
	start = slider.scrollLeft,
	change = n * slider.offsetWidth - start,
	currentTime = 0,
	increment = 20;
	duration = 500;
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
}

document.addEventListener("DOMContentLoaded", function() {
	
	document.onkeyup = function(e){

		/* Detect a slider into view and control it */

	    var docViewTop = window.scrollY;
	    var docViewBottom = docViewTop + window.offsetHeight;

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
	    	
			slide(-1);
	    }
	    if (e.keyCode == 39) { // right
	
			slide(1);
			
	    }

	};
	
	/* Initialise JS extras: create arrows/numbers navigation */

	var elements = document.querySelectorAll('.slider');
	Array.prototype.forEach.call(elements, function(el, i) {
		
		el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
		
		el.previousElementSibling.appendChild(el);
		
		el.insertAdjacentHTML('beforebegin', '<a class="slider-arrow left">←</a>');

		el.insertAdjacentHTML('afterend', '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
		
		Array.prototype.forEach.call(el.children, function(el, i) { // Populate the numbered control buttons

			el.parentNode.nextElementSibling.nextElementSibling.insertAdjacentHTML('beforeend', '<a>' + (i + 1) + '</a>');
			
		});
		
		el.parentNode.lastChild.firstChild.classList.add('active');

		el.parentNode.childNodes[0].onclick = function (e) {
			e.stopPropagation();
			slider = e.target.nextSibling;
			slide(-1);
		}
		
		el.parentNode.childNodes[2].onclick = function (e) {
			e.stopPropagation();
			slider = e.target.previousSibling;
			slide(1);
		}
		
		Array.prototype.forEach.call( el.nextElementSibling.nextElementSibling.children, function(el, i) { // Bind event handler to all numbered buttons
			
			el.onclick = slide_native;
		
		});
		
		el.onscroll = function (e) {
			slider = e.target;
			scrollslider(); 
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
