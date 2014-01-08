function is_touch_device() {
  return !!('ontouchstart' in window);
}

/*! jQuery Retina Plugin - v1.0 - 3/25/2012
* https://github.com/tylercraft/jQuery-Retina
* Copyright (c) 2012 Tyler Craft; Licensed MIT, GPL */
(function(a){a.fn.retina=function(b){var c={dataRetina:!0,suffix:"",checkIfImageExists:!1,customFileNameCallback:"",overridePixelRation:!1};b&&jQuery.extend(c,b);var d=!1;if(c.overridePixelRation||window.devicePixelRatio>=2)d=!0;return this.each(function(){var b=a(this);b.addClass("retina-off");if(!d)return!1;var e="";c.dataRetina&&b.attr("data-retina")&&(e=b.attr("data-retina")),c.suffix&&(e||(e=b.attr("src")));if(c.suffix){var f=e.replace(/.[^.]+$/,""),g=e.replace(/^.*\./,"");e=f+c.suffix+"."+g}c.customFileNameCallback&&(e=c.customFileNameCallback(b)),c.checkIfImageExists&&e?a.ajax({url:e,type:"HEAD",success:function(){b.attr("src",e),b.removeClass("retina-off"),b.addClass("retina-on")}}):e&&(b.attr("src",e),b.removeClass("retina-off"),b.addClass("retina-on"))})}})(jQuery)

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

/* Prizes slider: Bind control event handlers */

var numberprizes = 0;
var prizeswidth = 0;

function picks(pick,tot) {
	var ary = new Array(tot);
	for (var i = 0; i < tot; i++) ary[i] = i+1;
	function randOrd(){return (Math.round(Math.random())-0.5); }
	ary.sort(randOrd);
	return ary.slice(0,pick);
}

function leftclick (event) {
	
	$('a.prizesleft').unbind();
	$(this).stop();
	$('a.prizesleft, a.prizesright').css('opacity', '0.7');
	var l = parseInt ( $('#prizes div a').css('left') );
	if (l) { // slide right
		$('#prizes div a').animate ( { 'left': ( l + prizeswidth ) + 'px' }, 200, function () {
			$('a.prizesleft').click ( leftclick );
		});
	}
	else { // bounce in place
		$('a.prizesleft').css('opacity', '0.3');
		$('#prizes div a').animate ( { 'margin-left': '50px' }, 200, function () {
			$('#prizes div a').animate ( { 'margin-left': '0px' }, 100, function () {
				$('a.prizesleft').click ( leftclick );
			});
		});
	}
}

function rightclick (event) {
	$('a.prizesright').unbind();
	$(this).stop();
	$('a.prizesleft, a.prizesright').css('opacity', '0.7');
	var l = parseInt ( $('#prizes div a').css('left') );
	if ( (l + $('#prizes div a').width()) > (prizeswidth) ) { // slide left
		$('#prizes div a').animate ( { 'left': ( l - prizeswidth ) + 'px' }, 200, function () {
			$('a.prizesright').click ( rightclick );
		});
	}
	else { // bounce in place
		$('a.prizesright').css('opacity', '0.3');
		$('#prizes div a').animate ( { 'margin-left': '-50px' }, 200, function () {
			$('#prizes div a').animate ( { 'margin-left': '0' }, 100, function () {
				$('a.prizesright').click ( rightclick );
			});
		});
	}
}

/* Tooltip */

var tip;

function hide_tip (e) {

	$(tip).stop().animate({ 'opacity':'0' }, 200, function () { $(tip).hide() });

}

