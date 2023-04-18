// Component Table – start
(function () {
	/* Sort parent table's rows by matching column number alternatively desc/asc on click */
	const toggleSort = (th) => {
		let previous = th.closest("tr").querySelector("td[data-ascending]");
		if (previous && previous !== th) {
			delete previous.dataset.ascending;
		}
		return th.toggleAttribute("data-ascending");
	};
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
	const comparer = (idx, asc) => (a, b) => ((v1, v2) => (v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
	let init = (host) => {
		host.querySelectorAll(".n-table:not([data-ready])").forEach((el) => {
			el.querySelectorAll("thead td button.n-table__sort, th button.n-table__sort").forEach((button) => button.addEventListener("click", (e) => {
				let th = e.target.closest("th") || e.target.closest("td");
				const tbody = th.closest("table").querySelector("tbody");
				Array.from(tbody.querySelectorAll("tr")).sort(comparer(Array.from(th.parentNode.children).indexOf(th), toggleSort(th))).forEach((tr) => tbody.appendChild(tr));
			}));
			el.dataset.ready = true;
			el.setAttribute("tabindex", 0); // To scroll with arrow keys
		});
	};
	nui.registerComponent("table", init);
})();
// Component Table – end