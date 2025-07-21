// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    
    // Phone number formatting
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        this.value = value;
    });
    
    // Email validation
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#ef4444';
            showErrorMessage('Please enter a valid email address.');
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });
    
    // Subject change handler
    subjectSelect.addEventListener('change', function() {
        const subject = this.value;
        let placeholder = 'Please describe your inquiry or concern...';
        
        switch(subject) {
            case 'reservation':
                placeholder = 'Please provide your confirmation number and describe your reservation inquiry...';
                break;
            case 'billing':
                placeholder = 'Please describe your billing question or concern. Include your confirmation number if applicable...';
                break;
            case 'technical':
                placeholder = 'Please describe the technical issue you are experiencing in detail...';
                break;
            case 'feedback':
                placeholder = 'We value your feedback! Please share your experience with AZoom Car Rental...';
                break;
            case 'other':
                placeholder = 'Please describe your inquiry or concern...';
                break;
        }
        
        messageTextarea.placeholder = placeholder;
    });
    
    // Character counter for message
    const maxLength = 1000;
    const charCounter = document.createElement('div');
    charCounter.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: #6b7280;
        margin-top: 4px;
    `;
    messageTextarea.parentNode.appendChild(charCounter);
    
    messageTextarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        charCounter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 50) {
            charCounter.style.color = '#ef4444';
        } else if (remaining < 100) {
            charCounter.style.color = '#f59e0b';
        } else {
            charCounter.style.color = '#6b7280';
        }
        
        if (this.value.length > maxLength) {
            this.value = this.value.substring(0, maxLength);
            charCounter.textContent = '0 characters remaining';
        }
    });
    
    // Initialize character counter
    messageTextarea.dispatchEvent(new Event('input'));
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showErrorMessage('Please enter a valid email address.');
            emailInput.focus();
            return;
        }
        
        // Validate message length
        if (messageTextarea.value.length < 10) {
            showErrorMessage('Please provide a more detailed message (at least 10 characters).');
            messageTextarea.focus();
            return;
        }
        
        // Collect form data
        const contactData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            subject: subjectSelect.value,
            message: messageTextarea.value.trim(),
            timestamp: new Date().toISOString(),
            ticketNumber: generateTicketNumber()
        };
        
        // Store contact data (in a real app, this would be sent to a server)
        localStorage.setItem('contactSubmission', JSON.stringify(contactData));
        
        // Show processing message
        showSuccessMessage('Sending your message...');
        
        // Simulate sending time
        setTimeout(() => {
            // Show success confirmation
            const confirmationMessage = `
                Message Sent Successfully!
                
                Ticket Number: ${contactData.ticketNumber}
                Subject: ${subjectSelect.options[subjectSelect.selectedIndex].text}
                
                We'll respond to your inquiry within 24 hours.
                A confirmation email has been sent to ${emailInput.value}.
            `;
            
            alert(confirmationMessage);
            
            // Reset form
            contactForm.reset();
            messageTextarea.dispatchEvent(new Event('input')); // Update character counter
            
            showSuccessMessage('Thank you for contacting AZoom Car Rental!');
            
        }, 2000);
    });
    
    // Generate ticket number
    function generateTicketNumber() {
        const prefix = 'TICKET';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
    
    // Always show demo data button (for testing purposes)
    const demoButton = document.createElement('button');
    demoButton.type = 'button';
    demoButton.className = 'btn btn-secondary';
    demoButton.textContent = 'Fill Demo Data';
    demoButton.style.marginBottom = '20px';
    demoButton.addEventListener('click', function() {
        firstNameInput.value = 'John';
        lastNameInput.value = 'Doe';
        emailInput.value = 'john.doe@example.com';
        phoneInput.value = '(+65) 123-4567';
        subjectSelect.value = 'feedback';
        messageTextarea.value = 'I had an excellent experience renting the Tesla Model 3. The car was clean, well-maintained, and the pickup process was very smooth. The staff was professional and helpful. I will definitely use AZoom again for my future car rental needs.';
        messageTextarea.dispatchEvent(new Event('input'));
    });
    
    // Add demo button to form (always show in any environment)
    contactForm.insertBefore(demoButton, contactForm.firstChild);
});
