// Component Grid with inline popups – start

(function () {
	/* Grid with inline popups – start */

	function initGridInlinePopups(host) {
		// Limitation: each row must have equal width columns.

		host.querySelectorAll(".grid-inline-popup:not([data-ready])").forEach((el) => {
			var id = `id${new Date().getTime()}`; // Unique id
			el.id = el.id || id;
			var cells = el.querySelectorAll(`#${el.id} > div:not(.grid-inline-popup--popup)`);
			var popups = el.querySelectorAll(`#${el.id} > .grid-inline-popup--popup`);

			if (el.id === id) {
				el.removeAttribute("id");
			}

			cells.forEach((el) => {
				function openNewItem(e, current_popup) {
					var cell = e.target.closest(".grid-inline-popup > div");
					var columns = Math.round(cell.parentElement.scrollWidth / cell.scrollWidth);
					var el = cell.nextElementSibling;
					if (el === current_popup) {
						return;
					}

					var index = Array.prototype.indexOf.call(popups, el);

					// Rewind index to start of row (when cell horizontal offest === parent horizontal offset)

					var index_row = index;

					while (index_row >= columns && cells[index_row].offsetLeft > cells[index_row].previousElementSibling.previousElementSibling.offsetLeft) {
						index_row--;
					}

					if (index_row < columns) {
						index_row = 0;
					}

					index -= index_row;
					var i = 0;
					while (i < index_row) {
						cells[i++].style.order = -1;
					}

					// Set order = -1 until index_row and subtract index_row from index

					index -= index % columns; // compensate with remainder

					i = index_row;

					while (i < cells.length) {
						cells[i].style.order = i - index_row < index - index_row ? -1 : 1;
						i++;
					}

					i = 0;
					while (i < columns) {
						cells[i + index_row].style.order = -1;
						i++;
					}

					el.setAttribute("aria-expanded", "true");
					el.previousElementSibling.setAttribute("aria-expanded", "true");
					var height = el.scrollHeight;
					el.style.maxHeight = 0;
					el.style.overflow = "hidden";
					animate(el, `100% { max-height: ${height}px; }`, 0.2, () => {
						el.style.cssText = "";
					});
				}

				function openCell(e) {
					var current_popup = e.target.closest(".grid-inline-popup").querySelector(".grid-inline-popup--popup[aria-expanded]");
					if (current_popup) {
						current_popup.style.maxHeight = current_popup.scrollHeight + "px";
						current_popup.style.overflow = "hidden";
						animate(current_popup, "100% { max-height: 0; }", 0.2, () => {
							current_popup.removeAttribute("aria-expanded");
							current_popup.previousElementSibling.removeAttribute("aria-expanded");
							current_popup.style.cssText = "";
							openNewItem(e, current_popup);
						});
					} else {
						openNewItem(e);
					}
				}

				el.setAttribute("tabindex", 0);
				el.addEventListener("click", openCell);
				// 			el.addEventListener('touchend', openCell);
				el.addEventListener("keyup", (e) => {
					if (e.key === "Enter") {
						openCell(e);
					}
				});
			});
			makeReady(el);
		});
	}

	/* Grid with inline popups – end */

	let init = (host) => {
		initGridInlinePopups(host);
	};
	registerComponent("grid-inline-popups", init);
})();

// Component Grid with inline popups – end
