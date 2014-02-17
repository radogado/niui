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