function show_tip (e) {

	tip = $(this).find('.tip');
	
	$(tip).parent().parent().css('position','relative'); // dangerous with absolutely-positioned containers, which should be avoided anyway
	
	$(tip).css('top', $(tip).parent().position().top + $(tip).parent().height() );
		
	$(tip).stop().show().animate({'opacity': '1'}, 200);
	
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
    _uacct = 'UA-820357-1',
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

	$('.concertina h3').click ( function () { // Concertina rule: The element between two h3 is the content of the first h3
		if ( $(this).next().css('display') == 'none' ) 
			$(this).next().show('fast');
		else
			$(this).next().hide('fast');
	});
	
/* Prizes slider: Randomize prizes */

	$('body').append("<div id=\"dummy\"></div>");
	$('#dummy').hide();

	numberprizes = $('#prizes div a img').length;

	var positions = new Array( numberprizes );
	positions = picks(numberprizes,numberprizes);
	
	$('#prizes div a').children('img').each ( function (n) {
		$('#dummy').append( $(this).parent().children('img:nth-child(' + (positions[n]) + ')').clone() );
	});

	$('#prizes div a').html('');
	
	$('#dummy').children('img').each ( function (n) {
		$(this).appendTo('#prizes div a');
	});
	
	$('#dummy').html('');
	
	$('#prizes div a').css ( 'width', ((numberprizes+1) * 103) + 'px' )

	prizeswidth = $('#prizes div').width();

/* Prizes slider: Bind control event handlers */

	$('a.prizesleft').click ( leftclick );
	$('a.prizesright').click ( rightclick );

/* Relay URI parameters to links */

	relay_parameters();
	
/* Modal window: open a link inside it */

	function add_blackbox () {

		$('#blackbox .modal-box > div:first-child').prepend('<div class="close"> × </div>');
		$('#blackbox .modal-box .close').click( close_blackbox );
		$('.modal-box').on('touchmove', close_blackbox );
		if ( $('#blackbox .modal-box').height() < window.innerHeight ) { // Center it vertically
			$('#blackbox .modal-box').css('margin', (( window.innerHeight - $('#blackbox .modal-box').height() ) /2 + window.scrollY ) + 'px auto' );
		}
		relay_parameters();
	}

	function close_blackbox () {
		$('html').css('background-color','#fff');
		$('#blackbox').remove();
	}

	$('a.modal-link, a.lightbox').click ( function () {
	
		$('body').prepend('<div id="blackbox"> <div class="modal-box"> <div> </div>');
		
		$('html').css('background-color','#333');
		
		$('#blackbox').click( close_blackbox );

		$('html').click( close_blackbox );
	
		$('#blackbox .modal-box').click( function (e) {
			e.stopPropagation();
		});

		if ( $(this).hasClass('lightbox') ) { // Show an image lightbox...
			var image_url = $(this).attr('href');
			$('#blackbox .modal-box').prepend('<img src="' + image_url + '" alt="Lightbox">', add_blackbox );
			
		} else // ... or load external content in a modal window 
		{
			
			$('#blackbox .modal-box').load (
				( ($(this).attr('href').split('#')[1] ) ? ($(this).attr('href').split('#')[0] + ' #' + $(this).attr('href').split('#')[1]) : ( $(this).attr('href') ) ), add_blackbox );
			
		}
		
		return false;
	});

/* Tooltip */
		
	$('.tool').click ( show_tip );

	if (!is_touch_device()) $('.tool').hover ( show_tip, hide_tip );

	$('.tool').on('touchmove', hide_tip);
	
/* Retina images replacement */

	$('img.retina').retina({suffix: "@2x"});
	
/* Add 'Back to top' button */

	$('body').append('<a class="backtotop"> ⬆ </a>');
	$('.backtotop').click ( function () {
		$('body,html').animate( { scrollTop: 0 }, 400 );
	});

/* Tables: Embed in a scrollable container */
	
	$('table').before('<div class="table-container"></div>');
	$('.table-container').each ( function () { 
		$(this).append( $(this).next() ); 
	} );

/* Hide Mobile Safari head */

	if ( is_touch_device() ) {
		
		  // Set a timeout...
	  setTimeout(function(){
	    // Hide the address bar!
	    window.scrollTo(0, 1);
	  }, 0);
	}
   	
   	// Activate date picker
/*
	$( '[type=date], .datepicker' ).pickadate({
		formatSubmit: 'yyyy/mm/dd'
	})
*/

	$('textarea').keyup ( function () {
		textArea = this;
		while (
			textArea.rows > 1 &&
			textArea.scrollHeight < textArea.offsetHeight
		)
		{	textArea.rows--}
		
		while (textArea.scrollHeight > textArea.offsetHeight)
		{	textArea.rows++ }
		textArea.rows++
		
	});
});

/* ███████████████████ After everything is loaded, including images ███████████████████ */

$(window).load(function() {

});
