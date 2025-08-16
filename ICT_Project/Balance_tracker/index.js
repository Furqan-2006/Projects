// script.js
let balance = 0;
const balanceDisplay = document.getElementById('balance');
const lenderList = document.getElementById('lender-list');
const dropdownContent = document.getElementById('lender-dropdown-content');
const expenseDropdownContent = document.getElementById('expense-dropdown-content');
const expenseList = document.getElementById('expense-list');
const notification = document.getElementById('notification');

// Debug DOM elements
console.log("DOM Elements:", { balanceDisplay, lenderList, dropdownContent, expenseList, notification });

if (!balanceDisplay || !lenderList || !dropdownContent || !expenseList || !notification) {
    console.error("Required DOM elements are missing:", {
        balanceDisplay, lenderList, dropdownContent, expenseList, notification
    });
}

// Function to show a notification
function showNotification(message) {
    console.log("Showing notification:", message);
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

// Test localStorage functionality
function testLocalStorage() {
    try {
        localStorage.setItem('testKey', 'testValue');
        const value = localStorage.getItem('testKey');
        console.log("LocalStorage test - Saved and retrieved:", value);
        localStorage.removeItem('testKey');
    } catch (e) {
        console.error("LocalStorage test failed:", e);
    }
}
testLocalStorage();

window.onload = function () {
    console.log("window.onload triggered");

    // Debug raw localStorage contents
    console.log("Raw localStorage - balance:", localStorage.getItem('balance'));
    console.log("Raw localStorage - lenders:", localStorage.getItem('lenders'));
    console.log("Raw localStorage - expenses:", localStorage.getItem('expenses'));

    // Load balance
    let savedBalance = null;
    try {
        savedBalance = localStorage.getItem('balance');
        console.log("Loaded balance from localStorage:", savedBalance);
    } catch (e) {
        console.error("Failed to access localStorage for balance:", e);
    }
    if (savedBalance !== null) {
        balance = parseFloat(savedBalance);
    }
    console.log("Balance after load:", balance);

    // Load lenders
    let savedLenders = [];
    try {
        const rawLenders = localStorage.getItem('lenders');
        if (rawLenders) {
            savedLenders = JSON.parse(rawLenders);
            console.log("Parsed lenders from localStorage:", savedLenders);
        } else {
            console.log("No lenders found in localStorage, using default: []");
            savedLenders = [];
        }
    } catch (e) {
        console.error("Failed to parse lenders from localStorage:", e);
        savedLenders = [];
    }
    savedLenders.forEach(lender => {
        const li = document.createElement('li');
        li.setAttribute('data-name', lender.name);
        li.setAttribute('data-amount', lender.amount.toString());
        li.innerHTML = `${lender.name}: PKR ${lender.amount.toFixed(2)} <button onclick="removeLender(this)">Remove</button>`;
        lenderList.appendChild(li);
        console.log("Added lender to DOM:", lender);
    });

    // Load expenses
    let savedExpenses = [];
    try {
        const rawExpenses = localStorage.getItem('expenses');
        if (rawExpenses) {
            savedExpenses = JSON.parse(rawExpenses);
            console.log("Parsed expenses from localStorage:", savedExpenses);
        } else {
            console.log("No expenses found in localStorage, using default: []");
            savedExpenses = [];
        }
    } catch (e) {
        console.error("Failed to parse expenses from localStorage:", e);
        savedExpenses = [];
    }
    savedExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.setAttribute('data-name', expense.name);
        li.setAttribute('data-amount', expense.amount.toString());
        li.innerHTML = `${expense.name}: PKR ${expense.amount.toFixed(2)} <button onclick="removeExpense(this)">Remove</button>`;
        expenseList.appendChild(li);
        console.log("Added expense to DOM:", expense);
    });

    console.log("Balance before updateBalance:", balance);
    updateBalance();
};

// Save data to localStorage
function saveData() {
    console.log("Saving data to localStorage...");
    try {
        localStorage.setItem('balance', balance.toString());
        console.log("Saved balance:", balance.toString());
    } catch (e) {
        console.error("Failed to save balance to localStorage:", e);
    }

    const lenders = Array.from(lenderList.children).map(li => {
        const name = li.getAttribute('data-name');
        const amount = parseFloat(li.getAttribute('data-amount'));
        console.log("Processing lender:", { name, amount, li });
        if (!name || isNaN(amount)) {
            console.warn("Invalid lender data, skipping:", li);
            return null;
        }
        return { name, amount };
    }).filter(lender => lender !== null);
    try {
        localStorage.setItem('lenders', JSON.stringify(lenders));
        console.log("Saved lenders:", lenders);
    } catch (e) {
        console.error("Failed to save lenders to localStorage:", e);
    }

    const expenses = Array.from(expenseList.children).map(li => {
        const name = li.getAttribute('data-name');
        const amount = parseFloat(li.getAttribute('data-amount'));
        console.log("Processing expense:", { name, amount, li });
        if (!name || isNaN(amount)) {
            console.warn("Invalid expense data, skipping:", li);
            return null;
        }
        return { name, amount };
    }).filter(expense => expense !== null);
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        console.log("Saved expenses:", expenses);
    } catch (e) {
        console.error("Failed to save expenses to localStorage:", e);
    }
}

