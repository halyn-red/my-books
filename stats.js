let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

function genreTable() {
    const tableBody = document.getElementById('table-genre');
    const genres = new Set(library.map(g => g.genre)); 
	
    // Clear existing rows (optional, for re-populating)
    tableBody.innerHTML = '';

    genres.forEach(genre => {
        // Create a new table row element (<tr>)
        const row = document.createElement('tr');
        const valueToCount = genre;
        const count = library.filter(obj => obj.genre === valueToCount).length;
        // Create table cell elements (<td>) for each data point
        const genreCell = document.createElement('td');
        const genreCount = document.createElement('td');
        // Set the text content of the cells
        genreCell.textContent =  genre;
        genreCount.textContent = count;
 

        // Append cells to the row
        row.appendChild(genreCell);
	row.appendChild(genreCount);

        // Append the completed row to the table body
        tableBody.appendChild(row);
});
}

const backButton = document.getElementById("back-button");

backButton.addEventListener("click", () => {        
	window.location.href="index.html";        
    });



function authorTable() {
    const tableBody = document.getElementById('table-author');
    const authors = new Set(library.map(a => a.author)); 
	
    // Clear existing rows (optional, for re-populating)
    tableBody.innerHTML = '';

    authors.forEach(author => {
        // Create a new table row element (<tr>)
        const row = document.createElement('tr');
        const valueToCount = author;
        const count = library.filter(obj => obj.author === valueToCount).length;
        // Create table cell elements (<td>) for each data point
        const authorCell = document.createElement('td');
        const authorCount = document.createElement('td');
        // Set the text content of the cells
        authorCell.textContent =  author;
        authorCount.textContent = count;
 

        // Append cells to the row
        row.appendChild(authorCell);
	row.appendChild(authorCount);

        // Append the completed row to the table body
        tableBody.appendChild(row);
});
}

// Call the function to populate the table when the script runs
genreTable();
authorTable();
