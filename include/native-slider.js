var scrollTimer;
var slider;
	
function scrollslider() {

    if (scrollTimer != -1)
        clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout("scrollFinished()", 50);

};

function scrollFinished() { // center the nearest scrolling item

	$(slider).animate ( { 'scrollLeft': Math.round ( $(slider).scrollLeft() / $(slider).width() ) * $(slider).width() }, 100, function () {
		move_index();
	});

}

function move_index() {

	$(slider).parent().find('.slider-nav a.active').removeClass();
	var index = Math.round( $(slider).scrollLeft() / $(slider).width() ) + 1;

	if ( index > $(slider).parent().find('.slider-nav a').length ) { 
		index = $(slider).parent().find('.slider-nav a').length; 
	}

	$(slider).parent().find('.slider-nav a:nth-child(' + index + ')').addClass('active');
	
}

function slide( direction ) {
	
    clearTimeout(scrollTimer);
	
	$('body').addClass('disable-hover');
	$(slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $(slider).scrollLeft() + direction * $(slider).width() }, 'fast', function () { 
		$(slider).on('scroll', scrollslider ); 
		move_index();
		$('body').removeClass('disable-hover');
	});
	
}

function slide_end () {

	$(slider).on('scroll', scrollslider );
	document.body.classList.remove('disable-hover');
  	
}

/* Make slide_native universal with parameter specifying target scroll */

function slide_native (e) {

	el = e.target; // Activated button
	n = el.innerHTML - 1;
	$(el).siblings('a.active').removeClass();
	$(el).addClass('active');
	slider = $(el).parent().siblings('.slider');
				
/* 	$('body').addClass('disable-hover'); */
	if (document.body.classList)
	  document.body.classList.add('disable-hover');
	else
	  document.body.className += ' ' + 'disable-hover';
	
	el = $(slider).get(0);
	start = el.scrollLeft,
	change = ( n * $(slider).width() ) - start,
	currentTime = 0,
	increment = 20;
	duration = 500;
	var animateScroll = function(){
	// increment the time
	currentTime += increment;
	// find the value with the quadratic in-out easing function
	var val = Math.easeInOutQuad(currentTime, start, change, duration);
	// move the document.body
	el.scrollLeft = val;
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

$(document).ready(function() {
	
	$('.slider').on('scroll', function () { 
		slider = $(this); 
		scrollslider(); 
	});
	
	$(document).keyup(function(e){

		/* Detect a slider into view and control it */

	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();

		$('.slider').each( function (n) { // Make the nearest slider active (for keyboard control)

		    var elemTop = $(this).offset().top;
		    var elemBottom = elemTop + $(this).height();

			if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
				slider = this; 
				return;
			}			

		});
		
	    if (e.keyCode == 37) { // left
	    	
			slide(-1);
	    }
	    if (e.keyCode == 39) { // right
	
			slide(1);
			
	    }
	});
	
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

		el.parentNode.childNodes[0].onclick = function () {
			slider = this.nextSibling;
			slide(-1);
		}
		
		el.parentNode.childNodes[2].onclick = function () {
			slider = this.previousSibling;
			slide(1);
		}
		
		Array.prototype.forEach.call( el.nextElementSibling.nextElementSibling.children, function(el, i) { // Bind event handler to all numbered buttons
			
			this.onclick = slide_native;
		
		});
		
	});
	
});

$(window).load(function() {
	
	// Get scrollbar width and hide it by reducing the .slider-container height proportionally

	$('.slider').css('overflow-x', 'hidden');
	var height_scroll = $('.slider').height();
	$('.slider').css('overflow-x', 'scroll');
	height_scroll = $('.slider').height() - height_scroll;
	
	$('.slider-container').each ( function () { 

		$(this).height( $(this).height() - height_scroll );
		
	});

});
