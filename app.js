// --- grab elements from HTML, if you're going to use them in the JS, have to be got
const bookList = document.getElementById("book-list");
const scanButton = document.getElementById("scan-button");
const clearFiltersButton = document.getElementById("clear-filters"); // clear-filters is the ID in the html
const readFilter = document.getElementById("read-filter");// current selected value in the dropdown
const genreFilter = document.getElementById("genre-filter");
const authorFilter = document.getElementById("author-filter");

// --- library comes from local storage which is confusing to me
let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

// make sure all books have read property because issues with blanks
library.forEach(book => {
    if (typeof book.read !== "boolean") book.read = false;
// Make sure genre is a string, because issues if it wasn't
    if (Array.isArray(book.genre)) {
        book.genre = book.genre.join(", ");  // convert array to string
    }
    if (!book.genre || book.genre.trim() === "") {
        book.genre = "Uncategorized";       // default or when you leave itblank
    }
// copying genre for author
    if (Array.isArray(book.author)) {
        book.author = book.author.join(", ");  // convert array to string
    }
    if (!book.author || book.author.trim() === "") {
        book.author = "No Author";       // default or when you leave itblank
    }
});

function displayChildCount() {
  // Get the parent element you want to count children from
  const parentElement = document.getElementById('book-list'); // e.g., <div id="myParent">

  // Get the count of direct child elements
  const count = parentElement.childElementCount; // or parentElement.children.length

  // Find an element to display the count in (e.g., <span id="countDisplay"></span>)
  const displayElement = document.getElementById('resultNum');

  // Update the display element's text with the count
  if (displayElement) {
	displayElement.textContent = count;
    //displayElement.textContent= `This element has ${count} child elements.`;
  }
}

// Call the function when the page loads or an event happens



//---this is the filters section
const filters = { // define what the filters are
	read: "all",
	genre: "all",
	author: "all"
};
/**
 * For a new filter:
 *	1. Adding a property to the `filters` object.
 *  2. Adding a corresponding check inside this function.
 *  3. Hooking up a dropdown/input event listener to update the filter and call applyFilters().
 */
function applyFilters() {
    // Go through library and filter based on active filters, return filtered list
    const filtered = library.filter(book => {
        // Use these variables to avoid undefined issues (start with something somothing blank)
        const readStatus = book.read ?? false;      // default unread
        const genreValue = book.genre ?? "Uncategorized";        // default uncategorized
        const ratingValue = book.rating ?? 0;       // doesn't exist yet
        const authorValue = book.author ?? "No Author";      // doesn't exist yet

        // --- Read/Unread Filter ---
	// filters.read is the filter selection, rest is filter + selection combo (true/false confusing, defaults false)
        if (filters.read === "read" && !readStatus) return false;
        if (filters.read === "unread" && readStatus) return false;
        // --- Genre Filter ---
        // filters.genre can be: "all" or any string matching book.genre
        if (filters.genre !== "all" && genreValue !== filters.genre) return false;
        // if (filters.ratingMin && ratingValue < filters.ratingMin) return false;

	//---Author Filter---
		if (filters.author !== "all" && authorValue !== filters.author) return false;

        // If the book passes all active filters, keep it in filtered

        return true;
    });

    // --- Render/show the filtered books ---
    renderLibrary(filtered);
    displayChildCount()

	
}
 
//populate genre dropdown
function populateGenreFilter() {
	// this makes it all of them and "all genres" at the top when you refresh/start
    genreFilter.innerHTML = `<option value="all">all genres</option>`;
    // these are the genres that exist as a set
	// for each book, get the genre and put them in a new set (to be dropdown options), b is book in the library
	const genres = new Set(library.map(b => b.genre)); // sets only keep unique values by default
	// add each one as an option
    genres.forEach(g => { // for each genre you loop through 
        if (g && g.trim() !== "") { // skip it if empty, because there wre issues
            const option = document.createElement("option"); //add it as an option element which is a dropdown choice/selection
            option.value = g;  // the value of the option is the genre
            option.textContent = g; // show the genre name in the dropdown, the visible text
            genreFilter.appendChild(option); // add the option to the list of options this function makes & shows
        }
    });
}

