let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () => {        
	window.location.href="index.html";        
    });

const TBR_SLOTS = 5;

let tbr = JSON.parse(localStorage.getItem("tbr")) 
          || Array(TBR_SLOTS).fill(null);

function renderTBR() {
  document.querySelectorAll(".tbr-slot").forEach(slot => {
    const index = slot.dataset.slot;
    const bookId = tbr[index];

    slot.innerHTML = "";

    if (!bookId) {
      renderEmptySlot(slot, index);
    } else {
      const book = library.find(b => b.id === bookId);
      renderFilledSlot(slot, index, book);
    }
  });
}


function renderEmptySlot(slot, index) {
  slot.innerHTML = `
    <input type="text" placeholder="select book.." 
           class="tbr-search" data-slot="${index}">
    <ul class="tbr-results"></ul>
  `;
}


document.addEventListener("input", e => {
  if (!e.target.classList.contains("tbr-search")) return;

  const query = e.target.value.toLowerCase();
  const slotIndex = e.target.dataset.slot;
  const resultsEl = e.target.nextElementSibling;

  resultsEl.innerHTML = "";

  if (!query) return;

  library
    .filter(book => book.title.toLowerCase().includes(query))
    .slice(0, 5)
    .forEach(book => {
      const li = document.createElement("li");
      li.textContent = book.title;
      li.onclick = () => addToTBR(slotIndex, book.id);
      resultsEl.appendChild(li);
    });
});

function addToTBR(slotIndex, bookId) {
  tbr[slotIndex] = bookId;
  saveAndRender();
}

function removeFromTBR(slotIndex) {
  tbr[slotIndex] = null;
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("tbr", JSON.stringify(tbr));
  renderTBR();
}

function renderFilledSlot(slot, index, book) {
  slot.innerHTML = `
    <div class="book">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <button onclick="removeFromTBR(${index})">Remove</button>
    </div>
  `;
}


renderTBR();
