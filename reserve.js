// Reservation page functionality
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    const carOptions = document.querySelectorAll('.car-option');
    const rentalTypeSelect = document.getElementById('rentalType');
    const quantityInput = document.getElementById('quantity');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const summaryContent = document.getElementById('summaryContent');
    const totalSection = document.getElementById('totalSection');
    
    let selectedCar = null;
    let currentPricing = { daily: 0, weekly: 0, monthly: 0 };
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    
    // Handle car selection
    carOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove previous selection
            carOptions.forEach(opt => opt.classList.remove('selected'));
            document.querySelectorAll('input[name="selectedCar"]').forEach(radio => radio.checked = false);
            
            // Select current option
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Store selected car data
            selectedCar = {
                id: this.dataset.car,
                name: this.querySelector('h3').textContent,
                image: this.querySelector('img').src,
                pricing: {
                    daily: parseInt(this.dataset.priceDaily),
                    weekly: parseInt(this.dataset.priceWeekly),
                    monthly: parseInt(this.dataset.priceMonthly)
                }
            };
            
            currentPricing = selectedCar.pricing;
            updateSummary();
        });
    });
    
    // Handle rental type change
    rentalTypeSelect.addEventListener('change', function() {
        const type = this.value;
        if (type) {
            quantityInput.disabled = false;
            quantityInput.value = 1;
            
            // Update quantity label and max value based on rental type
            const quantityLabel = document.querySelector('label[for="quantity"]');
            switch(type) {
                case 'daily':
                    quantityLabel.textContent = 'Number of Days';
                    quantityInput.max = 30;
                    break;
                case 'weekly':
                    quantityLabel.textContent = 'Number of Weeks';
                    quantityInput.max = 12;
                    break;
                case 'monthly':
                    quantityLabel.textContent = 'Number of Months';
                    quantityInput.max = 12;
                    break;
            }
        } else {
            quantityInput.disabled = true;
            quantityInput.value = '';
        }
        updateSummary();
    });
    
    // Handle quantity change
    quantityInput.addEventListener('input', function() {
        updateSummary();
        updateEndDate();
    });
    
    // Handle start date change
    startDateInput.addEventListener('change', function() {
        updateEndDate();
        updateSummary();
    });
    
    // Update end date based on rental type and quantity
    function updateEndDate() {
        const startDate = startDateInput.value;
        const rentalType = rentalTypeSelect.value;
        const quantity = parseInt(quantityInput.value);
        
        if (startDate && rentalType && quantity) {
            const start = new Date(startDate);
            let end = new Date(start);
            
            switch(rentalType) {
                case 'daily':
                    end.setDate(start.getDate() + quantity);
                    break;
                case 'weekly':
                    end.setDate(start.getDate() + (quantity * 7));
                    break;
                case 'monthly':
                    end.setMonth(start.getMonth() + quantity);
                    break;
            }
            
            endDateInput.value = end.toISOString().split('T')[0];
        } else {
            endDateInput.value = '';
        }
    }
    
    // Update reservation summary
    function updateSummary() {
        if (!selectedCar || !rentalTypeSelect.value || !quantityInput.value) {
            summaryContent.innerHTML = '<p>Please select a car and rental details to see your summary.</p>';
            totalSection.style.display = 'none';
            return;
        }
        
        const rentalType = rentalTypeSelect.value;
        const quantity = parseInt(quantityInput.value);
        const pricePerUnit = currentPricing[rentalType];
        const subtotal = pricePerUnit * quantity;
        const tax = subtotal * 0.085; // 8.5% tax
        const total = subtotal + tax;
        
        let durationText = '';
        switch(rentalType) {
            case 'daily':
                durationText = `${quantity} ${quantity === 1 ? 'Day' : 'Days'}`;
                break;
            case 'weekly':
                durationText = `${quantity} ${quantity === 1 ? 'Week' : 'Weeks'}`;
                break;
            case 'monthly':
                durationText = `${quantity} ${quantity === 1 ? 'Month' : 'Months'}`;
                break;
        }
        
        summaryContent.innerHTML = `
            <div class="summary-item">
                <img src="${selectedCar.image}" alt="${selectedCar.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
                <h4>${selectedCar.name}</h4>
                <p>Duration: ${durationText}</p>
                <p>Rate: $${pricePerUnit}/${rentalType.slice(0, -2)}</p>
            </div>
        `;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        totalSection.style.display = 'block';
    }
    
    // Format credit card inputs
    cardNumberInput.addEventListener('input', function() {
        formatCardNumber(this);
    });
    
    expiryDateInput.addEventListener('input', function() {
        formatExpiryDate(this);
    });
    
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
    });
    
    // Handle form submission
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Please fill in all required fields.');
            return;
        }
        
        if (!selectedCar) {
            showErrorMessage('Please select a car.');
            return;
        }
        
        // Validate credit card
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            showErrorMessage('Please enter a valid credit card number.');
            return;
        }
        
        const expiryDate = expiryDateInput.value;
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            showErrorMessage('Please enter a valid expiry date (MM/YY).');
            return;
        }
        
        const cvv = cvvInput.value;
        if (cvv.length < 3 || cvv.length > 4) {
            showErrorMessage('Please enter a valid CVV.');
            return;
        }
        
        // Store reservation data for payment page
        const reservationData = {
            car: selectedCar,
            rentalType: rentalTypeSelect.value,
            quantity: parseInt(quantityInput.value),
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                licenseNumber: document.getElementById('licenseNumber').value
            },
            payment: {
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv,
                cardName: document.getElementById('cardName').value
            },
            total: parseFloat(document.getElementById('total').textContent.replace('$', '')),
            confirmationNumber: generateConfirmationNumber()
        };
        
        localStorage.setItem('reservationData', JSON.stringify(reservationData));
        
        // Simulate payment processing
        showSuccessMessage('Processing payment...');
        
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 2000);
    });
    
    // Check for pre-selected car from URL
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedCar = urlParams.get('car');
    if (preSelectedCar) {
        const carOption = document.querySelector(`[data-car="${preSelectedCar}"]`);
        if (carOption) {
            carOption.click();
        }
    }
});