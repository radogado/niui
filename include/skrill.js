function is_touch_device() {
  return !!('ontouchstart' in window);
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

/* Google Analytics - To do: fix script embedding */

var 
    _uprod = (
           document.location.hostname == 'www.moneybookers.com'
        || document.location.hostname == 'moneybookers.com'
        || document.location.hostname == 'www.skrill.com'
        || document.location.hostname == 'skrill.com'
    ) ? 1 : 0,
    _uacct = 'UA-39489651-1',
    _upage = null,
    _uanch = false,
    _ucche = {}
;

function customTracker ( options )
{
    if ( ! _uprod ) return true;

    var t_uacct = _uacct,
        t_upage = _upage,
        t_uanch = _uanch,
        t_uflag = '',
        t_ucat  = '',
        t_uact  = '',
        t_ulab  = ''
    ;
    for ( var opt in options ) {
        eval( "t" + opt + " = options['" + opt + "'];" );
    }

    try {
        if ( typeof( _ucche[ t_uacct ] ) == 'undefined' ) _ucche[ t_uacct ] = _gat._getTracker( t_uacct );
        var pageTracker = _ucche[ t_uacct ];
        if ( t_ucat && t_uact ) {
            pageTracker._trackEvent( t_ucat, t_uact, t_ulab );
        } else if ( t_uflag ) {
            pageTracker._setVar( t_uflag );
        } else {
            if ( t_uanch ) {
                pageTracker._setAllowAnchor( t_uanch );
            }
            if ( t_upage ) {
                pageTracker._trackPageview( t_upage );
            } else {
                pageTracker._trackPageview();
            }
        }
    } catch ( err ) {
        /**/
    };

    return true;
}

// Note: use this functions in case of user action, i.e. mouse click, form submit etc.
function customTracker_Page ( page ) { return customTracker( { _upage: page } ); }
function customTracker_Flag ( flag ) { return customTracker( { _uflag: flag } ); }

function customTracker_Event ( cat, act, lab ) { return customTracker( { _ucat: cat, _uact: act, _ulab: lab } ); }

//if ( _uprod ) { onboarding project tracking functionality requires this snippet always to exist on this page
    document.write(
        '<script type="text/javascript" src="http' + ( document.location.protocol == 'https:' ? 's://ssl' : '://www' ) + '.google-analytics.com/ga.js">/**/</script>'
    );
    document.write(
        '<script type="text/javascript"> customTracker(); </script>'
    );
//}

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
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function scrollTo(to, callback, duration) {
  // figure out if this is moz || IE because they use documentElement
  var doc = (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('MSIE') != -1) ? document.documentElement : document.body,
  start = doc.scrollTop,
  change = to - start,
  currentTime = 0,
  increment = 20;
  duration = (typeof(duration) === 'undefined') ? 500: duration;
  var animateScroll = function(){
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
    doc.scrollTop = val;
    // do the animation unless its over
    if(currentTime < duration) {
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

function modal_window (e) {

	document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> <progress></progress> </div>');
	document.body.style.overflow = 'hidden';

	document.body.onkeyup = function(e) {

	    if (e.keyCode == 27) { // esc

			document.body.removeChild( document.getElementById('blackbox') );
			document.body.style.overflow = 'auto';

	    }

	};
	
	if ( e.target.classList && e.target.classList.contains('lightbox') ) { // Show an image lightbox...

		var image_url = e.target.href;
		document.getElementById('blackbox').insertAdjacentHTML('afterbegin', '<img src="' + image_url + '" alt="Lightbox">');
		
	} else // ... or load external content in a modal window 
	{
		
		container = 0;
		if ( typeof e.target.href.split('#')[1] != 'undefined') {
			container = e.target.href.split('#')[1];
		};
		
		blackbox = document.getElementById('blackbox');

		var progressBar = blackbox.querySelector('progress'), client = new XMLHttpRequest();

		client.open("GET", e.target.href);
		if (container) { 
			client.responseType = "document"; 
		}
		client.onprogress = function(pe) {
			if(pe.lengthComputable) {
				progressBar.max = pe.total;
				progressBar.value = pe.loaded;
				blackbox.textContent = (pe.loaded + ' of ' + pe.total);
			}
		}
		client.onloadend = function(pe) {
			console.log(client.response);
			blackbox.innerHTML = container ? client.response.querySelector('#' + container).innerHTML : client.response;
			
			blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
			blackbox.querySelector('.close').onclick = function (e) {
				document.body.removeChild( document.getElementById('blackbox') );
				document.body.style.overflow = 'auto';
			};
			relay_parameters();
		}
		client.send();
		
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
	document.getElementsByClassName('backtotop')[0].onclick = function() { scrollTo(0); return false; };

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
	
});

/* ███████████████████ After everything is loaded, including images ███████████████████ */

document.addEventListener("load", function() { // IE9+, check IE8

});
