/* natUIve Framework for Chrome, Firefox, Safari, IE9+, phones, tablets */

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

/* URI parameters */

function GetURLParameter( name, source ) // if 'source' is missing, get it from the URI.
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  if ( name.split('?')[1] ) {
	  name = name.split('?')[1];
  }
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( source ? source : window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}	

function SetURLParameter( name, value, source ) // if 'source' is missing, get it from the URI.
{
    name = escape(name); value = escape(value);

    var s = source ? source : window.location.href;
    var kvp = name+"="+value;
    
    if ( !GetURLParameter(name, s) ) { // fix the source in case it doesn't have a parameter
    	s += ( ( ( s.indexOf('?') >= 0 ) ? '&' : '?' ) + name + '=0');
    }

    var r = new RegExp("(&|\\?)"+name+"=[^\&]*");

    s = s.replace(r,"$1"+kvp);

    if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;}

    // Fix hash in URI

    return s;
    
}

function updateURLParameter(url, param, paramVal){ // return input string with updated/added URL parameter
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

	tip = e.target.querySelector('.tip');
	if (!tip) return; //  fix it not to log error in console
	
	tip.parentNode.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway

	tip.style.top = (tip.parentNode.offsetTop + tip.parentNode.offsetHeight) + 'px';
			
	tip.style.opacity = 1;
	tip.style.display = 'block';
	
	// Add the close button (for touchscreens)
	
}

/* RID relay. Omit links starting with "javascript", "mailto" */

// get all URL parameters and relay them to all links on the page

function relay_parameters () {

	parameters = getURLParameters();
	
	elements = document.querySelectorAll('a[href]');
	Array.prototype.forEach.call(elements, function(el, i){
	
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

	blackbox = document.querySelector('#blackbox');
	if (blackbox) document.body.removeChild( blackbox );
	document.body.style.overflow = 'auto';

}

function modal_window (e) {

	document.body.onkeyup = function(e) {

	    if (e.keyCode == 27) { // esc
			
			remove_blackbox ();
			
	    }

	};
	
	if ( hasclass( e.target, 'lightbox') ) { // Show an image lightbox...

		document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
		document.body.style.overflow = 'hidden';
		document.getElementById('blackbox').insertAdjacentHTML('afterbegin', '<img src="' + e.target.href + '" alt="Lightbox">');
		blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
		blackbox.querySelector('.close').onclick = remove_blackbox;
		
	} else // ... or load external content in a modal window 
	{
		
		request = new XMLHttpRequest;
		request.open('GET', e.target.href.split('#')[0], true);
		
		request.onload = function() {

			if (request.status >= 200 && request.status < 400){
			// Success!
				container = (typeof e.target.href.split('#')[1] != 'undefined') ? ( '#' + e.target.href.split('#')[1] ) : 0;
				document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
				document.body.style.overflow = 'hidden';
				blackbox = document.getElementById('blackbox');
				blackbox.innerHTML = container ? parseHTML(request.responseText).querySelector(container).innerHTML : request.responseText;
				blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
				blackbox.querySelector('.close').onclick = remove_blackbox;
				relay_parameters();
			
			} else {
			// We reached our target server, but it returned an error
			}

		};
		
		request.onerror = function() {
		  // There was a connection error of some sort
		};
		
		request.send();
		
	}
	
	return false;
}

/* ███████████████████ After DOM is created ███████████████████ */

document.addEventListener("DOMContentLoaded", function() { // IE9+, check IE8

/* Relay URI parameters to links */

	relay_parameters();
	
/* Modal window: open a link inside it */

   	elements = document.querySelectorAll('a.modal-link, a.lightbox');
	Array.prototype.forEach.call(elements, function(el, i){
		
		el.onclick = modal_window;
		
	});

/* Tooltip */
		
   	elements = document.querySelectorAll('.tool');
	Array.prototype.forEach.call(elements, function(el, i){
		
		el.onclick = show_tip;
			
		if (!is_touch_device()) {
			
			el.onmouseover = show_tip;
			el.onmouseout = hide_tip;
			
		}
	
		el.addEventListener('touchmove', hide_tip, false);
				
	});

/* Add 'Back to top' button */

	document.body.insertAdjacentHTML('beforeend', '<a class="backtotop"> ⬆ </a>');
	document.body.querySelector('.backtotop').onclick = function() { scrollTo(0); return false; };

/* Auto textarea height */
   	
   	elements = document.querySelectorAll('textarea');
	Array.prototype.forEach.call(elements, function(el, i){
	
		el.onkeyup = function () {
			textArea = this;
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

	elements = document.querySelectorAll('form');
	Array.prototype.forEach.call(elements, function (el, i) {
		
		el.onsubmit = function () {
			mandatory = true;
			elements = el.querySelectorAll('.mandatory');
			Array.prototype.forEach.call(elements, function (el, i) {
				
				if (!el.querySelector('input, select, textarea').value) { 

					mandatory = false;
					el.style.backgroundColor = '#999999';

				}

			});

			return mandatory;
			
		};
		
	});
	
});

/* ███████████████████ After everything is loaded, including images ███████████████████ */

document.addEventListener("load", function() { // IE9+, check IE8

});
