const currencies = ['USD', 'EUR', 'SUM', 'RUB', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
const exchangeRates = {};

window.onload = function() {
  initializeLocalStorage();
  populateCurrencySelectors();
  populateCurrencyPairSelector();
};

function initializeLocalStorage() {
  if (!localStorage.getItem('exchangeRates')) {
    currencies.forEach(currency => {
      exchangeRates[currency] = {};
      currencies.forEach(otherCurrency => {
        if (currency !== otherCurrency) {
          exchangeRates[currency][otherCurrency] = {
            buy: (Math.random() * 10).toFixed(2),
            sell: (Math.random() * 10).toFixed(2)
          };
        }
      });
    });
    localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
  } else {
    Object.assign(exchangeRates, JSON.parse(localStorage.getItem('exchangeRates')));
  }
}

function populateCurrencySelectors() {
  const fromCurrency = document.getElementById('from-currency');
  const toCurrency = document.getElementById('to-currency');
  currencies.forEach(currency => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromCurrency.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = currency;
    optionTo.textContent = currency;
    toCurrency.appendChild(optionTo);
  });
}

function populateCurrencyPairSelector() {
  const currencyPair = document.getElementById('currency-pair');
  currencies.forEach(baseCurrency => {
    currencies.forEach(quoteCurrency => {
      if (baseCurrency !== quoteCurrency) {
        const option = document.createElement('option');
        option.value = `${baseCurrency}_${quoteCurrency}`;
        option.textContent = `${baseCurrency}/${quoteCurrency}`;
        currencyPair.appendChild(option);
      }
    });
  });
}

function exchangeCurrency() {
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  const amount = parseFloat(document.getElementById('amount').value);
  if (fromCurrency === toCurrency) {
    document.getElementById('result').textContent = 'Iltimos, turli valyutalarni tanlang.';
    return;
  }

  if (isNaN(amount)) {
    document.getElementById('result').textContent = 'Iltimos, to\'lov miqdorini kiriting.';
    return;
  }

  
  const rate = exchangeRates[fromCurrency][toCurrency];
  const exchangedAmount = (amount * rate.sell).toFixed(2);
  document.getElementById('result').textContent = `Siz ${exchangedAmount} ${toCurrency} olasiz`;
}

function updateRate() {
  const [baseCurrency, quoteCurrency] = document.getElementById('currency-pair').value.split('_');
  const buyRate = parseFloat(document.getElementById('buy-rate').value);
  const sellRate = parseFloat(document.getElementById('sell-rate').value);
  if (buyRate >= sellRate) {
    alert('Sotish kursi sotib olish kursidan yuqori bo‘lishi kerak.');
    return;
  }


  if (isNaN(buyRate) || isNaN(sellRate)) {
    alert('Iltimos, kurslarni to\'ldiring.');
    return;
  }

  
  exchangeRates[baseCurrency][quoteCurrency].buy = buyRate.toFixed(2);
  exchangeRates[baseCurrency][quoteCurrency].sell = sellRate.toFixed(2);
  localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
  alert('Valyuta kursi muvaffaqiyatli yangilandi.');
}
