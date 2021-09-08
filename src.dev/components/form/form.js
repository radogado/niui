// Component Form – start

(function() {
	/* Form – start */

	function submitForm(e) {
		var el = e.target;

		var ready_to_submit = true;

		el.querySelectorAll(".n-form__mandatory").forEach((el) => {
			if (el.closest("[disabled]")) {
				// Ignore disabled conditional fields

				return;
			}

			if (
				(el.querySelector("input, select, textarea") && !el.querySelector("input, select, textarea").value) ||
				(el.querySelector("input[type=checkbox]") && !el.querySelector("input[type=checkbox]").checked) ||
				(el.querySelector("input[type=email]") && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector("input[type=email]").value)) ||
				(el.querySelector("input[type=url]") && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector("input[type=url]").value)) ||
				(el.querySelector("input[type=number]") && !RegExp(/^\d+$/).test(el.querySelector("input[type=number]").value)) ||
				(el.querySelector("input[type=number][data-digits]") && el.querySelector("input[type=number]").value.length !== el.querySelector("input[type=number]").dataset.digits) ||
				(el.querySelector("input[type=radio]") && !el.querySelector("input[type=radio]").checked)
			) {
				ready_to_submit = false;
				el.querySelector("input").focus();
				addClass(el, "n-form--alert");
				// 				animate(el.closest('form'), '33% { transform: translateX(-9px) } 66% { transform: translateX(9px) } 100% { transform: translateX(0) } ', 999);
				// Margin animation, because transform animation hides neighbouring content on iPad
				let form = el.closest("form");
				// animate(form, `0% { width: ${form.scrollWidth}px; } 33% { margin-left: -9px; } 66% { margin-left: 18px; } 100% { width: ${form.scrollWidth}px; margin-left: 0; }`, 0.25);

				form.animate([{ width: `${form.scrollWidth}px` }, { marginLeft: `-9px` }, { marginLeft: `18px` }, { width: `${form.scrollWidth}px`, marginLeft: 0 }], 250);
				return;
			} else {
				removeClass(el, "n-form--alert");
			}
		});

		return ready_to_submit;
	}

	function updateFileInput(e) {
		var el = e.target;

		el.parentNode.querySelector("span.n-form--file-name").innerHTML = el.value.substring(el.value.lastIndexOf("\\") + 1);
	}

	if (q(".n-form__language")) {
		// To do: make it universal .submitonchange and for more than 1 form

		q(".n-form__language select").onchange = (e) => {
			q(".n-form__language").submit();
		};
	}

	function toggleConditionalFieldset(e) {
		var el = e.target;
		var fieldset = el.closest(".n-form--condition").nextElementSibling;
		var attribute = "disabled";

		if (el.checked) {
			fieldset.removeAttribute(attribute);
		} else {
			fieldset.setAttribute(attribute, "disabled");
		}
	}

	/* Form – end */

	let init = (host) => {
		host.querySelectorAll("form.n-form").forEach((el, i) => {
			el.onsubmit = el.onsubmit || submitForm;

			el.querySelectorAll("input[type=file]").forEach((el, i) => {
				el.onchange = updateFileInput;
				el.parentNode.querySelector("span").insertAdjacentHTML("afterbegin", "<span class=n-form--file-name></span>");
			});

			// 	Conditional form fieldsets

			el.querySelectorAll(".n-form--check.n-form--condition input").forEach((el, i) => {
				el.onchange = toggleConditionalFieldset;
			});

			// Auto textarea height.

			el.querySelectorAll("textarea[data-auto]").forEach((el) => {
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

	registerComponent("form", init);
})();

// Component Form – end