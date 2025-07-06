// ============================
// Utilities for Local & Session Storage
// ============================
const LOCAL_STORAGE_KEY = 'quotesArray';
const SESSION_STORAGE_KEY = 'lastViewedQuote';

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspirational" },
    { text: "Simplicity is the soul of efficiency.", category: "Philosophy" }
  ];
}

// ============================
// Initial Setup
// ============================
let quotes = loadQuotes();
saveQuotes();

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
importInput.id = 'importFile';
importInput.onchange = importFromJsonFile;

app.appendChild(quoteDisplay);
app.appendChild(buttonsContainer);
app.appendChild(addQuoteFormContainer);
app.appendChild(importInput);

// ============================
// Functions
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

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
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
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  fileReader.readAsText(file);
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

// ============================
// Feature Checks (Console Warnings)
// ============================
console.log('--- Feature Check ---');

// 1. Check export quotes button
const exportCheck = document.getElementById('exportQuotesBtn');
if (exportCheck) {
  console.log('✅ Export quotes button found.');
} else {
  console.warn('❌ Export quotes button not found!');
}

// 2. Check exportToJsonFile function
if (typeof exportToJsonFile === 'function') {
  console.log('✅ exportToJsonFile function exists.');
} else {
  console.warn('❌ exportToJsonFile function is missing!');
}

// 3. Check import quotes file input
const importCheck = document.getElementById('importFile');
if (importCheck) {
  console.log('✅ Import file input found.');
} else {
  console.warn('❌ Import file input not found!');
}

// 4. Check importFromJsonFile function
if (typeof importFromJsonFile === 'function') {
  console.log('✅ importFromJsonFile function exists.');
} else {
  console.warn('❌ importFromJsonFile function is missing!');
}

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  // ============ CATEGORY DROPDOWN SETUP ============
const categoryFilter = document.createElement('select');
categoryFilter.id = 'categoryFilter';
categoryFilter.style.marginBottom = '20px';

const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = 'All Categories';
categoryFilter.appendChild(defaultOption);

app.insertBefore(categoryFilter, quoteDisplay);

// LocalStorage Key for filter
const CATEGORY_FILTER_KEY = 'lastSelectedCategory';
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear old options (except "All Categories")
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  }

  );

  // Restore saved filter (if any)
  const savedFilter = localStorage.getItem(CATEGORY_FILTER_KEY);
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
    filterQuotes(); // Auto-filter
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

if (newQuote.text && newQuote.category) {
  quotes.push(newQuote);
  saveQuotes();
  populateCategories(); // 👈 New: refresh dropdown
  alert('Quote added successfully!');
  form.reset();
  showRandomQuote();
}
categoryFilter.addEventListener('change', filterQuotes);
populateCategories(); // Initial dropdown setup

showLastViewedQuote();
categoryFilter.addEventListener('change', filterQuotes);
populateCategories();
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simulated endpoint
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate quote structure
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));

    return serverQuotes;
  } catch (error) {
    console.error('Error fetching from server:', error);
    return [];
  }
}
async function pushLocalQuotesToServer() {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotes),
    });

    const result = await response.json();
    console.log('Pushed to server:', result);
  } catch (error) {
    console.error('Error pushing to server:', error);
  }
}
function mergeQuotes(serverQuotes) {
  const merged = [...quotes];

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(
      q => q.text === serverQuote.text && q.category === serverQuote.category
    );
    if (!exists) {
      merged.push(serverQuote);
      showNotification('New quote added from server: "' + serverQuote.text + '"');
    }
  });

  quotes = merged;
  saveQuotes();
  populateCategories();
  filterQuotes();
}
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeQuotes(serverQuotes);
}
const notificationBox = document.createElement('div');
notificationBox.id = 'notificationBox';
notificationBox.style.color = 'white';
notificationBox.style.background = 'darkorange';
notificationBox.style.padding = '10px';
notificationBox.style.marginTop = '10px';
notificationBox.style.display = 'none';
app.insertBefore(notificationBox, quoteDisplay);
function showNotification(message) {
  notificationBox.textContent = message;
  notificationBox.style.display = 'block';
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 5000);
}
syncWithServer(); // Run on load
// OLD
// async function syncWithServer() { ... }

// ✅ NEW
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeQuotes(serverQuotes);
}

// Auto-sync every 30 seconds
setInterval(syncWithServer, 30000);
showLastViewedQuote();
populateCategories();
filterQuotes();
categoryFilter.addEventListener('change', filterQuotes);
//syncWithServer();
//setInterval(syncWithServer, 30000);

syncQuotes(); // Run immediately
setInterval(syncQuotes, 30000); // Run every 30 seconds
saveQuotes();              // ✅ Store in localStorage
populateCategories();      // ✅ Update dropdown
filterQuotes();            // ✅ Refresh display
const notificationBox = document.createElement('div');
notificationBox.id = 'notificationBox';
notificationBox.style.color = 'white';
notificationBox.style.background = 'darkorange';
notificationBox.style.padding = '10px';
notificationBox.style.marginTop = '10px';
notificationBox.style.display = 'none';
app.insertBefore(notificationBox, quoteDisplay);
function showNotification(message) {
  notificationBox.textContent = message;
  notificationBox.style.display = 'block';
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 5000);
}
if (!exists) {
  merged.push(serverQuote);
  showNotification('New quote from server: "' + serverQuote.text + '"');
}
// Server URL
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch mock server data
async function fetchQuotesFromServer() {
  const res = await fetch(SERVER_URL);
  const data = await res.json();
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: 'Server'
  }));
}

// Sync function (main one)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeQuotes(serverQuotes);
}

// Merge logic
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

// Notification UI
function showNotification(message) {
  notificationBox.textContent = message;
  notificationBox.style.display = 'block';
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 5000);
}
syncQuotes();                         // Initial run
setInterval(syncQuotes, 30000);       // Every 30 seconds
