// Get references to sections
const landingPage = document.getElementById('landing');
const formPage = document.getElementById('form-page');
const resultPage = document.getElementById('result-page');

// Get reference to the car details form element
const carForm = document.getElementById('car-form');

// Show a page and hide others
function showPage(page) {
  landingPage.classList.add('hidden');
  formPage.classList.add('hidden');
  resultPage.classList.add('hidden');
  
  page.classList.remove('hidden');
}

// Go to form page
function goToForm() {
  showPage(formPage);
}

// Go to landing page
function goToHome() {
  showPage(landingPage);
}

carForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Collect and format form data into a JSON-compatible object
  const formData = {
    'name'          : document.getElementById('car-name').value,
    'make'          : document.getElementById('make').value,
    'model'         : document.getElementById('model').value,
    'year'          : Number(document.getElementById('year').value),
    'engine'        : document.getElementById('engine').value,
    'fuel'          : document.getElementById('fuel').value,
    'mileage'       : Number(document.getElementById('mileage').value),
    'transmission'  : document.getElementById('transmission').value,
    'trim'          : document.getElementById('trim').value,
    'body'          : document.getElementById('body').value,
    'cylinders'     : Number(document.getElementById('cylinders').value),
    'exterior'      : document.getElementById('exterior').value,
    'interior'      : document.getElementById('interior').value,
    'drivetrain'    : document.getElementById('drivetrain').value,
    'doors'         : Number(document.getElementById('doors').value)
  };

  // Send POST request to Flask backend for price prediction
  fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })

  // Parse the JSON response
  .then(response => response.json())

  // Display prediction
  .then(data => {
    const resultBox = resultPage.querySelector('.result-box');
    if (data.predicted_price) {
      resultBox.textContent = '$ ' + data.predicted_price.toLocaleString();
      showPage(resultPage);
    } else {
      alert('Prediction error: ' + data.error);
    }
  })

  // Handle network or server errors
  .catch(error => {
    console.error('Fetch error:', error);
    alert('Failed to fetch prediction. See console for details.');
  });
});

// Initially show landing page
showPage(landingPage);

// Expose functions globally for inline onclick handlers
window.goToForm = goToForm;
window.goToHome = goToHome;