// POPULATE AUTHOR DROPDOWN
function populateAuthorFilter() {
	// this makes it all of them and "all author" at the top when you refresh/start
    authorFilter.innerHTML = `<option value="all">all authors</option>`;
    // these are the authors that exist as a set
	// for each book, get the genre and put them in a new set (to be dropdown options), b is book in the library
	const authors = new Set(library.map(bb => bb.author)); // sets only keep unique values by default
	// add each one as an option
    authors.forEach(a => { // for each author you loop through 
        if (a && a.trim() !== "") { // skip it if empty, because there wre issues
            const option = document.createElement("option"); //add it as an option element which is a dropdown choice/selection
            option.value = a;  // the value of the option is the genre
            option.textContent = a; // show the genre name in the dropdown, the visible text
            authorFilter.appendChild(option); // add the option to the list of options this function makes & shows
        }
    });
}

// render library (new load, new book, deleting, changing filters)
function renderLibrary(bookArray) {
    bookList.innerHTML = ""; // clear existing cards, start from "scratch" each refresh to re-iterate

    bookArray.forEach(book => { //for each book in the book list
        const card = document.createElement("div"); // create a card
        card.className = "book-card"; //that is of the book-card class
        // this is what's in the card that's visibly for the html
		card.innerHTML = ` 
            <button class="delete-book" title="Delete Book">×</button>
            <img src="${book.cover}" alt="Book Cover">
            <h2>${book.title}</h2>
            <p>${book.author}</p>
        `;
        // this creates the listener, isn't actually clicking. means when it renders library, if you click, this happens:
        card.addEventListener("click", (e) => { // i don't know why this is in the function though
            if (e.target.classList.contains("delete-book")) return; // exclude delete button part of card
            localStorage.setItem("selectedBookId", book.id); // save the ID so we can load details in book.html
            window.location.href = "book.html"; //take us to book
        });
        // Delete book
        card.querySelector(".delete-book").addEventListener("click", (e) => { // select just the button
            e.stopPropagation(); //means you don't also click the card because delete is in the card
            if (confirm(`Delete "${book.title}"?`)) { //confirm with user
                library = library.filter(b => b.id !== book.id); // remove from array
                localStorage.setItem("myLibrary", JSON.stringify(library)); //update local storage with new library
                applyFilters(); // refresh the list, which doesn't have it anymore
            }
        });

        bookList.appendChild(card); // make the card visible on the page, adds book-card to bookList container
    });
}

// new book
function addNewBook() { // what happens when you press new book button
    const newBook = { // this is what a new book is
        id: Date.now(), // makes the IDs unique so it's not numbered anymore
        title: "New Book",
        author: "No Author",
        cover: "https://via.placeholder.com/100x150?text=Cover", // chatgpt did this image stuff idk
	    genre: "Uncategorized", // because issues with filtering before
 	    read: false, // because issues with filtering before
 	    rating: 0, // start at zero
 	    published: "", // keeping as text for now, don't trust yet
 	    pages: "",
 	    description: "",
  	    comments: "",
  	    isbn: ""
    };
    library.unshift(newBook); // newest book first, unshift adds as first item
    localStorage.setItem("myLibrary", JSON.stringify(library)); // put it in local storage so its there between reloads

	// --- populate genres after adding new book ---
	populateGenreFilter();    // reload the new genre options
	populateAuthorFilter();
	applyFilters(); // apply any filters
}

// --- events: button clicks mostly/always---
scanButton.addEventListener("click", addNewBook); // when you press the add newbook button, run the function
readFilter.addEventListener("change", () => { // when the read/unread filter changes
	filters.read = readFilter.value; // set the new value as the filter
	applyFilters(); // run the new filters
});
genreFilter.addEventListener("change", () => { // when the genre selection changes
    filters.genre = genreFilter.value; // set it as the dropdown selection
    applyFilters(); // apply filters
});
authorFilter.addEventListener("change", () => { // when author selection changes
    filters.author = authorFilter.value; // set it as the dropdown selection
    applyFilters(); // apply filters
});
clearFiltersButton.addEventListener("click", () => { // when clicked
    // Reset filter object (filtered = all)
    filters.read = "all";
    filters.genre = "all";
	filters.author = "all";
    // Reset dropdowns visually (to designated text values, defined in filters themselves the innherhtml)
    readFilter.value = "all";
    genreFilter.value = "all";
	authorFilter.value = "all";
    // Reapply filters, which is all
    applyFilters();
});

// every time you reload, pull the genres and apply the filters 
populateGenreFilter();
populateAuthorFilter();
applyFilters();
