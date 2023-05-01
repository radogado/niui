// Component Form – start
(function() {
  /* Form – start */
  function submitForm(e) {
    var el = e.target;
    var ready_to_submit = true;
    el.querySelectorAll(".n-form--mandatory:not([disabled])").forEach((el) => {
      if (
        (el.querySelector("input, select, textarea") && !el.querySelector("input, select, textarea").value) ||
        (el.querySelector("input[type=checkbox]") && !el.querySelector("input[type=checkbox]").checked) ||
        (el.querySelector("input[type=radio]") && !el.querySelector("input[type=radio]").checked) ||
        (el.querySelector("input[type=email]") && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector("input[type=email]").value)) ||
        (el.querySelector("input[type=url]") && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector("input[type=url]").value)) ||
        (el.querySelector("input[type=number]") && !RegExp(/^\d+$/).test(el.querySelector("input[type=number]").value)) ||
        (el.querySelector("input[type=number][data-digits]") &&
          el.querySelector("input[type=number]").value.length !== parseInt(el.querySelector("input[type=number]").dataset.digits))
      ) {
        ready_to_submit = false;
        el.querySelector("input").focus();
        el.classList.add("n-form--alert");
        // Margin animation, because transform animation hides neighbouring content on iPad
        let form = el.closest("form");
        form.animate([{ width: `${form.scrollWidth}px` }, { marginLeft: `-9px` }, { marginLeft: `18px` }, { width: `${form.scrollWidth}px`, marginLeft: 0 }], 250);
        return;
      } else {
        el.classList.remove("n-form--alert");
      }
    });
    return ready_to_submit;
  }

  function updateFileInput(e) {
    var el = e.target;
    el.parentNode.querySelector("span.n-form__file-name").innerHTML = el.value.substring(el.value.lastIndexOf("\\") + 1);
  }

  function toggleConditionalFieldset(e) {
    var el = e.target;
    var fieldset = document.querySelector(`fieldset#${el.closest(".n-form__condition").dataset.for}`) || el.closest(".n-form__condition").nextElementSibling;
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
        el.parentNode.querySelector("span").insertAdjacentHTML("afterbegin", "<span class=n-form__file-name></span>");
      });
      // 	Conditional form fieldsets
      el.querySelectorAll(".n-form__check.n-form__condition input").forEach((el, i) => {
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
      el.dataset.ready = true;
    });
  };
  nui.registerComponent("form", init);
})();
// Component Form – end