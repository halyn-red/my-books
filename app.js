// --- GRAB DOM ELEMENTS ---
const bookList = document.getElementById("book-list");
const scanButton = document.getElementById("scan-button");

// --- LOAD LIBRARY FROM LOCAL STORAGE ---
let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

// Make sure all books have read property (only if missing)
library.forEach(book => {
    if (typeof book.read !== "boolean") book.read = false;

	   // Make sure genre is a string
    if (Array.isArray(book.genre)) {
        book.genre = book.genre.join(", ");  // convert array to string
    }
    if (!book.genre || book.genre.trim() === "") {
        book.genre = "Uncategorized";       // default
    }
});

//---FILTERS
const filters = {
	read: "all",
	genre: "all"
};

//---APPLY FILTERS
/**
 * Filters and renders the library based on the active filter values.
 * 
 * Future-proof: You can add new filters by:
 *  1. Adding a property to the `filters` object.
 *  2. Adding a corresponding check inside this function.
 *  3. Hooking up a dropdown/input event listener to update the filter and call applyFilters().
 */
function applyFilters() {

    // Map through library and filter based on active filters
    const filtered = library.filter(book => {

        // --- Safe defaults ---
        // Use these variables to avoid undefined issues
        const readStatus = book.read ?? false;      // default unread
        const genreValue = book.genre ?? "Uncategorized";        // <-- CHANGED default matches new setup
        const ratingValue = book.rating ?? 0;       // example for future filter
        const authorValue = book.author ?? "";      // example for future filter

        // --- Read/Unread Filter ---
        // filters.read can be: "all", "read", "unread"
        if (filters.read === "read" && !readStatus) return false;
        if (filters.read === "unread" && readStatus) return false;

        // --- Genre Filter ---
        // filters.genre can be: "all" or any string matching book.genre
        if (filters.genre !== "all" && genreValue !== filters.genre) return false;

        // --- Example: Rating Filter (future) ---
        // if (filters.ratingMin && ratingValue < filters.ratingMin) return false;

        // --- Example: Author Filter (future) ---
        // if (filters.author !== "all" && authorValue !== filters.author) return false;

        // If the book passes all active filters, keep it
        return true;
    });

    // --- Render the filtered books ---
    renderLibrary(filtered);

    // --- Debug logs (optional, remove in production) ---
    console.log("Filters applied:", filters);
    console.log("Books displayed:", filtered.map(b => b.title));
}

const readFilter = document.getElementById("read-filter");
const genreFilter = document.getElementById("genre-filter");
 
//---POPULATE GENRE OPTIONS---//
function populateGenreFilter() {

	// make it all
    genreFilter.innerHTML = `<option value="all">all genres</option>`;
   
	// get the unique ones
    // --- CHANGED ---
    // now includes "Uncategorized" books as an option
    const genres = new Set(library.map(b => b.genre));

	// add each one as an option
    genres.forEach(g => {
        if (g && g.trim() !== "") { // <-- skip truly empty just in case
            const option = document.createElement("option");
            option.value = g;
            option.textContent = g;
            genreFilter.appendChild(option);
        }
    });
}

const clearFiltersButton = document.getElementById("clear-filters");

clearFiltersButton.addEventListener("click", () => {
    // Reset filter object
    filters.read = "all";
    filters.genre = "all";

    // Reset dropdowns visually
    readFilter.value = "all";
    genreFilter.value = "all";

    // Reapply filters
    applyFilters();
});


// --- RENDER LIBRARY ---
function renderLibrary(bookArray) {
    bookList.innerHTML = ""; // clear existing cards

    bookArray.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <button class="delete-book" title="Delete Book">×</button>
            <img src="${book.cover}" alt="Book Cover">
            <h2>${book.title}</h2>
            <p>${book.author}</p>
        `;

        // Card click → open book.html (skip delete button)
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-book")) return;
            localStorage.setItem("selectedBookId", book.id);
            window.location.href = "book.html";
        });

        // Delete book
        card.querySelector(".delete-book").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${book.title}"?`)) {
                library = library.filter(b => b.id !== book.id);
                localStorage.setItem("myLibrary", JSON.stringify(library));
                applyFilters();
            }
        });

        bookList.appendChild(card);
    });
}

// --- ADD NEW BOOK ---
function addNewBook() {
    const newBook = {
        id: Date.now(),
        title: "New Book",
        author: "",
        cover: "https://via.placeholder.com/100x150?text=Cover",
	    genre: "Uncategorized", // <-- CHANGED default to match new setup
 	    read: false,
 	    rating: 0,
 	    published: "",
 	    pages: "",
 	    description: "",
  	    comments: "",
  	    isbn: ""
    };
    library.unshift(newBook); // newest book first
    localStorage.setItem("myLibrary", JSON.stringify(library));

	// --- populate genres after adding new book ---
	populateGenreFilter();    
	applyFilters();
}

// --- ATTACH EVENTS ---
scanButton.addEventListener("click", addNewBook);
readFilter.addEventListener("change", () => {
	filters.read = readFilter.value;
	applyFilters();
});
genreFilter.addEventListener("change", () => {
    filters.genre = genreFilter.value;
    applyFilters();
});

// --- INITIAL RENDER ---

populateGenreFilter();
applyFilters();
