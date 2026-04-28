function formatCurrency(amount) {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const principal = parseFloat(document.getElementById('principal').value);
  const annualRate = parseFloat(document.getElementById('rate').value);
  const tenure = parseInt(document.getElementById('tenure').value);

  // Validation
  if (!principal || !annualRate || !tenure || principal <= 0 || annualRate <= 0 || tenure <= 0) {
    alert('Please fill in all fields with valid positive numbers.');
    return;
  }

  // EMI Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;

  // Display results
  document.getElementById('emi').textContent = formatCurrency(emi);
  document.getElementById('total').textContent = formatCurrency(totalPayment);
  document.getElementById('interest').textContent = formatCurrency(totalInterest);

  // Highlight result boxes
  document.querySelectorAll('.result-box').forEach(box => box.classList.add('active'));

  // Build amortization schedule
  buildSchedule(principal, monthlyRate, emi, tenure);
}

function buildSchedule(principal, monthlyRate, emi, tenure) {
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';

  let balance = principal;

  for (let month = 1; month <= tenure; month++) {
    const interestPart = balance * monthlyRate;
    const principalPart = emi - interestPart;
    balance -= principalPart;
    if (balance < 0) balance = 0;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${month}</td>
      <td>${formatCurrency(emi)}</td>
      <td>${formatCurrency(principalPart)}</td>
      <td>${formatCurrency(interestPart)}</td>
      <td>${formatCurrency(balance)}</td>
    `;
    tbody.appendChild(row);
  }

  document.getElementById('tableWrap').style.display = 'block';
}