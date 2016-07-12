Array.prototype.indexOf = function(el) {

    var len = this.length >>> 0;

    from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0)
        from += len;

    for (; from < len; from++) {
        if (from in this && this[from] === el)
            return from;
    }
    return -1;

};

// avoid overwriting Array.prototype.lastIndexOf
// otherwise it becomes enumerable, which leads to
// errors in Chrome
[].lastIndexOf || (Array.prototype.lastIndexOf = function(
   a, // item to be found
   b  // index placeholder
) { 
   for (
     // initialize index
     b=this.length;
     // if the index decreased by one is not already -1
     // index is not set (sparse array)
     // and the item at index is not identical to the searched one
     ~--b && (!(b in this) || this[b] !== a););
   // return index of last found item or -1
   return b
})
