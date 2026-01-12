    // load the book that you selected & bull the library details
const selectedId = parseInt(localStorage.getItem("selectedBookId"));// find what you clicked in app.js
let library = JSON.parse(localStorage.getItem("myLibrary")) || []; // load the libary
let book = library.find(b => b.id === selectedId) || {}; // load the book you selected from that library

    // grab elements from the html to do things to them
document.addEventListener("DOMContentLoaded", () => {
    // grab elements from the html to do things to them (not the values, but the spot/item)
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

	 // populate those spots you found with values
    coverImage.src = book.cover || "https://via.placeholder.com/120x180?text=Cover"; // chatgpt did theimages
    titleInput.value = book.title || "";
    authorInput.value = book.author || "";
    publishedInput.value = book.published || "";
    pagesInput.value = book.pages || "";
    genreInput.value = book.genre || "";
    descriptionInput.value = book.description || "";
    commentsInput.value = book.comments || "";
	readButton.dataset.value = book.read ? "Yes" : "No"; // true = yes, false = no
	readButton.textContent = book.read ? "Yes" : "No"; // this changes the text that you see on the button dependent on above

	
    // press the back button and save all the fields asnew
    backButton.addEventListener("click", () => {
		book.title = titleInput.value;
        book.author = authorInput.value;
        book.published = publishedInput.value;
        book.pages = pagesInput.value;
        book.genre = genreInput.value // this is messy because of the way the genre filter works, need standardization
		.split(",")
		.map (g => g.trim())
		.filter(Boolean)
		.join(", ");
        book.read = readButton.dataset.value === "Yes"; // sets yes = true for boolean functionality
        book.rating = rating;
        book.comments = commentsInput.value;
        book.cover = coverImage.src;
        book.description = descriptionInput.value;

        localStorage.setItem("myLibrary", JSON.stringify(library));
        //alert("Book updated!");
	window.location.href="index.html";        
    });

    // the yes/no read button click
    readButton.addEventListener("click", () => { // this is a simple yes/no if check to change the display/value
        if (readButton.dataset.value === "No") { // check if it's no before you click, if it is, change to yes
            readButton.dataset.value = "Yes"; // value change
            readButton.textContent = "Yes"; // text change
        } else {
            readButton.dataset.value = "No"; // when you clicked it, it was yes so now it's no
            readButton.textContent = "No";
        }
    });

    //  star rating button clicks
    let rating = book.rating || 0; // book.rating is the rating saved, start at zero if there isn't one
    function renderStars() { // this is loading the stars
        Array.from(starContainer.children).forEach(star => { // 5 stars into an array and for each one
            star.textContent = parseInt(star.dataset.value) <= rating ? "★" : "☆"; // if star value < what you saved as rating, show as filled
        });
    }
    renderStars(); // immediately run the function 
    Array.from(starContainer.children).forEach(star => { // when you click each star 
        star.addEventListener("click", () => { // listen for click
            rating = parseInt(star.dataset.value); // update rating
            renderStars(); // immediately re-run & show new rating instantly.
        });
    });

    
    // this is getting from the API, chat gpt did more of this
    fetchButton.addEventListener("click", async () => { // listens for a click
        const isbn = isbnInput.value.trim();  // get the isbn from what they entered
        if (!isbn) return alert("you didn't enter an ISBN"); // if nothing, say nothing

        try { // cool, this preemptively tries for errors
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`); // call the API and wait until done
            const data = await response.json();//parse api to JSON and wait untl done

            if (!data.items || data.items.length === 0) { //!data.items is if null/undefined, data.items.length === 0 means if it pulls an array but the array is empty
                return alert("Book not found"); // nothing happens and booknot found
            }

            const volume = data.items[0].volumeInfo; // pull the first ISBN but there's usually only one. volumeInfo is from GB API JSON

            // populate each field based on API JSON field names/call. e.g., categories as a term comes from google, genreInput is yours
            titleInput.value = volume.title || ""; // text
            authorInput.value = (volume.authors || []).join(", "); // if it exists, put in an array, if not, make an empy array
            publishedInput.value = volume.publishedDate || ""; // date as text for now, maybe messy?
            pagesInput.value = volume.pageCount || ""; // text, revisit though 
            genreInput.value = (volume.categories || []).join(", "); // genres in an array
            descriptionInput.value = volume.description || ""; // text
			// tbd what is goingon below
            coverImage.src = (volume.imageLinks && volume.imageLinks.thumbnail) || "https://			via.placeholder.com/120x180?text=Cover";

        } catch (error) { // if the try fails, show an error (sick)
            console.error(error);
            alert("Error fetching book data");
        }
    });
});
