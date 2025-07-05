// Quote storage
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspirational" },
  { text: "Simplicity is the soul of efficiency.", category: "Philosophy" }
];

// DOM Elements (create containers if not present in HTML)
const app = document.getElementById('app') || document.body;
const quoteDisplay = document.createElement('div');
quoteDisplay.id = 'quoteDisplay';
quoteDisplay.style.marginBottom = '20px';

const buttonsContainer = document.createElement('div');
buttonsContainer.style.marginBottom = '20px';

const addQuoteFormContainer = document.createElement('div');
addQuoteFormContainer.id = 'addQuoteFormContainer';

app.appendChild(quoteDisplay);
app.appendChild(buttonsContainer);
app.appendChild(addQuoteFormContainer);

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <small>Category: ${quote.category}</small>
  `;
}

// Function to create a form to add a new quote
function createAddQuoteForm() {
  addQuoteFormContainer.innerHTML = ''; // Clear any existing form

  const form = document.createElement('form');
  form.id = 'quoteForm';

  const textInput = document.createElement('textarea');
  textInput.placeholder = "Enter quote text";
  textInput.required = true;
  textInput.rows = 3;
  textInput.style.width = "100%";

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;
  categoryInput.style.marginTop = "10px";
  categoryInput.style.width = "100%";

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Add Quote';
  submitBtn.style.marginTop = "10px";

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);
  addQuoteFormContainer.appendChild(form);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const newQuote = {
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    };

    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      alert('Quote added successfully!');
      form.reset();
      showRandomQuote(); // Optionally show the new quote
    }
  });
}

// Create control buttons
const randomBtn = document.createElement('button');
randomBtn.textContent = 'Show Random Quote';
randomBtn.addEventListener('click', showRandomQuote);

const formBtn = document.createElement('button');
formBtn.textContent = 'Add New Quote';
formBtn.addEventListener('click', createAddQuoteForm);

buttonsContainer.appendChild(randomBtn);
buttonsContainer.appendChild(formBtn);

// Initial display
showRandomQuote();

// ============================
// Utilities for Local Storage
// ============================
const LOCAL_STORAGE_KEY = 'quotesArray';
const SESSION_STORAGE_KEY = 'lastViewedQuote';

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// ============================
// Initial Setup
// ============================
let quotes = loadQuotes();
if (quotes.length === 0) {
  quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspirational" },
    { text: "Simplicity is the soul of efficiency.", category: "Philosophy" }
  ];
  saveQuotes();
}

// ============================
// DOM Elements
// ============================
const app = document.getElementById('app') || document.body;
const quoteDisplay = document.createElement('div');
quoteDisplay.id = 'quoteDisplay';
quoteDisplay.style.marginBottom = '20px';

const buttonsContainer = document.createElement('div');
buttonsContainer.style.marginBottom = '20px';

const addQuoteFormContainer = document.createElement('div');
addQuoteFormContainer.id = 'addQuoteFormContainer';

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.style.marginTop = '10px';
importInput.onchange = importFromJsonFile;

app.appendChild(quoteDisplay);
app.appendChild(buttonsContainer);
app.appendChild(addQuoteFormContainer);
app.appendChild(importInput);

// ============================
// Show Random Quote
// ============================
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <small>Category: ${quote.category}</small>
  `;

  // Save to session storage
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

// ============================
// Create Add Quote Form
// ============================
function createAddQuoteForm() {
  addQuoteFormContainer.innerHTML = ''; // Clear form

  const form = document.createElement('form');
  form.id = 'quoteForm';

  const textInput = document.createElement('textarea');
  textInput.placeholder = "Enter quote text";
  textInput.required = true;
  textInput.rows = 3;
  textInput.style.width = "100%";

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;
  categoryInput.style.marginTop = "10px";
  categoryInput.style.width = "100%";

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Add Quote';
  submitBtn.style.marginTop = "10px";

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);
  addQuoteFormContainer.appendChild(form);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const newQuote = {
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    };

    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      saveQuotes();
      alert('Quote added successfully!');
      form.reset();
      showRandomQuote(); // Optionally show new quote
    }
  });
}

// ============================
// Export Quotes to JSON File
// ============================
function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================
// Import from JSON File
// ============================
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format.");

      importedQuotes.forEach(q => {
        if (q.text && q.category) {
          quotes.push({ text: q.text, category: q.category });
        }
      });

      saveQuotes();
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  fileReader.readAsText(file);
}

// ============================
// Load Last Viewed Quote
// ============================
function showLastViewedQuote() {
  const last = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <small>Category: ${quote.category} (Last viewed)</small>
    `;
  } else {
    showRandomQuote();
  }
}

// ============================
// Control Buttons
// ============================
const randomBtn = document.createElement('button');
randomBtn.textContent = 'Show Random Quote';
randomBtn.onclick = showRandomQuote;

const formBtn = document.createElement('button');
formBtn.textContent = 'Add New Quote';
formBtn.onclick = createAddQuoteForm;

const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export to JSON';
exportBtn.onclick = exportToJsonFile;

buttonsContainer.appendChild(randomBtn);
buttonsContainer.appendChild(formBtn);
buttonsContainer.appendChild(exportBtn);

// ============================
// Initialization
// ============================
showLastViewedQuote();

const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export to JSON';
exportBtn.onclick = exportToJsonFile;
buttonsContainer.appendChild(exportBtn);
function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.style.marginTop = '10px';
importInput.onchange = importFromJsonFile;

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.style.marginTop = '10px';
importInput.onchange = importFromJsonFile;
app.appendChild(importInput);
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format.");

      importedQuotes.forEach(q => {
        if (q.text && q.category) {
          quotes.push({ text: q.text, category: q.category });
        }
      });

      saveQuotes();
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  fileReader.readAsText(file);
}
