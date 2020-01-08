/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

var bodyElement = document.body;

bodyElement.setAttribute('data-nui-js', 'true');

if (!!window['chrome']) {
	
	bodyElement.setAttribute('data-nui-chrome', 'true');

}

if (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/)) {
	
	bodyElement.setAttribute('data-nui-safari', 'true');
	
}

if (navigator.platform.match(/Mac/) || navigator.platform.match(/iPhone/) || navigator.platform.match(/iPod/) || navigator.platform.match(/iPad/)) {
	
	bodyElement.setAttribute('data-nui-apple', 'true'); // Apple devices: left-hand ⤫ button, disappearing thin scrollbars
	
}

var is_iPad = !!navigator.platform.match(/iPad/);

// DOM functions – start

function q(selector) {

	return document.querySelector(selector);

};

function qa(selector) {

	return document.querySelectorAll(selector);

};

function addClass(el, className) {

	el.classList.add(className);

}

function removeClass(el, className) {

	// To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
	el.classList.remove(className);
  
}

function hasClass(el, className) {

	return el.classList.contains(className);
	// To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma

}

function toggleClass(el, className) {

    if (hasClass(el, className)) {

        removeClass(el, className);

    } else {

        addClass(el, className);

    }

}

function toggleAttribute(el, attribute) {

    if (el.getAttribute(attribute)) {

        el.removeAttribute(attribute);

    } else {

        el.setAttribute(attribute, true);

    }

}

// DOM functions – end

function transferClass(el_origin, el_target, className) {

    if (hasClass(el_origin, className)) {

        addClass(el_target, className);

    }

}

function parseHTML(str) {

    var tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    // To do: destroy the HTMLDocument before returning
    return tmp.body;

}

function stopEvent(e) {

    if (!e) {

        if (!window.event) {

            return;

        }

    }

	if (!e) {
		
		return false;

	}

    //e.cancelBubble is supported by IE, this will kill the bubbling process.
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works only in Firefox.
    if (e.stopPropagation) {

        e.stopPropagation();

    }

    if (e.preventDefault) {

        e.preventDefault();

    }

    return false;

}

function thisIndex(el) {

/*
    if (!el) return;
	var node, nodes;
	
    nodes = node = el.parentNode.childNodes;

    var i = 0;
    var count = 0;

    while ((node = nodes.item(i++)) && node !== el) {

        if (node.nodeType === 1) {

            count++;

        }

    }

    return (count);
*/

	return [...el.parentNode.children].indexOf(el);

}

function getCookie(k) { // Thanks Simon Steinberger
	
	var v = document.cookie.match('(^|;) ?'+k+'=([^;]*)(;|$)');return v?v[2]:null;

}

function wrap(toWrap, wrapper) { // Thanks yckart

// 	observerOff();

    wrapper = wrapper || document.createElement('div');
	
	var sibling = toWrap.nextSibling;
	var parent = toWrap.parentNode;
	wrapper.appendChild(toWrap);
	
	if (parent) { // Already attached to DOM
	
	    if (sibling) { // Attach the wrapper
	
	        parent.insertBefore(wrapper, sibling);
	
	    } else {
	
	        parent.appendChild(wrapper);
	
	    }
    
    }
    
//     observerOn();

    return wrapper;

}

/*
function ready(fn) { // Not working with async and defer

  if (document.readyState != 'loading') {

    fn();

  } else if (document.addEventListener) {

    document.addEventListener('DOMContentLoaded', fn);

  } else {

    document.attachEvent('onreadystatechange', function() {
    	if (document.readyState != 'loading')
        	fn();
    });

  }

}
*/

function removeHash() {

    history.pushState("", document.title, window.location.pathname + window.location.search);

}

/* ––– */

function getURLParameters() { // return all URL parameters in an array

    var res = {};
    var re = /[?&]([^?&]+)=([^?&]+)/g;

    location.href.replace(re, (_, k, v) => {

        res[k] = v;

    });

    return res;

}

/*
// URI parameters

function updateURLParameter(url, param, paramVal) { // return input string with updated/added URL parameter

    var newAdditionalURL = '';
    url = url.split('#')[0];
    var tempArray = url.split('?');
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = '';
    if (additionalURL) {
        tempArray = additionalURL.split('&');
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    }

    var rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt.split('#')[0];

}

// URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array

var parameters_list = new Array('parameter1', 'parameter2'); // To do: load this from an external JSON file. Such data has no place here.

function relayParameters() {

    var parameters = getURLParameters();

    forEach('a[href]', function(el, i) {

        for (var name in parameters) {

            if (el.href.indexOf('javascript') === -1 && el.href.indexOf('mailto') === -1 && parameters_list.indexOf(name) != -1) {
	            
	            var hash = el.href.split('#')[1];
	            el.href = updateURLParameter(el.href, name, parameters[name]);
	            if (!!hash) {
		            
		            el.href = el.href.split('#')[0] + '#' + hash;
		            
	            }
	            
            }

        }

    });

}
*/

