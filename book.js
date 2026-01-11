document.addEventListener("DOMContentLoaded", () => {
    // --- SELECT DOM ELEMENTS ---
    const backButton = document.getElementById("back-button");
    const isbnInput = document.getElementById("book-isbn");
    const fetchButton = document.getElementById("fetch-book");
    const titleInput = document.getElementById("book-title");
    const authorInput = document.getElementById("book-author");
    const publishedInput = document.getElementById("book-published");
    const pagesInput = document.getElementById("book-pages");
    const genreInput = document.getElementById("book-genre");
    const coverImage = document.getElementById("book-cover");
    const readButton = document.getElementById("book-read");
    const starContainer = document.getElementById("star-rating");
    const commentsInput = document.getElementById("book-comments");
    const saveButton = document.getElementById("save-book");
    const descriptionInput = document.getElementById("book-description");

    // --- BACK BUTTON ---
    backButton.addEventListener("click", () => {
	book.title = titleInput.value;
        book.author = authorInput.value;
        book.published = publishedInput.value;
        book.pages = pagesInput.value;
        book.genre = genreInput.value
		.split(",")
		.map (g => g.trim())
		.filter(Boolean)
		.join(", ");
        book.read = readButton.dataset.value === "Yes";
        book.rating = rating;
        book.comments = commentsInput.value;
        book.cover = coverImage.src;
        book.description = descriptionInput.value;

        localStorage.setItem("myLibrary", JSON.stringify(library));
        //alert("Book updated!");
	window.location.href="index.html";        
    });

    // --- LOAD SELECTED BOOK ---
    const selectedId = parseInt(localStorage.getItem("selectedBookId"));
    let library = JSON.parse(localStorage.getItem("myLibrary")) || [];
    let book = library.find(b => b.id === selectedId) || {};

    // --- POPULATE FIELDS ---
    coverImage.src = book.cover || "https://via.placeholder.com/120x180?text=Cover";
    titleInput.value = book.title || "";
    authorInput.value = book.author || "";
    publishedInput.value = book.published || "";
    pagesInput.value = book.pages || "";
    genreInput.value = book.genre || "";
    descriptionInput.value = book.description || "";
    commentsInput.value = book.comments || "";
	readButton.dataset.value = book.read ? "Yes" : "No";
	readButton.textContent = book.read ? "Yes" : "No";
    
	//readButton.textContent = book.read || "No";
    	//readButton.dataset.value = book.read || "No";

    // --- YES/NO TOGGLE ---
    readButton.addEventListener("click", () => {
        if (readButton.dataset.value === "No") {
            readButton.dataset.value = "Yes";
            readButton.textContent = "Yes";
        } else {
            readButton.dataset.value = "No";
            readButton.textContent = "No";
        }
    });

    // --- STAR RATING ---
    let rating = book.rating || 0;
    function renderStars() {
        Array.from(starContainer.children).forEach(star => {
            star.textContent = parseInt(star.dataset.value) <= rating ? "★" : "☆";
        });
    }
    renderStars();
    Array.from(starContainer.children).forEach(star => {
        star.addEventListener("click", () => {
            rating = parseInt(star.dataset.value);
            renderStars();
        });
    });

    
    // --- FETCH BOOK INFO BY ISBN ---
    fetchButton.addEventListener("click", async () => {
        const isbn = isbnInput.value.trim();
        if (!isbn) return alert("Please enter an ISBN");

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                return alert("Book not found");
            }

            const volume = data.items[0].volumeInfo;

            // Populate fields from API
            titleInput.value = volume.title || "";
            authorInput.value = (volume.authors || []).join(", ");
            publishedInput.value = volume.publishedDate || "";
            pagesInput.value = volume.pageCount || "";
            genreInput.value = (volume.categories || []).join(", ");
            descriptionInput.value = volume.description || "";
            coverImage.src = (volume.imageLinks && volume.imageLinks.thumbnail) || "https://			via.placeholder.com/120x180?text=Cover";

        } catch (error) {
            console.error(error);
            alert("Error fetching book data");
        }
    });
});
