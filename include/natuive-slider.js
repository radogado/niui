/* natUIve Slider */

_swipeEvents = function(el){
	var startX,
		startY;

	el.addEventListener("touchstart", touchstart);  
	
		function touchstart(event) {
			var touches = event.touches;
			if (touches && touches.length) {
				startX = touches[0].pageX;
				startY = touches[0].pageY;
				el.addEventListener("touchmove", touchmove);
			}
		}

	function touchmove(event) {
		var touches = event.touches;
		if (touches && touches.length) {
		  event.preventDefault();
			var deltaX = startX - touches[0].pageX;
			var deltaY = startY - touches[0].pageY;

			if (deltaX >= 50) {
			  var event = new Event('swipeLeft');
			  el.dispatchEvent(event);
			}
			if (deltaX <= -50) {
			  var event = new Event('swipeRight');
			  el.dispatchEvent(event);
			}
			if (deltaY >= 50) {
			  var event = new Event('swipeUp');
			  el.dispatchEvent(event);
			}
			if (deltaY <= -50) {
			  var event = new Event('swipeDown');
			  el.dispatchEvent(event);
			}

			if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
				el.removeEventListener('touchmove', touchmove);
			}
		}
	}

};

function slide ( e, method ) {

	var event = e || window.event; 
	stopEvent(event);
	el = event.target || event.srcElement;

	if (typeof el == 'undefined' ) { 

		el = e; 

	}

	var index = 0;
	
	if ( method == 'index' ) {
		
		slider = el.parentNode.parentNode.querySelector('.slider');
		
		index = thisIndex(el);

		pos = index * 100;

	}
	
	if ( method == 'left' || method == 'right' ) {

		slider = el.parentNode.querySelector('.slider');
		
		var index = thisIndex ( slider.parentNode.querySelector('.slider-nav a.active') );

		pos = ( method == 'left' ? --index : ++index ) * 100;

		if ( (index<0) || (index >= slider.children.length) ) {
			
			return;
	
		}
	
	}
	
	console.log( 'new index: ' + index + ', pos: ' + pos );

    removeClass( slider.parentNode.querySelector('.slider-nav .active'), 'active');
    addClass( slider.parentNode.querySelector('.slider-nav').children[index], 'active');

    slider.style.cssText = "overflow-y: visible; -webkit-transform: translateX(-" + pos + "%); -webkit-transition: -webkit-transform 400ms ease; -moz-transform: translateX(-" + pos + "%); -moz-transition: -moz-transform 400ms ease; -ms-transform: translateX(-" + pos + "%); -ms-transition: -ms-transform 400ms ease; transform: translateX(-" + pos + "%); transition: transform 400ms ease;";
    
    /* Use 'left' for IE8 */

}

function sliderKeyboard (e) {

	var event = e || window.event;
	el = event.target || event.srcElement;

	var tag = e.target.tagName.toLowerCase();

	switch(e.which) {
		case 37:
			if (tag != 'input' && tag != 'textarea') slide(e, 'left');
			break;
		case 39:
			if (tag != 'input' && tag != 'textarea') slide(e, 'right');
			break;
		default: return;
	}

};

function makeSlider (el, current_slide) {
	
	addClass (el, 'slider');
	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML/* .replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) */ + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	el.style.overflowY = 'visible';
	
	// Generate controls

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

	container.querySelector('.slider-arrow.left').onclick = function (e) {

		slide(e, 'left');

	}
	
	container.querySelector('.slider-arrow.right').onclick = function (e) {

		slide(e, 'right');

	}
	
	if (current_slide) {
		
		removeClass(el.parentNode.querySelector('.slider-nav .active'), 'active');
		addClass(el.parentNode.querySelector('.slider-nav').children[current_slide], 'active');
		slide(el, 'index');
		
	}
	
  	_swipeEvents(el);
  	el.addEventListener("swipeLeft",  function(event){
  		slide(event, 'left');
  	});
  	el.addEventListener("swipeRight", function(event){
  		slide(event, 'right');
  	});

	return el;
	
}

/* Start */

document.onkeydown = sliderKeyboard;

/* Initialise JS extras: create arrows/numbers navigation */
forEach('.slider', function(el, i) {

	makeSlider(el);
	
});
