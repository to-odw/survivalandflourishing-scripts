// Function to make grid tables sortable
function makeGridSortable() {
    // Find all elements with the table-sort attribute
    document.querySelectorAll('.in-grid[table-sort]').forEach(header => {
        console.log('Processing header:', header); // Log each header being processed

        // Get the value of the table-sort attribute
        const sortValue = header.getAttribute('table-sort');
        const colCount = parseInt(sortValue, 10);

        // Disable sorting if table-sort is 0
        if (colCount === 0 || isNaN(colCount)) {
            console.log('Sorting disabled for this header.');
            return;
        }

        console.log('Column count:', colCount);

        // Add a click event listener to the header
        header.addEventListener('click', () => {
            console.log(`Header clicked: ${header.textContent.trim()}`);

            // Find the grid container (parent element with grid layout)
            const grid = header.closest('.w-layout-grid');
            if (!grid) {
                console.error('Grid container not found for header:', header);
                return;
            }

            // Get all rows as arrays of cells (skip headers)
            const rows = Array.from(grid.children).filter(child => !child.classList.contains('is-header'));
            console.log('Rows before grouping:', rows);

            // Group cells into rows based on colCount
            const groupedRows = [];
            for (let i = 0; i < rows.length; i += colCount) {
                groupedRows.push(rows.slice(i, i + colCount));
            }
            console.log('Grouped rows:', groupedRows);

            // Determine column index
            const colIndex = Array.from(grid.children).filter(child => child.classList.contains('is-header')).indexOf(header);
            if (colIndex === -1) {
                console.error('Column index not found for header:', header);
                return;
            }
            console.log('Column index:', colIndex);

            // Rotate sort state stored on the header element
            let sortState = parseInt(header.getAttribute('data-sort-state') || '-1', 10);
            sortState = sortState === -1 ? 0 : (sortState === 0 ? 1 : 0); // First click ascending, then toggle
            header.setAttribute('data-sort-state', sortState);
            console.log('Updated sort state:', sortState);

            // Sort rows based on the content of the clicked column
            if (sortState < 2) {
                groupedRows.sort((rowA, rowB) => {
                    const cellA = rowA[colIndex].textContent.trim();
                    const cellB = rowB[colIndex].textContent.trim();

                    let comparison;
                    // Compare as numbers if both are numeric, otherwise as strings
                    if (!isNaN(cellA) && !isNaN(cellB)) {
                        comparison = parseFloat(cellA) - parseFloat(cellB);
                    } else {
                        comparison = cellA.localeCompare(cellB, undefined, { numeric: true });
                    }

                    return sortState === 0 ? comparison : -comparison; // Ascending or Descending
                });
            } else {
                // Reset to original order
                groupedRows.sort((rowA, rowB) => {
                    const indexA = rows.indexOf(rowA[0]);
                    const indexB = rows.indexOf(rowB[0]);
                    return indexA - indexB;
                });
                console.log('Reset to original order:', groupedRows);
            }

            // Clear the grid content (excluding headers)
            rows.forEach(row => grid.removeChild(row));

            // Append the sorted rows back to the grid
            groupedRows.forEach(row => {
                row.forEach(cell => grid.appendChild(cell));
            });

            console.log('Grid updated with sorted rows.');
        });
    });
}

// Initialize sortable grids on DOMContentLoaded
document.addEventListener('DOMContentLoaded', makeGridSortable);
