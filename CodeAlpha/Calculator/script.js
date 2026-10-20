/* ---------- 1. Select DOM elements ---------- */
const currentOperandEl  = document.querySelector('.current-operand');
const previousOperandEl = document.querySelector('.previous-operand');
const numberButtons     = document.querySelectorAll('[data-number]');
const operatorButtons   = document.querySelectorAll('[data-operator]');
const actionButtons     = document.querySelectorAll('[data-action]');
const equalsButton      = document.querySelector('[data-action="equals"]');
const clearButton       = document.querySelector('[data-action="clear"]');
const deleteButton      = document.querySelector('[data-action="delete"]');
const decimalButton     = document.querySelector('[data-action="decimal"]');

/* ---------- 2. Calculator state ---------- */
let currentOperand  = '0';
let previousOperand = '';
let operation       = undefined;
let shouldResetScreen = false;

/* ---------- 3. Display update ---------- */
function updateDisplay() {
  currentOperandEl.textContent = currentOperand;
  if (operation != null) {
    previousOperandEl.textContent = `${previousOperand} ${operation}`;
  } else {
    previousOperandEl.textContent = '';
  }
}

/* ---------- 4. Core actions ---------- */
function clear() {
  currentOperand  = '0';
  previousOperand = '';
  operation       = undefined;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteNumber() {
  if (currentOperand === '0') return;
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === '') currentOperand = '0';
  updateDisplay();
}

function appendNumber(number) {
  if (currentOperand === '0' || shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false;
  }
  currentOperand += number.toString();
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentOperand = '0';
    shouldResetScreen = false;
  }
  if (currentOperand.includes('.')) return;
  currentOperand += '.';
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === '') return;
  if (previousOperand !== '') {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = '';
  updateDisplay();
}

/* ---------- 5. Compute ---------- */
function compute() {
  let result;
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return;

  switch (operation) {
    case '+': result = prev + curr; break;
    case '−': result = prev - curr; break;
    case '×': result = prev * curr; break;
    case '÷':
      if (curr === 0) {
        alert("Can't divide by zero!");
        clear();
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  currentOperand  = Math.round(result * 1e10) / 1e10 + '';
  operation       = undefined;
  previousOperand = '';
  shouldResetScreen = true;
  updateDisplay();
}

/* ---------- 6. Event listeners ---------- */
numberButtons.forEach(btn => {
  btn.addEventListener('click', () => appendNumber(btn.dataset.number));
});

operatorButtons.forEach(btn => {
  btn.addEventListener('click', () => chooseOperation(btn.dataset.operator));
});

equalsButton.addEventListener('click', compute);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
decimalButton.addEventListener('click', appendDecimal);

/* ---------- 7. Keyboard support (bonus) ---------- */
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    chooseOperation(map[e.key]);
  }
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
  else if (e.key === 'Backspace') deleteNumber();
  else if (e.key === 'Escape') clear();
});

/* ---------- 8. Initialize ---------- */
updateDisplay();