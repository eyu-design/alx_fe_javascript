// ============================
// Constants & Storage Keys
// ============================
const LOCAL_STORAGE_KEY = 'quotesArray';
const SESSION_STORAGE_KEY = 'lastViewedQuote';
const CATEGORY_FILTER_KEY = 'lastSelectedCategory';
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// ============================
// Initial Quote Data & Loading
// ============================
function loadQuotes() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspirational" },
    { text: "Simplicity is the soul of efficiency.", category: "Philosophy" }
  ];
}

let quotes = loadQuotes();
saveQuotes();

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// ============================
// DOM Setup
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
importInput.id = 'importFile';
importInput.onchange = importFromJsonFile;

const categoryFilter = document.createElement('select');
categoryFilter.id = 'categoryFilter';
categoryFilter.style.marginBottom = '20px';

const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = 'All Categories';
categoryFilter.appendChild(defaultOption);

const notificationBox = document.createElement('div');
notificationBox.id = 'notificationBox';
notificationBox.style.color = 'white';
notificationBox.style.background = 'darkorange';
notificationBox.style.padding = '10px';
notificationBox.style.marginTop = '10px';
notificationBox.style.display = 'none';

app.appendChild(categoryFilter);
app.appendChild(quoteDisplay);
app.appendChild(notificationBox);
app.appendChild(buttonsContainer);
app.appendChild(addQuoteFormContainer);
app.appendChild(importInput);

// ============================
// Functions
// ============================
function showNotification(message) {
  notificationBox.textContent = message;
  notificationBox.style.display = 'block';
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 5000);
}

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

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

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

function createAddQuoteForm() {
  addQuoteFormContainer.innerHTML = '';

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
      populateCategories();
      alert('Quote added successfully!');
      form.reset();
      showRandomQuote();
    }
  });
}

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
      populateCategories();
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  fileReader.readAsText(file);
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem(CATEGORY_FILTER_KEY);
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(CATEGORY_FILTER_KEY, selectedCategory);

  let filtered = quotes;
  if (selectedCategory) {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <small>Category: ${quote.category}</small>
  `;

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

// ============================
// Server Sync Simulation
// ============================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    return serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));
  } catch (error) {
    console.error('Error fetching from server:', error);
    return [];
  }
}

function mergeQuotes(serverQuotes) {
  const merged = [...quotes];

  serverQuotes.forEach(q => {
    const exists = quotes.some(local => local.text === q.text && local.category === q.category);
    if (!exists) {
      merged.push(q);
      showNotification('New quote from server: "' + q.text + '"');
    }
  });

  quotes = merged;
  saveQuotes();
  populateCategories();
  filterQuotes();
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeQuotes(serverQuotes);
}

// ============================
// Buttons
// ============================
const randomBtn = document.createElement('button');
randomBtn.textContent = 'Show Random Quote';
randomBtn.onclick = showRandomQuote;

const formBtn = document.createElement('button');
formBtn.textContent = 'Add New Quote';
formBtn.onclick = createAddQuoteForm;

const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export to JSON';
exportBtn.id = 'exportQuotesBtn';
exportBtn.onclick = exportToJsonFile;

buttonsContainer.appendChild(randomBtn);
buttonsContainer.appendChild(formBtn);
buttonsContainer.appendChild(exportBtn);

// ============================
// Initialization
// ============================
showLastViewedQuote();
populateCategories();
filterQuotes();
categoryFilter.addEventListener('change', filterQuotes);
syncQuotes();
setInterval(syncQuotes, 30000);