function arrow_keys_handler(e) {

    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40: // Arrow keys
        case 32:
            e.preventDefault();
            break; // Space
        default:
            break; // do not block other keys
    }

}

var external = RegExp('^((f|ht)tps?:)?//(?!' + location.host + ')');
var full_window_content = null;
var previousScrollOffset = 0;
var previouslyFocused = false;

/* Animate anchor links */

function getCumulativeOffset(obj) { // Offset from element to top of page

	var left, top;
    left = top = 0;

    if (obj.offsetParent) {

        do {

            left += obj.offsetLeft;
            top += obj.offsetTop;
            obj = obj.offsetParent;

        } while (obj);

    }

    return {

        x: left,
        y: top

    };

}

function animateAnchors(e) {

    if (!e || q('html').clientHeight > document.body.clientHeight) {

        return;

    }
    var el = e.target;

    while (typeof el.href !== 'string') { // If a child of the link is clicked

        el = el.parentNode;

    }
	
	if (el.href.split(/#|\?/)[0] != window.location.href.split(/#|\?/)[0]) { // External page?
		
		return;
	
	}

	var hash = null;
	if (el.href.split('#').pop().length > 0) {
	
	    hash = document.getElementById(el.href.split('#').pop());

	}

    scrollToAnimated((hash === null) ? 0 : getCumulativeOffset(hash).y, .5, (e) => { // To do: fix jumping to new hash – is the fallback executed properly in animate()?

        window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

    });

    return false;

}

function closestElement(el, target) { // Thanks http://gomakethings.com/ditching-jquery/ – Accepts either a selector string or an actual element

    for ( ; el && el !== document; el = el.parentNode ) {

		if (el === target) {
			
			return el;

		}

    }

    return false;

}

// Add .n-target to the :target element now, because :target is available too late, after all page content is loaded

let setHashClass = () => {
	
	if (q('.n-target')) {
	
		removeClass(q('.n-target'), 'n-target');
	
	}

	if (!!location.hash && q(location.hash)) {
		
		addClass(q(location.hash), 'n-target');
		
	}

}

setHashClass();

window.addEventListener('hashchange', setHashClass);

/* Chainable animation specified as CSS Animation */

var temp = document.createElement('temp');

var animations = {

	'animation'      	: 'animationend',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

};

var animationEndEvent = false;

for (var t in animations) {

    if (temp.style[t] !== 'undefined') {

        animationEndEvent = animations[t];

    }

}

function animate(el, animation_code, duration, callback) { // Default duration = .2s, callback optional

// To do: add animation-fill-mode: forwards to keep the end state

	if (!el.getAttribute('data-animation') && animationEndEvent) {

		el.addEventListener(animationEndEvent, function animationEndHandler(e) {
			
			stopEvent(e);
			var el = e.target; 
			document.head.removeChild(q('.' + el.getAttribute('data-animation')));
			el.removeAttribute('data-animation');
	 		el.removeEventListener(animationEndEvent, animationEndHandler);
			if (typeof callback === 'function') {
		
				callback();
		
			}
		
		}, false);

		var animation_name = `a${Math.round((Math.random()*1000000),10)}`; // Unique animation name

		var styles = document.createElement('style');
		styles.innerHTML = `@keyframes ${animation_name} {${animation_code}} [data-animation=${animation_name}] { animation-name: ${animation_name}; animation-duration: ${(!duration ? .2 : duration)}s; }`; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
		document.head.appendChild(styles);
		addClass(styles, animation_name);

		el.setAttribute('data-animation', animation_name);
	
	}
	
}

// Scroll the page to any position

function scrollToAnimated(to, duration, callback) {
	
	var difference = bodyElement.clientHeight - window.innerHeight;
	if (to > difference) {

		to = difference;

	}
	
	function scrollToCallback (callback) {

		q('html').scrollTop = bodyElement.scrollTop = to;
		if (typeof callback === 'function') {
			
			callback();
		
		}
		
	}
	
	animate(q('html'), `100% { transform: translate3d(0, ${-1*(to - (document.documentElement.scrollTop || bodyElement.scrollTop))}px, 0); }`, duration, scrollToCallback.bind(null, callback));

}

// Clicking a button copies a target element's contents

function copyButton (el, target, echo) {
	
	el.addEventListener('click', (event) => {

	  window.getSelection().removeAllRanges(); // Clear previous clipboard
	  var range = document.createRange();  
	  range.selectNode(target);  
	  window.getSelection().addRange(range);
	
	  try {  

		  document.execCommand('copy');
		  
		  if (!!echo && componentNotify) {
	
			  componentNotify.notify('📋 ' + target.textContent, 'fixed timeout');
		  
		  }

	  } catch(err) {

	  }  
	
	});
	
}

// Real time touch detection to support devices with both touch and mouse. http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
// To do: use an attribute instead of class
;(function(){

    var isTouch = false; //var to indicate current input type (is touch versus no touch) 
    var isTouchTimer;
     
    let addtouchclass = e => {

        clearTimeout(isTouchTimer);
        isTouch = true;
		addClass(q('html'), 'can-touch');

        isTouchTimer = setTimeout(() => {isTouch = false}, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event

    };
     
    let removetouchclass = e => {

        if (!isTouch){ //remove 'can-touch' class if not triggered by a touch event and class is present

            isTouch = false;
            removeClass(q('html'), 'can-touch');

        }

    };
     
    document.addEventListener('mouseover', removetouchclass, false); //this event gets called when input type is everything from touch to mouse/ trackpad
    document.addEventListener('touchstart', addtouchclass, false); //this event only gets called when input type is touch
    
    addtouchclass();

})();

function makeReady(el) {
	
	el.setAttribute('data-ready', true);

}

function focusWithin(selector) {

	// To do: If not IE/Edge, return q(selector + ':focus-within');

	var result = null;
	qa(selector).forEach((el) => {
		
		if (el.querySelector(':focus')) {
			
			result = el;

		}
		
	});
	
	return result;
	
}

function addComponent(host, el) {
	
	host.insertAdjacentHTML('afterbegin', el);
// 	initComponents(host); // No need, observer does it automatically

}

function initThreshold(host) {

// Scroll effects
	host.querySelectorAll('[data-threshold]:not([data-ready])').forEach((el) => { // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height
	
		window.addEventListener('scroll', () => {
	
			setTimeout(() => {
				
				var relativeScroll = q('html').scrollTop || bodyElement.scrollTop;
//				q('html').style.setProperty('--scroll-top', relativeScroll);
//				q('html').style.setProperty('--scroll-bottom', q('html').scrollHeight - relativeScroll - q('html').offsetHeight);
//				q('html').style.setProperty('--page-height', q('html').scrollHeight);
				var threshold = el.scrollHeight; // To do: either element height or data-threshold height in px, % or vh
	
				if (relativeScroll > threshold) {
					
					relativeScroll = threshold;
	
				}
				
				if (relativeScroll < 0) {
					
					relativeScroll = 0;
	
				}
				
				el.style.setProperty('--height', threshold);
				el.style.setProperty('--threshold', parseFloat((relativeScroll / threshold), 10).toPrecision(1)); // Percentage of threshold reached. 0 – 1. Can be used with CSS calc().
				// To do: Add --offset-top, --offset-bottom (distance from top/bottom of element to top/bottom of viewport)
	
				if (relativeScroll >= threshold) {
					
					addClass(el, 'threshold');
					bodyElement.setAttribute('data-threshold', true);
					
				} else {
					
					removeClass(el, 'threshold');
					removeClass(bodyElement, 'threshold');
					bodyElement.removeAttribute('data-threshold');
					
				}
				
			}, 50);
			
		});
		makeReady(el);
	
	});

}

var current_slider = q('.slider');
var draggingNow = false;

var components = new Array;

function registerComponent(name, init) {

	components[name] = new Array;
	components[name].push({ init: init });

}

function initComponents(host) {

	observerOff();
	
	var _host = !host ? bodyElement : host;

	for (let key in components) {
	
	    components[key][0].init(_host);
	
	}

	observerOn();

}
  
var observer = false;

function observerOn() {
	
	if (observer) {
		
		observer.observe(bodyElement, {childList: true, subtree: true});

	}
	
}

function observerOff() {

	if (observer) {
		
		observer.disconnect();
		
	}
	
}

if (typeof MutationObserver === 'function') {

	observer = new MutationObserver((mutations, observer) => {

        observerOff();

		var mutation = mutations[0];
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

			var i = 0;
			while (i < mutation.addedNodes.length) {
				
				var el = mutation.addedNodes[i++];
	            if (typeof el === 'object' && el.nodeName !== '#text' && !el.getAttribute('data-ready') && el.parentNode) {
		            
		            initComponents(el.parentNode);
		            
	            }
				
			}

        }

        observerOn();
	    
	});
	
}

initThreshold(bodyElement);

// Animate anchor link jumps
qa('a[href^="#"]').forEach((el) => {

	el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler

});
	
/*
	notifyCloseEvent();

	window.addEventListener('touchstart', function (e) {
		
		draggingNow = false;
		
	});

	window.addEventListener('touchmove', function (e) {
		
		draggingNow = true;
		
	});
*/

// Viewport element for iOS

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {

	let adjustViewport = () => {
		
		document.querySelectorAll('.n-viewport').forEach(el => {
	
			el.style.height = '100vh';
			el.style.marginTop = 0;
	// 		console.log('Element: ' + el.offsetHeight, 'Window: ' + window.innerHeight);
	
			if (el.offsetHeight > window.innerHeight) {
				
				el.style.height = `calc(100vh - ${el.offsetHeight - window.innerHeight}*1px)`;
				
			}
			
			if (el.getBoundingClientRect().y < 0) {
				
				el.style.marginTop = `${Math.abs(el.getBoundingClientRect().y)}px`;
				
			}
			
		});
		
	};
	
	adjustViewport();
	
	window.addEventListener('resize', e => {
		
		adjustViewport();
		setTimeout(adjustViewport, 200);
		
	});

}
