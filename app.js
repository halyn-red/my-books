// --- GRAB DOM ELEMENTS ---
const bookList = document.getElementById("book-list");
const scanButton = document.getElementById("scan-button");

// --- LOAD LIBRARY ---
let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

// Preload 25 dummy books if empty
if (library.length === 0) {
    for (let i = 1; i <= 25; i++) {
        library.push({
            id: i,
            title: `Book ${i}`,
            author: `Author ${i}`,
            cover: "https://via.placeholder.com/100x150?text=Cover"
        });
    }
    localStorage.setItem("myLibrary", JSON.stringify(library));
}

// --- RENDER LIBRARY ---
function renderLibrary() {
    bookList.innerHTML = ""; // clear existing
    library.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <img src="${book.cover}" alt="Book Cover">
            <h2>${book.title}</h2>
            <p>${book.author}</p>
        `;

        // Click card → open book.html
        card.addEventListener("click", () => {
            localStorage.setItem("selectedBookId", book.id);
            window.location.href = "book.html";
        });

        bookList.appendChild(card);
    });
}

// --- ADD NEW BOOK ---
function addNewBook() {
    const newBook = {
        id: library.length + 1,
        title: `New Book ${library.length + 1}`,
        author: "Author Name",
        cover: "https://via.placeholder.com/100x150?text=Cover"
    };
    library.push(newBook);
    localStorage.setItem("myLibrary", JSON.stringify(library));
    renderLibrary();
}

// --- ATTACH EVENTS ---
scanButton.addEventListener("click", addNewBook);

// --- INITIAL RENDER ---
renderLibrary();