function updateBalance() {
    balanceDisplay.textContent = `PKR ${balance.toFixed(2)}`;
    saveData();
}

// Deposit Functions
function showDepositForm() {
    const depositForm = document.getElementById('depositForm');
    depositForm.style.display = 'block';
    document.getElementById('depositAmount').focus();
}

function submitDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    console.log("Submitting deposit, amount:", amount);
    if (!isNaN(amount) && amount > 0) {
        balance += amount;
        updateBalance();
        cancelDeposit();
    } else {
        showNotification("Please enter a valid amount!");
    }
}

function cancelDeposit() {
    const depositForm = document.getElementById('depositForm');
    depositForm.style.display = 'none';
    document.getElementById('depositAmount').value = '';
}

// Withdraw Functions
function showWithdrawForm() {
    const withdrawForm = document.getElementById('withdrawForm');
    withdrawForm.style.display = 'block';
    document.getElementById('withdrawAmount').focus();
}

function submitWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    console.log("Submitting withdraw, amount:", amount, "balance:", balance);
    if (!isNaN(amount) && amount > 0) {
        if (balance >= amount) {
            balance -= amount;
            updateBalance();
            cancelWithdraw();
        } else {
            showNotification("Insufficient balance!");
        }
    } else {
        showNotification("Please enter a valid amount!");
    }
}

function cancelWithdraw() {
    const withdrawForm = document.getElementById('withdrawForm');
    withdrawForm.style.display = 'none';
    document.getElementById('withdrawAmount').value = '';
}

// Lenders Functions
function toggleLenderDropdown() {
    dropdownContent.classList.toggle('active');
}

function addLender() {
    let form = document.querySelector('.add-lender-form');
    if (form) form.remove();

    form = document.createElement('div');
    form.className = 'add-lender-form';
    form.innerHTML = `
        <input type="text" id="lenderName" placeholder="Lender Name" required>
        <input type="number" id="lenderAmount" placeholder="Amount" step="0.01" required>
        <button onclick="saveLender()">Save</button>
        <button onclick="cancelLender()">Cancel</button>
    `;
    dropdownContent.insertBefore(form, dropdownContent.lastElementChild);
    form.classList.add('active');

    const handleOutsideClick = (e) => {
        if (!form.contains(e.target) && e.target.tagName !== 'BUTTON' && e.target.textContent !== 'Lenders') {
            cancelLender();
            document.removeEventListener('click', handleOutsideClick);
        }
    };
    document.addEventListener('click', handleOutsideClick);
}

function saveLender() {
    const name = document.getElementById('lenderName').value.trim();
    const amount = parseFloat(document.getElementById('lenderAmount').value);
    console.log("Saving lender, name:", name, "amount:", amount);
    if (name && !isNaN(amount) && amount > 0) {
        const li = document.createElement('li');
        li.setAttribute('data-name', name);
        li.setAttribute('data-amount', amount.toString());
        li.innerHTML = `${name}: PKR ${amount.toFixed(2)} <button onclick="removeLender(this)">Remove</button>`;
        lenderList.appendChild(li);
        balance -= amount;
        updateBalance();
        cancelLender();
    } else {
        showNotification("Please enter valid details!");
    }
}

function cancelLender() {
    const form = document.querySelector('.add-lender-form');
    if (form) form.remove();
}

function removeLender(button) {
    const li = button.parentElement;
    const amount = parseFloat(li.getAttribute('data-amount'));
    if (!isNaN(amount)) {
        balance += amount;
        updateBalance();
        li.remove();
    } else {
        console.warn("Failed to parse lender amount:", li);
    }
}

// Expenses Functions
function toggleExpenseDropdown() {
    expenseDropdownContent.classList.toggle('active');
}
function showExpenseForm() {
    const expenseForm = document.getElementById('expenseForm');
    expenseForm.style.display = 'block';
    document.getElementById('expenseName').focus();
}

function submitExpense() {
    const name = document.getElementById('expenseName').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    console.log("Submitting expense, name:", name, "amount:", amount, "balance:", balance);
    if (name && !isNaN(amount) && amount > 0) {
        if (balance >= amount) {
            const li = document.createElement('li');
            li.setAttribute('data-name', name);
            li.setAttribute('data-amount', amount.toString());
            li.innerHTML = `${name}: PKR ${amount.toFixed(2)} <button onclick="removeExpense(this)">Remove</button>`;
            expenseList.appendChild(li);
            balance -= amount;
            updateBalance();
            cancelExpense();
        } else {
            showNotification("Insufficient balance for this expense!");
        }
    } else {
        showNotification("Please enter valid details!");
    }
}

function cancelExpense() {
    const expenseForm = document.getElementById('expenseForm');
    expenseForm.style.display = 'none';
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
}

function removeExpense(button) {
    const li = button.parentElement;
    const amount = parseFloat(li.getAttribute('data-amount'));
    if (!isNaN(amount)) {
        balance += amount;
        updateBalance();
        li.remove();
    } else {
        console.warn("Failed to parse expense amount:", li);
    }
}