/**
 * Exercise 5: Non-Trivial Direct -> CPS Transformations
 * 
 * Exercise 5.1: Quicksort in CPS
 */

// First let's implement a regular quicksort function (recursive)
function quicksort(lst) {
    // Base case
    if (lst.length <= 1) return lst;

    // Choose pivot
    const pivot = lst[0];

    // Partition arrays with proper declarations
    const left_sub_array = lst.slice(1).filter(x => x <= pivot);
    const right_sub_array = lst.slice(1).filter(x => x > pivot);

    // Complete return with all parts: left + pivot + right
    return [...quicksort(left_sub_array), pivot, ...quicksort(right_sub_array)];
}

console.log(quicksort([23, 4, 0, 55, 6, 7, 12])); // [0, 4, 6, 7, 12, 23, 55]


function quicksortCPS(lst, k) {
    if (lst.length <= 1) k(lst);
    else {
        const pivot = lst[0]; // choose the first element as pivot

        const left_sub_array = lst.slice(1).filter(x => x <= pivot);
        const right_sub_array = lst.slice(1).filter(x => x > pivot);
        
        quicksortCPS(left_sub_array, function (lr) {
            quicksortCPS(right_sub_array, function (rr) {
                k([...lr, pivot, ...rr]);
            })
        })
    }
}

quicksortCPS([23, 4, 0, 55, 6, 7, 12], console.log)