BOOK LIBRARY PROJECT – COPY/PASTE-FRIENDLY SUMMARY

Files and Roles
index.html: HTML: Main library page showing books, add button, filters, dynamic book cards
book.html: HTML: Book details page with editable fields, read toggle, star rating, fetch ISBN
style.css: CSS: Styles both pages including layout, buttons, cards, filters, responsive tweaks
app.js: JS: Library page logic, load/save localStorage, render cards, add/delete books, filters
book.js: JS: Book details logic, load selected book, populate fields, toggle read, set rating, fetch API

index.html Elements
header: Header container for page title
h1: Header text "MY LIBRARY"
button: scan-button: Add new book
div: filters: Wraps filter buttons/dropdowns
button: clear-filters/filter-dropdown: Clears all filters
select: read-filter/filter-dropdown: Filter by read/unread
select: genre-filter/filter-dropdown: Filter by genre
div: book-list: Container for dynamically rendered book cards

book.html Elements
button: back-button: Save book info & return to library
h1: Header text "BOOK DETAILS"
div: book-details: Container for cover and fields columns
div: cover-column: Left column holding book cover image
img: book-cover: Displays book cover (placeholder default)
div: fields-column: Right column holding all input fields
div: field-row: Wrapper for each label + input/textarea
input: book-isbn: Enter ISBN to fetch book info
button: fetch-book: Trigger API fetch by ISBN
input: book-title: Book title
input: book-author: Book author
input: book-published: Published date
input: book-pages: Number of pages
input: book-genre: Book genres
textarea: book-description: Book description
button: book-read: Toggle read Yes/No
div: star-rating: Container for 5 clickable stars
textarea: book-comments: User comments
button: save-book (commented out): Save changes

CSS Classes / IDs
body: Global font Courier New, background #d0d0ca, text color #213e31, no margin/padding
header: Center text, font size 50px
header h1: Color #213e31, margin-top 40px, line-height 1
.filters: Flex container for filter buttons, gap 15px, margin-left 20px
.filter-dropdown: Buttons/dropdowns, bg #213e31, text white, border-radius 8px, hover scale/hover color
#scan-button/#save-book/#fetch-book/#back-button/#book-read: Styled buttons, hover color #71ae94, scale 1.05
#book-list: Flex container for book cards, wraps, gap 15px, center aligned
.book-card: Width 150px, height 300px, white background, border-radius 10px, hover scale 1.05
.book-card img: Width 80px, height 120px, object-fit cover
.delete-book: Small delete button on card
#book-details: Flex container for cover + fields columns, gap 20px, padding 20px
#cover-column: Flex-shrink 0
#fields-column: Flex column, gap 12px
.field-row: Flex row for label + input/textarea, gap 10px
.field-row label: No-wrap
.field-row input/textarea: Flex 1, padding 5-6px, border 1px solid #213e31, border-radius 5px
#star-rating span: Font-size 75px, pointer cursor, gold if filled
@media max-width 600px: Stack book-details vertically, resize cards and images

app.js Variables / Elements
bookList: DOM element #book-list
scanButton: DOM element #scan-button
library: Array from localStorage, holds all books
filters: Object {read: "all", genre: "all"}
readFilter: DOM element #read-filter
genreFilter: DOM element #genre-filter
clearFiltersButton: DOM element #clear-filters

app.js Functions
applyFilters(): Filters library array based on filters, calls renderLibrary()
populateGenreFilter(): Generates genre dropdown options from library
renderLibrary(bookArray): Clears #book-list, renders book cards, adds click events for navigation & delete
addNewBook(): Creates new book object, adds to library, updates localStorage, repopulates genres, applies filters

app.js Event Listeners
scanButton click: Calls addNewBook()
readFilter change: Updates filters.read & applies filters
genreFilter change: Updates filters.genre & applies filters
clearFiltersButton click: Resets filters & reapplies
book-card click: Navigates to book.html with selectedBookId unless delete button clicked
delete-book click: Deletes book from library & re-renders

book.js Variables / Elements
backButton: DOM element #back-button
isbnInput: DOM element #book-isbn
fetchButton: DOM element #fetch-book
titleInput: DOM element #book-title
authorInput: DOM element #book-author
publishedInput: DOM element #book-published
pagesInput: DOM element #book-pages
genreInput: DOM element #book-genre
coverImage: DOM element #book-cover
readButton: DOM element #book-read
starContainer: DOM element #star-rating
commentsInput: DOM element #book-comments
descriptionInput: DOM element #book-description
rating: Number, current star rating
library: Array from localStorage
book: Object, selected book

book.js Functions / Actions
renderStars(): Updates star icons based on rating
backButton click: Saves all fields to library & localStorage, returns to index.html
readButton click: Toggles Yes/No read status
starContainer > span click: Sets rating & updates stars
fetchButton click: Fetches book info by ISBN from Google Books API & populates fields

Execution Flow / Interactions
index.html loads → app.js loads library from localStorage → populateGenreFilter() → applyFilters() → renderLibrary()
User clicks + add book → addNewBook() → updates library & renders new card
User clicks book card → save selectedBookId → navigate to book.html
book.html loads → book.js retrieves selected book → populate fields
User edits fields, toggles read, sets rating, optionally fetches ISBN → clicks backButton → saves to localStorage → return to index.html
index.html reloads library → filtered and updated library displayed
Filters on index.html allow narrowing books by read status or genre

Recommendations
Fix index.html duplicate <head> tags
Uncomment save-book button in book.html if desired
Validate inputs (ISBN, pages, date)
Reduce repeated button styling in CSS using shared class
Fix cover placeholder link in book.js API fallback
Consider adding rating or author filters in app.js

Concise Takeaway
Two-page book library system. index.html lists books with add, delete, filter features. book.html edits individual books, toggles read, sets star rating, fetches info via API. CSS ensures consistent styling. JS handles data storage, rendering, filtering, interactivity. LocalStorage persists data between pages.
