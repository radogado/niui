/* natUIve Slider */

function isAndroidBrowser() {

	return ((ua.indexOf("Android") != -1) && (ua.indexOf("Chrome") == -1));

}

function sliderElement (e) {
	
	var event = e || window.event; 
	el = event.target || event.srcElement;

	if ( hasClass(el, 'slider-container')) {

		el = el.querySelector('.slider');

	} else {

		while ( !hasClass(el,'slider') ) {
			
			el = el.parentNode;
			
		}

	}
	
	return el;
	
}

/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

var lastAnimation = 0;

swipeEvents = function(el) {

	var startX,
		startY;

	el.addEventListener("touchstart", touchStart);  
	
	function touchStart(event) {

		var touches = event.touches;
		if (touches && touches.length) {
			startX = touches[0].pageX;
			startY = touches[0].pageY;

			el.addEventListener("touchmove", touchMove);
		}
	}

	function touchMove(event) {

		var touches = event.touches;
		if (touches && touches.length) {

			var deltaX = startX - touches[0].pageX;
			var deltaY = startY - touches[0].pageY;
			
			if ( (Math.abs(deltaX) < Math.abs(deltaY)) && !document.querySelector('.slider.lightbox') ) {
				
				return;
				
			}

			event.preventDefault();

			if (deltaX >= 50) {
				
				if ( isAndroidBrowser() ) {
					
					initScroll(event, -1*deltaX);
					
				}

				var event = new Event('swipeLeft');
				el.dispatchEvent(event);


			}
			if (deltaX <= -50) {

				if ( isAndroidBrowser() ) {
					
					initScroll(event, -1*deltaX);
					
				}

				var event = new Event('swipeRight');
				el.dispatchEvent(event);

			}

			if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
				el.removeEventListener('touchmove', touchMove);
			}

		}
	}

};

initScroll = function(event, delta) {

	var deltaOfInterest = delta,
		timeNow = new Date().getTime();

	// Cancel scroll if currently animating or within quiet period
	if ( (timeNow - lastAnimation) < 800 ) {

		event.preventDefault();
		return;

	}

	var el = sliderElement (event);

	slide(el, (deltaOfInterest < 0) ? 'right' : 'left' );
	
	lastAnimation = timeNow;

}

mouseWheelHandler = function(event) {

	var delta = event.wheelDeltaX || -event.detail;
	if ( Math.abs(delta) < 9 ) return;
	event.preventDefault();
	initScroll(event, delta);

}

function slide ( e, method ) {

	if ( window.sliderTimeout ) {
		
		clearTimeout(window.sliderTimeout);
		
	}

	var event = e || window.event; 
	stopEvent(event);
	el = event.target || event.srcElement;

	if (typeof el == 'undefined' ) { 

		el = e; 

	}

	var index = 0, slider = 0;
	
	if ( method == 'index' ) {
		
		slider = el.parentNode.parentNode.querySelector('.slider');
		
		index = thisIndex(el);

		pos = (index * 100) + '%';
		
		if ( isAndroidBrowser() ) {
			
			pos = ( index * slider.offsetWidth ) + 'px';
			
		}

	}
	
	if ( method == 'left' || method == 'right' ) {

		slider = el.parentNode.querySelector('.slider');

		var index = thisIndex ( slider.parentNode.querySelector('.slider-nav a.active') );
		
		if ( index == 0 && method == 'left' ) {
			
			index = slider.children.length;

		}

		if ( index == (slider.children.length -1) && method == 'right' ) {
			
			index = -1;
	
		}

		pos = (( method == 'left' ? --index : ++index ) * 100) + '%';

		if ( isAndroidBrowser() ) {
			
			pos = (index * slider.offsetWidth) + 'px';

		}
		
	}
	
    removeClass( slider.parentNode.querySelector('.slider-nav .active'), 'active');
    addClass( slider.parentNode.querySelector('.slider-nav').children[index], 'active');

	el.parentNode.removeEventListener('mousewheel', mouseWheelHandler);
	el.parentNode.removeEventListener('DOMMouseScroll', mouseWheelHandler);
	
	var slide_duration = 400;
	
    slider.style.cssText = ( ua.indexOf('MSIE 8') != -1 || isAndroidBrowser() ) ? 
    	("overflow-y: visible; left: -" + pos + "; -webkit-transition: left " + slide_duration + "ms ease;") :
    	("overflow-y: visible; -webkit-transform: translateX(-" + pos + "); -moz-transform: translateX(-" + pos + "); -ms-transform: translateX(-" + pos + "); transform: translateX(-" + pos + "); -webkit-transition: -webkit-transform " + slide_duration + "ms ease; -moz-transition: -moz-transform " + slide_duration + "ms ease; -ms-transition: -ms-transform " + slide_duration + "ms ease;");

	slider.addEventListener( 'transitionend', function (e) { 
	
		el.parentNode.addEventListener('mousewheel', mouseWheelHandler);
		el.parentNode.addEventListener('DOMMouseScroll', mouseWheelHandler);
		document.onkeyup = sliderKeyboard;
	
	}, false );
    
}

