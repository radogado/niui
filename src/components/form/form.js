// Component Form – start

(function (){
    
/* Form – start */

	function submitForm(e) {
	
	    var el = e.target;
	
	    var ready_to_submit = true;
	
	    el.querySelectorAll('.n-form--mandatory').forEach((el) => {
		    
		    if (el.closest('[disabled]')) { // Ignore disabled conditional fields
			    
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
	            addClass(el, 'n-form--alert');
// 				animate(el.closest('form'), '33% { transform: translateX(-9px) } 66% { transform: translateX(9px) } 100% { transform: translateX(0) } ', 999);
				// Margin animation, because transform animation hides neighbouring content on iPad
				let form = el.closest('form');
				animate(form, `0% { width: ${form.scrollWidth}px; } 33% { margin-left: -9px; } 66% { margin-left: 18px; } 100% { width: ${form.scrollWidth}px; margin-left: 0; }`, .25);
	            return;
	
	        } else {
	
	            removeClass(el, 'n-form--alert');
	
	        }
	
	    });
	
	    if (!ready_to_submit) {
	
	        return false;
	
	    }
	
	    if (!hasClass(el, 'n-form--dynamic') || !(new XMLHttpRequest().upload) || !php_support) { // Browser unable to submit dynamically.
	
	        return true;
	
	    }
	
	    el.insertAdjacentHTML('beforeend', `<input name=targetformurl type=hidden value=${encodeURIComponent( el.method === 'get' ? el.action.replace(/\/?(\?|#|$)/, '/$1') : el.action )}>`);
	
	    request = new XMLHttpRequest();
	    request.open('POST', scripts_location + 'request.php', true);
	
	    request.onreadystatechange = () => {
	
	        if (request.readyState != 4 || request.status != 200) {
	
	            // php script unreachable, submit form normally
	            return true;
	
	        }
	
	        if (!request.responseText || !php_support) {
	
	            // php script unreachable, submit form normally
	            el.onsubmit = () => {};
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
	
	    componentModal.openFullWindow('<div id=formresult>Submitting form...</div>');
	
	    request.send(new FormData(el));
	
	    return false;
	
	}
	
	function updateFileInput(e) {
	
	    var el = e.target;
	
	    el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);
	
	}
	
	if (q('.n-form--language')) { // To do: make it universal .submitonchange and for more than 1 form
	
	    q('.n-form--language select').onchange = (e) => {
	
	        q('.n-form--language').submit();
	
	    };
	
	}
	
	function toggleConditionalFieldset(e) {
		
		var el = e.target;
		var fieldset = el.closest('.n-form--condition').nextElementSibling;
		var attribute = 'disabled';
		
		if (el.checked) {
		
			fieldset.removeAttribute(attribute);
		
		} else {
			
			fieldset.setAttribute(attribute, 'disabled');
			
		}
		
	}

/* Form – end */

	var init = (host) => {
		
		host.querySelectorAll('form.n-form').forEach((el, i) => {
		
		    el.onsubmit = el.onsubmit || submitForm;
		
			el.querySelectorAll('input[type=file]').forEach((el, i) => {
			
			    el.onchange = updateFileInput;
			
			});
			
		// 	Conditional form fieldsets
		
			el.querySelectorAll('.n-form--check.n-form--condition input').forEach((el, i) => {
				
				el.onchange = toggleConditionalFieldset;
			
			});
			
			// Auto textarea height.
			
			el.querySelectorAll('textarea[data-auto]').forEach((el) => {
			
			    el.onkeyup = (e) => {
			
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

		    makeReady(el);
		
		});
	
	};

	registerComponent('form', init);

})();

// Component Form – end
