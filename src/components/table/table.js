// Component Table – start

(function (){
    
/* Sort parent table's rows by matching column number alternatively desc/asc on click */
	function sortTable(table, column, f) {

	var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'), 0);;
	
	rows.sort(function(a, b) {
	
		var A = a.querySelectorAll('td')[column].textContent.toUpperCase();
		var B = b.querySelectorAll('td')[column].textContent.toUpperCase();
		
		if(A < B) {
			
			return 1*f;
			
		}

		if(A > B) {
			
			return -1*f;

		}

		return 0;
	
	});

// 	observerOff();

    for (var i = 0; i < rows.length; i++) {

        table.querySelector('tbody').appendChild(rows[i]);

    }
    
// 	observerOn();

}

	var init = function (host) {
		
		forEach(host.querySelectorAll('table:not([data-ready])'), function(el) {
		
			addClass(wrap(el), 'n-tbl');
			makeReady(el);
			el.parentNode.setAttribute('tabindex', 0);
		
		});
	
		if (typeof q('body').dataset !== 'undefined') { // el.dataset.sort not supported by IE10
		
			forEach(host.querySelectorAll('td[data-sort]'), function (el) { // To do: work only on tables that aren't ready
				// asc or desc
				if (el.dataset.sort !== 'asc' && el.dataset.sort !== 'desc') {
					
					el.dataset.sort = 'asc';
					
				}
				
				function sortTableEvent (e) {
					
					stopEvent(e);
					var el = e.target;
					var cell = el.type === 'td' ? el : closest(el, 'td');
					var f; // Ascending
					if (cell.dataset.sort === 'desc') {
						
						f = -1;
						cell.dataset.sort = 'asc';
						
					} else {
						
						f = 1;
						cell.dataset.sort = 'desc';
						
					}
			
					sortTable(closest(el, 'table'), thisIndex(cell), f);
					
				}
				
				el.onclick = el.ontouchend = sortTableEvent;
			
			});
		
		}
	
	};
	registerComponent('table', init);

})();

// Component Table – end