function sliderKeyboard (e) {

	var event = e || window.event;
	el = event.target || event.srcElement;

	if (document.querySelector('.slider') == null ) {
	
		return;
		
	}
	
	var tag = el.tagName.toLowerCase();
	
	el = document.querySelector('.slider.lightbox') || document.querySelector('.slider');
	
	switch(event.which) {
		case 37:
			if (tag != 'input' && tag != 'textarea') slide(el, 'left');
			break;
		case 39:
			if (tag != 'input' && tag != 'textarea') slide(el, 'right');
			break;
		default: return;
	}

	document.onkeyup = function () {};

};

function makeSlider (el, current_slide) {
	
	if (el.children.length < 2) {
		
		return el;
		
	}
	addClass (el, 'slider');
	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML/* .replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) */ + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	el.style.overflowY = 'visible';
// 	var tallest_slide = 0;
	
	// Generate controls

	for (var i = 0; i < el.children.length; i++) {
		
		if ( el.children[i].nodeName == '#comment' ) {
			
			continue;
		
		}
		
// 		tallest_slide = (el.children[i].scrollHeight > tallest_slide) ? el.children[i].scrollHeight : tallest_slide;
		
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

/*
	for (var i = 0; i < el.children.length; i++) {
		
		el.children[i].style.height = tallest_slide + 'px';

	}
*/
	
	container.querySelector('.slider-arrow.left').onclick = function (e) {

		slide(e, 'left');

	}
	
	container.querySelector('.slider-arrow.right').onclick = function (e) {

		slide(e, 'right');

	}
	
	if (current_slide) {
		
		removeClass(el.parentNode.querySelector('.slider-nav .active'), 'active');
		addClass(el.parentNode.querySelector('.slider-nav').children[current_slide], 'active');
		pos = current_slide*100;
		el.style.cssText = ( ua.indexOf('MSIE 8') != -1 ) ? ("overflow-y: visible; left: -" + pos + "%;") : ("overflow-y: visible; -webkit-transform: translateX(-" + pos + "%); -moz-transform: translateX(-" + pos + "%);-ms-transform: translateX(-" + pos + "%);transform: translateX(-" + pos + "%);");
		
	}
	
	document.onkeyup = sliderKeyboard;

	if ( ua.indexOf('MSIE 8') != -1 ) {
	
		return el;
	
	}

	el.parentNode.addEventListener('mousewheel', mouseWheelHandler);
	el.parentNode.addEventListener('DOMMouseScroll', mouseWheelHandler);

	swipeEvents(el.parentNode);
  	el.parentNode.addEventListener("swipeLeft",  function(event){

	  	el = sliderElement(event);
  		slide(el, 'right');

  	});

  	el.parentNode.addEventListener("swipeRight", function(event){

	  	el = sliderElement(event);
  		slide(el, 'left');

  	});

  	if ( el.getAttribute('data-autoslide') ) { // auto slide
  	
		  	
  		function autoSlide () {
	  		
	  		slide(el, 'right');
	  		window.sliderTimeout = setTimeout( autoSlide, 1000 * el.getAttribute('data-autoslide') );
	  		
  		}
  		
  		setTimeout( autoSlide, 1000 * el.getAttribute('data-autoslide') );
  	
  	}

	return el;
	
}

/* Start */

/* Initialise JS extras: create arrows/numbers navigation */
forEach('.slider', function(el, i) {

	makeSlider(el);
	
});
