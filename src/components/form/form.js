// Component Form – start

(function (){
    
/* Form – start */

function submitForm(e) {

    var el = e.target;

    var ready_to_submit = true;

    forEach(el.querySelectorAll('.mandatory'), function(el) {
	    
	    if (closest(el, '[disabled]')) { // Ignore disabled conditional fields
		    
		    return;

	    }

        if (
			( el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value ) 
			|| 
			( el.querySelector('input[type=checkbox]') && !el.querySelector('input[type=checkbox]').checked ) 
			||
			( el.querySelector('input[type=email]') && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector('input[type=email]').value) ) 
			||
			( el.querySelector('input[type=url]') && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector('input[type=url]').value) ) 
			||
			( el.querySelector('input[type=number]') 
				&& 
				!(RegExp(/^\d+$/).test(el.querySelector('input[type=number]').value))
				||
				(el.querySelector('input[type=number][data-digits]') && (el.querySelector('input[type=number]').value.length != el.querySelector('input[type=number]').getAttribute('data-digits')))
			) ||
			( el.querySelector('input[type=radio]') && !el.querySelector('input[type=radio]').checked )
		   ) 
		
		{

            ready_to_submit = false;
            el.querySelector('input').focus();
            addClass(el, 'alert');
            return;

        } else {

            removeClass(el, 'alert');

        }

    });

    if (!ready_to_submit) {

        return false;

    }

    if (!hasClass(el, 'dynamic') || !(new XMLHttpRequest().upload) || !php_support) { // Browser unable to submit dynamically.

        return true;

    }

    el.insertAdjacentHTML('beforeend', '<input name=targetformurl type=hidden value=' + encodeURIComponent( el.method === 'get' ? el.action.replace(/\/?(\?|#|$)/, '/$1') : el.action ) + '>');

    request = new XMLHttpRequest();
    request.open('POST', scripts_location + 'request.php', true);

    request.onreadystatechange = function() {

        if (request.readyState != 4 || request.status != 200) {

            // php script unreachable, submit form normally
            return true;

        }

        if (!request.responseText || !php_support) {

            // php script unreachable, submit form normally
            el.onsubmit = function() {};
			el.constructor.prototype.submit.call(el); // el.submit();
            return true;

        }

        // strip id's from response HTML
        if (request.responseText.indexOf('---error---') != -1) {

            // Error
            document.getElementById('formresult').innerHTML = 'Error submitting form.';
            return;

        } else {

            // Success
            var loaded_html = parseHTML(request.responseText);
            document.getElementById('formresult').innerHTML = loaded_html.innerHTML;

        }

    };

    openFullWindow('<div id=formresult>Submitting form...</div>');

    request.send(new FormData(el));

    return false;

}

function updateFileInput(e) {

    var el = e.target;

    el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);

}

if (q('form.language')) { // To do: make it universal .submitonchange and for more than 1 form

    q('form.language select').onchange = function(e) {

        q('form.language').submit();

    };

}

function toggleConditionalFieldset(e) {
	
	var el = e.target;
	var fieldset = closest(el, '.condition').nextElementSibling;
	var attribute = 'disabled';
	
	if (el.checked) {
	
		fieldset.removeAttribute(attribute);
	
	} else {
		
		fieldset.setAttribute(attribute, 'disabled');
		
	}
	
}

/* Form – end */

	var init = function(host) {
		
		forEach(host.querySelectorAll('form'), function(el, i) {
		
		    el.onsubmit = el.onsubmit || submitForm;
		    makeReady(el);
		
		});
		
		forEach(host.querySelectorAll('input[type=file]'), function(el, i) {
		
		    el.onchange = updateFileInput;
		
		});
		
	// 	Conditional form fieldsets
	
		forEach(host.querySelectorAll('.checkbox.condition input'), function(el, i) {
			
			el.onchange = toggleConditionalFieldset;
		
		});
		
		// Auto textarea height.
		
		forEach(host.querySelectorAll('textarea[data-auto]'), function(el) {
		
		    el.onkeyup = function(e) {
		
		        el = e.target;
		
		        while (el.rows > 1 && el.scrollHeight < el.offsetHeight) {
		
		            el.rows--;
		
		        }
		
		        while (el.scrollHeight > el.offsetHeight) {
		
		            if (el.rows > 20) {
		
		                break;
		
		            }
		            el.rows++;
		
		        }
		
		        el.rows++;
		
		    };
		
		});
	
	};
	registerComponent('form', init);

})();

// Component Form – end
