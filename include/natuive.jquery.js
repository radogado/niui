function is_touch_device() {
    return !!('ontouchstart' in window);
}

/* URI parameters */

function getURLParameters () { // return all URL parameters in an array

	var res = {},
		re = /[?&]([^?&]+)=([^?&]+)/g;
	location.href.replace(re, function(_,k,v) {
		res[k] = v;
	});
	return res;

}

function SetURLParameter( name, value, source ) { // if 'source' is missing, get it from the URI.

    name = escape(name);
    value = escape(value);

    var s = source ? source : window.location.href;
    var kvp = name + "=" + value;

    if ( !GetURLParameter(name, s) ) {
        // fix the source in case it doesn't have a parameter
        s += ( ( ( s.indexOf('?') >= 0 ) ? '&' : '?' ) + name + '=0');
    }

    var r = new RegExp("(&|\\?)" + name + "=[^\&]*");

    s = s.replace(r, "$1" + kvp);

    if (!RegExp.$1) {
        s += (s.length > 0 ? '&' : '?') + kvp;
    }

    // Fix hash in URI

    return s;

}

function updateURLParameter(url, param, paramVal) {
    // return input string with updated/added URL parameter
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function getURLParameters () { // return all URL parameters in an array

	var res = {},
		re = /[?&]([^?&]+)=([^?&]+)/g;
	location.href.replace(re, function(_,k,v) {
		res[k] = v;
	});
	return res;

}

/* Tooltip */

var tip;

function hideTip (e) {
	
	if (!tip) return;
	tip.style.display = 'none';
	tip.style.opacity = 0;

}

function showTip (e) {

	var event = e || window.event;
	var target = event.target || event.srcElement;

	tip = target.querySelector('.tip');
	if (!tip) return; //  fix it not to log error in console
	
	tip.parentNode.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway

	tip.style.top = (tip.parentNode.offsetTop + tip.parentNode.offsetHeight) + 'px';
			
	tip.style.opacity = 1;
	tip.style.display = 'block';
	
}

/* RID relay. Omit links starting with "javascript", "mailto" */

// get all URL parameters and relay them to all links on the page

function relay_parameters () {

    parameters = getURLParameters();

    $('a[href]:not(a[href^="javascript"]):not(a[href^="mailto"])').each( function () {

        for (var name in parameters) {
            var hash = $(this).attr('href').split('#')[1] ? ( '#' + $(this).attr('href').split('#')[1] ) : '';
            $(this).attr('href', updateURLParameter( $(this).attr('href').split('#')[0], name, parameters[name] ) + hash );

        }
    });

}

/* ███████████████████ After DOM is created ███████████████████ */

$(document).ready(function() {

    /* Click events for Concertina/Accordion */

	$('.accordion').each( function(n) {
		
		$(this).click ( function (e) {
			
			e.stopPropagation();
			
			$(this).children('div').css('max-height', (($(this).children('div').css('max-height') == '0px') ? ($(this).children('div')[0].scrollHeight + 'px') : '0px'));
			
			$(this).toggleClass('open');
			
			if ( $(this).parent().parent().hasClass('accordion') ) { // Embedded accordion

				$(this).parent().css('max-height', $(this).children('div')[0].scrollHeight + $(this).parent()[0].scrollHeight + 'px');

			}

			return false;
			
		});
				
		$(this).children('div').click (function (e) {  
			
			e.stopPropagation();
			
		});

	});

    /* Relay URI parameters to links */

    relay_parameters();

    /* Modal window: open a link inside it */

    function add_blackbox () {

        $('#blackbox').prepend('<div class="close"> ← ' + document.title +  '</div>');
        $('#blackbox .close').click( close_blackbox );
        relay_parameters();
    }

    function close_blackbox () {
        $('html').css('background-color', '#fff');
        $('#blackbox').remove();
		document.body.style.overflow = 'auto';
    }

    $('a.modal-link, a.lightbox').click ( function () {

		document.body.style.overflow = 'hidden';

        $('body').prepend('<div id="blackbox"> <div class="modal-box"> </div> </div>');

        $('html').css('background-color', '#333');

        $('#blackbox').click( close_blackbox );

        $('html').click( close_blackbox );

        $('#blackbox .close').click( function (e) {
            e.stopPropagation();
        });

        if ( $(this).hasClass('lightbox') ) {
            // Show an image lightbox...
            var image_url = $(this).attr('href');
            add_blackbox();

			/* Add any <a><img> siblings with description to a .slider and initialise its controls */
			images = '';
	
			$(this).parent().find('.lightbox').each ( function (n) {
				images += '<div><img src="' + $(this).attr('href') + '"></div>';
			} );
	
            $('#blackbox').prepend( '<div class="slider lightbox">' + images + '</div>' );
            
            if (makeSlider) {
            	
            	makeSlider( $('#blackbox .slider') );
				document.querySelector('#blackbox .slider').scrollLeft = $(this).index() *  document.querySelector('#blackbox .slider').offsetWidth;
            					
            }

        } else // ... or load external content in a modal window 
        {

            $('#blackbox .modal-box').load (
            ( ($(this).attr('href').split('#')[1] ) ? ($(this).attr('href').split('#')[0] + ' #' + $(this).attr('href').split('#')[1]) : ( $(this).attr('href') ) ), add_blackbox );

        }

        return false;
    });

    /* Tooltip */

    $('.tool').click ( showTip );

    if (!is_touch_device()) 
        $('.tool').hover ( showTip, hideTip );

    $('.tool').on('touchmove', hideTip);

    /* Add 'Back to top' button */

    $('body').append('<a class="backtotop"> ⬆ </a>');
    $('.backtotop').click ( function () {
        $('body,html').animate( {
            scrollTop: 0 
        }, 400 );
    });

    $('textarea').keyup ( function () {
        textArea = this;
        while (
        textArea.rows > 1 &&
        textArea.scrollHeight < textArea.offsetHeight
        )
        {
            textArea.rows--
        }

        while (textArea.scrollHeight > textArea.offsetHeight)
        {
            textArea.rows++ 
        }
        textArea.rows++

    });

/* Form validation */

	$('form').each( function (i) {
		el = this;
		el.onsubmit = function () {
			ready_to_submit = true;

			elements = el.querySelectorAll('.mandatory');
			Array.prototype.forEach.call(elements, function (el, i) {
				
				if (!el.querySelector('input, select, textarea').value) { 

					ready_to_submit = false;
					$(el).addClass('alert');

				} else {
					
					$(el).removeClass('alert');
					
				}

			});

			return ready_to_submit;
			
		};
		
	});

/* Fixed position top offset */
	
	document.querySelector('#top').style.minHeight = document.querySelector('#top .row').scrollHeight + 'px';
	
/* Prevent body scroll when mobile navigation is open */

	if ( document.querySelector('#nav-main > input.trigger') ) {
	
		document.querySelector('#nav-main > input.trigger').onchange = function (e) {
	
			 if (document.querySelector('#nav-main > input.trigger').checked) {
			 	$('body').addClass( 'lock-position');
			 } else {
			 	$('body').removeClass( 'lock-position');
			 }
	
		};
	
	}

});

/* ███████████████████ After everything is loaded, including images ███████████████████ */

$(window).load(function() {
});
