// Function to make both grid and table sortable
function makeSortable() {
    document.querySelectorAll('[table-sort]').forEach(header => {
        console.log('Processing header:', header);

        // Get the column index
        const colIndex = Array.from(header.parentNode.children).indexOf(header);
        if (colIndex === -1) return;

        header.addEventListener('click', () => {
            console.log(`Header clicked: ${header.textContent.trim()}`);

            const table = header.closest('table');
            const grid = header.closest('.w-layout-grid');

            if (table) {
                sortTable(table, colIndex, header);
            } else if (grid) {
                sortGrid(grid, colIndex, header);
            }
        });
    });
}

// Function to sort table rows, pushing blanks to the bottom
function sortTable(table, colIndex, header) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    let rows = Array.from(tbody.querySelectorAll('tr'));
    let sortState = parseInt(header.getAttribute('data-sort-state') || '-1', 10);
    sortState = sortState === -1 ? 0 : (sortState === 0 ? 1 : 0);
    header.setAttribute('data-sort-state', sortState);

    rows.sort((rowA, rowB) => {
        let cellA = rowA.children[colIndex].textContent.trim();
        let cellB = rowB.children[colIndex].textContent.trim();

        // Handle empty values: push them to the bottom
        if (!cellA && !cellB) return 0;
        if (!cellA) return 1;
        if (!cellB) return -1;

        let comparison;
        if (!isNaN(cellA.replace(/[$,]/g, '')) && !isNaN(cellB.replace(/[$,]/g, ''))) {
            comparison = parseFloat(cellA.replace(/[$,]/g, '')) - parseFloat(cellB.replace(/[$,]/g, ''));
        } else {
            comparison = cellA.localeCompare(cellB, undefined, { numeric: true });
        }

        return sortState === 0 ? comparison : -comparison;
    });

    rows.forEach(row => tbody.appendChild(row));
}

// Function to sort grid rows, pushing blanks to the bottom
function sortGrid(grid, colIndex, header) {
    const rows = Array.from(grid.children).filter(child => !child.classList.contains('is-header'));
    const colCount = parseInt(header.getAttribute('table-sort'), 10);

    if (isNaN(colCount) || colCount === 0) {
        console.error('Invalid column count for sorting.');
        return;
    }

    const groupedRows = [];
    for (let i = 0; i < rows.length; i += colCount) {
        groupedRows.push(rows.slice(i, i + colCount));
    }

    let sortState = parseInt(header.getAttribute('data-sort-state') || '-1', 10);
    sortState = sortState === -1 ? 0 : (sortState === 0 ? 1 : 0);
    header.setAttribute('data-sort-state', sortState);

    groupedRows.sort((rowA, rowB) => {
        const cellA = rowA[colIndex]?.textContent.trim() || "";
        const cellB = rowB[colIndex]?.textContent.trim() || "";

        // Handle empty values: push them to the bottom
        if (!cellA && !cellB) return 0;
        if (!cellA) return 1;
        if (!cellB) return -1;

        let comparison;
        if (!isNaN(cellA.replace(/[$,]/g, '')) && !isNaN(cellB.replace(/[$,]/g, ''))) {
            comparison = parseFloat(cellA.replace(/[$,]/g, '')) - parseFloat(cellB.replace(/[$,]/g, ''));
        } else {
            comparison = cellA.localeCompare(cellB, undefined, { numeric: true });
        }

        return sortState === 0 ? comparison : -comparison;
    });

    rows.forEach(row => grid.removeChild(row));
    groupedRows.forEach(row => row.forEach(cell => grid.appendChild(cell)));
}

// Initialize sortable tables and grids on DOMContentLoaded
document.addEventListener('DOMContentLoaded', makeSortable);
