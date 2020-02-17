// Component Table – start

(function (){
    
/* Sort parent table's rows by matching column number alternatively desc/asc on click */
	function sortTable(table, column, f) {

		var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'), 0);;
		
		rows.sort((a, b) => {
		
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
	
	    for (let i in rows) {
	
	        table.querySelector('tbody').appendChild(rows[i]);
	
	    }
	    
	// 	observerOn();
	
	}

	let init = host => {
		
		host.querySelectorAll('.n-table:not([data-ready])').forEach((el) => {
		
			addClass(wrap(el), 'n-table--wrap');
			makeReady(el);
			el.parentNode.setAttribute('tabindex', 0);
		
		});
	
		host.querySelectorAll('td[data-sort]').forEach((el) => { // To do: work only on tables that aren't ready
			// asc or desc
			if (el.dataset.sort !== 'asc' && el.dataset.sort !== 'desc') {
				
				el.dataset.sort = 'desc';
				
			}
			
			function sortTableEvent(e) {
				
				stopEvent(e);
				var el = e.target;
				var cell = el.type === 'td' ? el : el.closest('td');
				var f; // Ascending
				if (cell.dataset.sort === 'desc') {
					
					f = -1;
					cell.dataset.sort = 'asc';
					
				} else {
					
					f = 1;
					cell.dataset.sort = 'desc';
					
				}
		
				sortTable(el.closest('table'), thisIndex(cell), f);
				
			}
			
			el.onclick = el.ontouchend = sortTableEvent;
		
		});
	
	};
	registerComponent('table', init);

})();

// Component Table – end
