/* natUIve Slider */

var animationTime = 400;
var easing = 'ease';

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

		pos = index * -100;

	}
	
	if ( method == 'arrow') {

		slider = el.parentNode.querySelector('.slider');
		
		var index = thisIndex ( slider.parentNode.querySelector('.slider-nav a.active') );

		pos = ( hasClass(el, 'left') ? index-- : index++ ) * -100;

	}
	
    removeClass( slider.parentNode.querySelector('.slider-nav .active'), 'active');
    addClass( slider.parentNode.querySelector('.slider-nav').children[index], 'active');

    slider.style.cssText = "overflow-y: visible; -webkit-transform: translate3d(" + pos + "%, 0, 0); -webkit-transition: -webkit-transform " + animationTime + "ms " + easing + "; -moz-transform: translate3d(" + pos + "%, 0, 0); -moz-transition: -moz-transform " + animationTime + "ms " + easing + "; -ms-transform: translate3d(" + pos + "%, 0, 0); -ms-transition: -ms-transform " + animationTime + "ms " + easing + "; transform: translate3d(" + pos + "%, 0, 0); transition: transform " + animationTime + "ms " + easing + ";";

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

function makeSlider (el, current_slide) {
	
	addClass (el, 'slider');
	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML/* .replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) */ + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	el.scrollLeft = (current_slide) ? (el.children[current_slide].offsetLeft) : 0;
	el.style.overflowY = 'visible';
	
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
/* 	el.onscroll = scrollSlider; */
	
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
