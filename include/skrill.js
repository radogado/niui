/* natUIve Framework for Chrome, Firefox, Safari, IE8+, phones, tablets */

	
function is_touch_device() {
  return !!('ontouchstart' in window);
}

function addclass ( el, className ) {

	if (el.classList)
	  el.classList.add(className);
	else
	  el.className += ' ' + className;
  	
}

function removeclass ( el, className ) {

	if (el.classList)
	  el.classList.remove(className);
	else
	  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  	
}

var parseHTML = function (str) {
  var tmp = document.implementation.createHTMLDocument('Parsed');
  tmp.body.innerHTML = str;
  return tmp.body;
}

function hasclass (el, className) {

	if (el.classList)
	  return el.classList.contains(className);
	else
	  return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

}

function forEachElement(selector, fn) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++)
    fn(elements[i], i);
}
	
/*
function addEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, handler);
  }
}
*/

if ( navigator.userAgent.indexOf('MSIE 8') != -1 ) {

	forEachElement('.accordion label', function(el, i){
	
			el.onclick = function (e){ // Works only on the arrow, not the whole label
			
				if ( hasclass ( window.event.srcElement, 'open' ) ) {
					removeclass ( window.event.srcElement, 'open' )
				} else {
					addclass ( window.event.srcElement, 'open' )
				}
				
			};
	});

}

/* URI parameters */

function updateURLParameter (url, param, paramVal){ // return input string with updated/added URL parameter
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function getURLParameters () { // return all URL parameters in an array
	
	var p = {};
	
	var match = location.href.match(/[^=&?]+\s*=\s*[^&#]*/g);

	if (match) {
		for ( var i = match.length; i--; ) {
		  var spl = match[i].split("=");
		  var name = spl[0];
		  var value = spl[1];
		
		  p[name] = p[name] || [];
		  p[name].push(value);
		}
	}
	
	return p;
}

/* Tooltip */

var tip;

function hide_tip (e) {
	
	if (!tip) return;
	tip.style.display = 'none';
	tip.style.opacity = 0;

}

function show_tip (e) {

var event = e || window.event;
var target = event.target || event.srcElement;

	tip = target.querySelector('.tip');
	if (!tip) return; //  fix it not to log error in console
	
	tip.parentNode.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway

	tip.style.top = (tip.parentNode.offsetTop + tip.parentNode.offsetHeight) + 'px';
			
	tip.style.opacity = 1;
	tip.style.display = 'block';
	
	// Add the close button (for touchscreens)
	
}

/* URI parameters relay. Omit links starting with "javascript", "mailto" */

function relay_parameters () {

	parameters = getURLParameters();

	forEachElement('a[href]', function(el, i){

		for (var name in parameters) {
			if ( !el.href.indexOf('javascript') || (!el.href.indexOf('mailto') ) ) continue;
			var hash = el.href.split('#')[1] ? ( '#' + el.href.split('#')[1] ) : '';
			el.href = updateURLParameter( el.href.split('#')[0], name, parameters[name] ) + hash;
	
		} 
	
	});
	
}

// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) {
    return c/2*t*t + b
  }
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInCubic = function(t, b, c, d) {
  var tc = (t/=d)*t*t;
  return b+c*(tc);
};

Math.inOutQuintic = function(t, b, c, d) {
  var ts = (t/=d)*t,
  tc = ts*t;
  return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function(){
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function scrollTo(to, callback) {
  // figure out if this is moz || IE because they use documentElement
  var doc = (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Trident') != -1) ? document.documentElement : document.body,
  start = doc.scrollTop,
  change = to - start,
  currentTime = 0,
  increment = 20; console.log(doc.innerHTML);
  var animateScroll = function(){
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    var val = Math.easeInOutQuad(currentTime, start, change, 400);
    // move the document.body
    doc.scrollTop = val;
    // do the animation unless its over
    if(currentTime < 400) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}

function remove_blackbox () {

	var blackbox = document.getElementById('blackbox');
	if (blackbox) document.body.removeChild( blackbox );
	document.body.style.overflow = 'auto';

}

function modal_window (e) {

	document.body.onkeyup = function(e) {

		var event = e || window.event;

	    if (event.keyCode == 27) { // esc
			
			remove_blackbox ();
			
	    }

	};
	
	var event = e || window.event;
	var target = event.target || event.srcElement;

	if ( hasclass( target, 'lightbox') ) { // Show an image lightbox...

		document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
		document.body.style.overflow = 'hidden';
		document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div><img src="' + target.href + '" alt="Lightbox">';
		blackbox.querySelector('.close').onclick = remove_blackbox;
		
	} else // ... or load external content in a modal window 
	{
		
		if ( navigator.userAgent.indexOf('MSIE 8') != -1 ) {
			
			window.open (target.href, "_blank");
			return;

		}

		request = new XMLHttpRequest();
		request.open('GET', target.href.split('#')[0], true);

		request.onload = function() {

			if (request.status >= 200 && request.status < 400){
			// Success
				container = (typeof target.href.split('#')[1] != 'undefined') ? ( '#' + target.href.split('#')[1] ) : 0;
				document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
				document.body.style.overflow = 'hidden';
				blackbox = document.getElementById('blackbox');
				blackbox.innerHTML = container ? parseHTML(request.responseText).querySelector(container).innerHTML : request.responseText;
				blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
				blackbox.querySelector('.close').onclick = remove_blackbox;
				relay_parameters();
			
			} else {
			// Error
			}

		};
		
		request.onerror = function() {
		  // Error
		};
		
		request.send();
		
	}
	
	return false;
}

/* ███ After DOM is created ███ */

window.onload = function() {

/* Relay URI parameters to links */

	relay_parameters();
	
/* Modal window: open a link inside it */

   	forEachElement('a.modal-link, a.lightbox', function(el, i){
		
		el.onclick = modal_window;
		
	});

/* Tooltip */

	
	forEachElement('.tool', function(el, i){
		
		el.onclick = show_tip;
			
		if (!is_touch_device()) {
			
			el.onmouseover = show_tip;
			el.onmouseout = hide_tip;
			
		}
	
		addEventListener(el, 'touchmove', hide_tip, false);
				
	});

/* Add 'Back to top' button */

	document.body.insertAdjacentHTML('beforeend', '<a class="backtotop"> ⬆ </a>');
	document.body.querySelector('.backtotop').onclick = function() { scrollTo(0); return false; };

/* Auto textarea height - fix bug after manually resize in Safari*/
   	
   	forEachElement('textarea', function(el, i){
	
		el.onkeyup = function (e) {
			var event = e || window.event;
			var textArea = event.target || event.srcElement;
			while (
				textArea.rows > 1 &&
				textArea.scrollHeight < textArea.offsetHeight
			)
			{	textArea.rows--}
			
			while (textArea.scrollHeight > textArea.offsetHeight)
			{	textArea.rows++ }
			textArea.rows++
			
		};

	});

/* Form validation */

	forEachElement('form', function (el, i) {
		
		el.onsubmit = function () {
			ready_to_submit = true;
			elements = el.querySelectorAll('.mandatory');
			Array.prototype.forEach.call(elements, function (el, i) {
				
				if (!el.querySelector('input, select, textarea').value) { 

					ready_to_submit = false;
					addclass (el, 'alert');

				} else {
					
					removeclass (el, 'alert');
					
				}

			});

			return ready_to_submit;
			
		};
		
	});

};
