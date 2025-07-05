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
