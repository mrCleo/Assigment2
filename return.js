// Return page functionality
document.addEventListener('DOMContentLoaded', function() {
    const returnForm = document.getElementById('returnForm');
    const confirmationNumberInput = document.getElementById('confirmationNumber');
    const returnDateInput = document.getElementById('returnDate');
    const returnTimeInput = document.getElementById('returnTime');
    const mileageInput = document.getElementById('mileage');
    const batteryLevelInput = document.getElementById('batteryLevel');
    const conditionSelect = document.getElementById('condition');
    const notesTextarea = document.getElementById('notes');
    const returnLocationSelect = document.getElementById('returnLocation');
    
    // Set default return date to today
    const today = new Date().toISOString().split('T')[0];
    returnDateInput.value = today;
    returnDateInput.min = today;
    
    // Set default return time to current time
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    returnTimeInput.value = currentTime;
    
    // Validate confirmation number format
    confirmationNumberInput.addEventListener('input', function() {
        let value = this.value.toUpperCase();
        // Remove any characters that don't match the expected format
        value = value.replace(/[^A-Z0-9-]/g, '');
        this.value = value;
        
        // Check if it matches the expected format (AZ-YYYY-XXXXXX)
        const isValid = /^AZ-\d{4}-\d{6}$/.test(value);
        if (value.length > 0 && !isValid && value.length >= 13) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });
    
    // Validate mileage input
    mileageInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Add commas for readability
        if (this.value.length > 0) {
            const number = parseInt(this.value);
            this.value = number.toLocaleString();
        }
    });
    
    // Validate battery level
    batteryLevelInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value < 0) this.value = 0;
        if (value > 100) this.value = 100;
        
        // Change color based on battery level
        if (value < 20) {
            this.style.borderColor = '#ef4444';
        } else if (value < 50) {
            this.style.borderColor = '#f59e0b';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
    
    // Handle condition selection
    conditionSelect.addEventListener('change', function() {
        const notesGroup = notesTextarea.closest('.form-group');
        const label = notesGroup.querySelector('label');
        
        if (this.value === 'fair' || this.value === 'poor') {
            label.textContent = 'Additional Notes (Required - Please describe the damage)';
            notesTextarea.required = true;
            notesTextarea.placeholder = 'Please describe any damage, scratches, or issues with the vehicle...';
        } else {
            label.textContent = 'Additional Notes (Optional)';
            notesTextarea.required = false;
            notesTextarea.placeholder = 'Any additional comments about the vehicle condition or your rental experience...';
        }
    });
    
    // Handle form submission
    returnForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Please fill in all required fields.');
            return;
        }
        
        // Validate confirmation number format
        const confirmationNumber = confirmationNumberInput.value;
        if (!/^AZ-\d{4}-\d{6}$/.test(confirmationNumber)) {
            showErrorMessage('Please enter a valid confirmation number (format: AZ-YYYY-XXXXXX).');
            confirmationNumberInput.focus();
            return;
        }
        
        // Validate battery level
        const batteryLevel = parseInt(batteryLevelInput.value);
        if (batteryLevel < 10) {
            const confirmed = confirm('Battery level is very low (' + batteryLevel + '%). Additional charging fees may apply. Do you want to continue?');
            if (!confirmed) {
                return;
            }
        }
        
        // Validate return date is not in the future beyond today
        const returnDate = new Date(returnDateInput.value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of today
        
        if (returnDate > today) {
            showErrorMessage('Return date cannot be in the future.');
            returnDateInput.focus();
            return;
        }
        
        // Check if damage is reported but condition is excellent/good
        const condition = conditionSelect.value;
        const notes = notesTextarea.value.trim();
        
        if ((condition === 'fair' || condition === 'poor') && !notes) {
            showErrorMessage('Please provide details about the vehicle condition.');
            notesTextarea.focus();
            return;
        }
        
        // Collect return data
        const returnData = {
            confirmationNumber: confirmationNumber,
            returnDate: returnDateInput.value,
            returnTime: returnTimeInput.value,
            mileage: mileageInput.value.replace(/,/g, ''), // Remove commas
            batteryLevel: batteryLevel,
            condition: condition,
            notes: notes,
            returnLocation: returnLocationSelect.value,
            returnDateTime: new Date().toISOString()
        };
        
        // Store return data
        localStorage.setItem('returnData', JSON.stringify(returnData));
        
        // Show processing message
        showSuccessMessage('Processing your return...');
        
        // Simulate processing time
        setTimeout(() => {
            // Show confirmation dialog
            const locationName = returnLocationSelect.options[returnLocationSelect.selectedIndex].text;
            const confirmationMessage = `
                Return Confirmed!
                
                Confirmation: ${confirmationNumber}
                Location: ${locationName}
                Date: ${formatDate(returnDateInput.value)}
                Time: ${returnTimeInput.value}
                
                Thank you for choosing AZoom Car Rental!
                A receipt has been sent to your email.
            `;
            
            alert(confirmationMessage);
            
            // Reset form
            returnForm.reset();
            returnDateInput.value = today;
            returnTimeInput.value = currentTime;
            batteryLevelInput.style.borderColor = '#e5e7eb';
            
            showSuccessMessage('Vehicle return completed successfully!');
            
        }, 2000);
    });
    
    // Auto-fill demo data button (for testing purposes)
    const demoButton = document.createElement('button');
    demoButton.type = 'button';
    demoButton.className = 'btn btn-secondary';
    demoButton.textContent = 'Fill Demo Data';
    demoButton.style.marginBottom = '20px';
    demoButton.addEventListener('click', function() {
        confirmationNumberInput.value = 'AZ-2025-123456';
        mileageInput.value = '12,345';
        batteryLevelInput.value = '85';
        conditionSelect.value = 'excellent';
        returnLocationSelect.value = 'main-office';
        notesTextarea.value = 'Great experience with the Tesla Model 3. Very smooth and quiet ride.';
    });
    
    // Add demo button to form (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        returnForm.insertBefore(demoButton, returnForm.firstChild);
    }
});