// --- GRAB DOM ELEMENTS ---
const bookList = document.getElementById("book-list");
const scanButton = document.getElementById("scan-button");

// --- LOAD LIBRARY FROM LOCAL STORAGE ---
let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

// --- RENDER LIBRARY ---
function renderLibrary() {
    bookList.innerHTML = ""; // clear existing cards

    library.forEach(book => {
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
                renderLibrary();
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
        cover: "https://via.placeholder.com/100x150?text=Cover"
    };
    library.unshift(newBook); // newest book first
    localStorage.setItem("myLibrary", JSON.stringify(library));
    renderLibrary();
}

// --- ATTACH EVENTS ---
scanButton.addEventListener("click", addNewBook);

// --- INITIAL RENDER ---
renderLibrary();
