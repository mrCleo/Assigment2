// Authentication page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    
    // Form switching
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Login form elements
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Signup form elements
    const signupFirstNameInput = document.getElementById('signupFirstName');
    const signupLastNameInput = document.getElementById('signupLastName');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPhoneInput = document.getElementById('signupPhone');
    const signupPasswordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const licenseNumberInput = document.getElementById('licenseNumber');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // Phone number formatting for signup
    signupPhoneInput.addEventListener('input', function() {
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
    
    // Password strength indicator
    const passwordStrengthIndicator = document.createElement('div');
    passwordStrengthIndicator.className = 'password-strength';
    passwordStrengthIndicator.style.cssText = `
        margin-top: 8px;
        font-size: 0.875rem;
        display: none;
    `;
    signupPasswordInput.parentNode.appendChild(passwordStrengthIndicator);
    
    signupPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        if (password.length > 0) {
            passwordStrengthIndicator.style.display = 'block';
            passwordStrengthIndicator.innerHTML = `
                <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                    <div style="height: 4px; flex: 1; background: ${strength.score >= 1 ? '#10b981' : '#e5e7eb'}; border-radius: 2px;"></div>
                    <div style="height: 4px; flex: 1; background: ${strength.score >= 2 ? '#10b981' : '#e5e7eb'}; border-radius: 2px;"></div>
                    <div style="height: 4px; flex: 1; background: ${strength.score >= 3 ? '#10b981' : '#e5e7eb'}; border-radius: 2px;"></div>
                    <div style="height: 4px; flex: 1; background: ${strength.score >= 4 ? '#10b981' : '#e5e7eb'}; border-radius: 2px;"></div>
                </div>
                <span style="color: ${strength.color};">${strength.text}</span>
            `;
        } else {
            passwordStrengthIndicator.style.display = 'none';
        }
    });
    
    // Password confirmation validation
    confirmPasswordInput.addEventListener('input', function() {
        const password = signupPasswordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });
    
    // Email validation for both forms
    [loginEmailInput, signupEmailInput].forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
    
    // Handle login form submission
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Please fill in all required fields.');
            return;
        }
        
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value;
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorMessage('Please enter a valid email address.');
            loginEmailInput.focus();
            return;
        }
        
        // Simulate login process
        showSuccessMessage('Signing you in...');
        
        // Check if user exists in localStorage (simulate database)
        const users = JSON.parse(localStorage.getItem('azoomUsers') || '[]');
        const user = users.find(u => u.email === email);
        
        setTimeout(() => {
            if (user && user.password === password) {
                // Successful login
                const loginData = {
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone
                    },
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMeCheckbox.checked
                };
                
                localStorage.setItem('azoomCurrentUser', JSON.stringify(loginData));
                
                showSuccessMessage(`Welcome back, ${user.firstName}!`);
                
                // Redirect to home page or previous page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Failed login
                showErrorMessage('Invalid email or password. Please try again.');
                loginPasswordInput.value = '';
                loginPasswordInput.focus();
            }
        }, 1500);
    });
    
    // Handle signup form submission
    signupFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Please fill in all required fields.');
            return;
        }
        
        const firstName = signupFirstNameInput.value.trim();
        const lastName = signupLastNameInput.value.trim();
        const email = signupEmailInput.value.trim();
        const phone = signupPhoneInput.value.trim();
        const password = signupPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const licenseNumber = licenseNumberInput.value.trim();
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorMessage('Please enter a valid email address.');
            signupEmailInput.focus();
            return;
        }
        
        // Validate password strength
        const passwordStrength = calculatePasswordStrength(password);
        if (passwordStrength.score < 2) {
            showErrorMessage('Please choose a stronger password.');
            signupPasswordInput.focus();
            return;
        }
        
        // Validate password confirmation
        if (password !== confirmPassword) {
            showErrorMessage('Passwords do not match.');
            confirmPasswordInput.focus();
            return;
        }
        
        // Validate terms agreement
        if (!agreeTermsCheckbox.checked) {
            showErrorMessage('Please agree to the Terms of Service and Privacy Policy.');
            agreeTermsCheckbox.focus();
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('azoomUsers') || '[]');
        if (users.find(u => u.email === email)) {
            showErrorMessage('An account with this email already exists. Please sign in instead.');
            return;
        }
        
        // Simulate account creation
        showSuccessMessage('Creating your account...');
        
        setTimeout(() => {
            // Create new user
            const newUser = {
                id: generateUserId(),
                firstName,
                lastName,
                email,
                phone,
                password, // In a real app, this would be hashed
                licenseNumber,
                createdAt: new Date().toISOString(),
                isVerified: true // In a real app, this would require email verification
            };
            
            users.push(newUser);
            localStorage.setItem('azoomUsers', JSON.stringify(users));
            
            // Auto-login the new user
            const loginData = {
                user: {
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone
                },
                loginTime: new Date().toISOString(),
                rememberMe: false
            };
            
            localStorage.setItem('azoomCurrentUser', JSON.stringify(loginData));
            
            showSuccessMessage(`Welcome to AZoom, ${firstName}!`);
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        }, 2000);
    });
    
    // Calculate password strength
    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score++;
        else feedback.push('at least 8 characters');
        
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        else feedback.push('uppercase and lowercase letters');
        
        if (/\d/.test(password)) score++;
        else feedback.push('numbers');
        
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        else feedback.push('special characters');
        
        const strength = {
            0: { text: 'Very Weak', color: '#ef4444' },
            1: { text: 'Weak', color: '#f59e0b' },
            2: { text: 'Fair', color: '#f59e0b' },
            3: { text: 'Good', color: '#10b981' },
            4: { text: 'Strong', color: '#10b981' }
        };
        
        return {
            score,
            ...strength[score],
            feedback
        };
    }
    
    // Generate unique user ID
    function generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Always show demo data buttons (for testing purposes)
    // Demo login button
    const demoLoginButton = document.createElement('button');
    demoLoginButton.type = 'button';
    demoLoginButton.className = 'btn btn-secondary';
    demoLoginButton.textContent = 'Demo Login';
    demoLoginButton.style.marginBottom = '20px';
    demoLoginButton.addEventListener('click', function() {
        loginEmailInput.value = 'demo@azoomrental.com';
        loginPasswordInput.value = 'demo123';
    });
    
    // Demo signup button
    const demoSignupButton = document.createElement('button');
    demoSignupButton.type = 'button';
    demoSignupButton.className = 'btn btn-secondary';
    demoSignupButton.textContent = 'Demo Signup';
    demoSignupButton.style.marginBottom = '20px';
    demoSignupButton.addEventListener('click', function() {
        signupFirstNameInput.value = 'John';
        signupLastNameInput.value = 'Doe';
        signupEmailInput.value = 'demo1@azoomrental.com';
        signupPhoneInput.value = '(+65) 123-4567';
        signupPasswordInput.value = 'SecurePass123!';
        confirmPasswordInput.value = 'SecurePass123!';
        licenseNumberInput.value = 'DL123456789';
        agreeTermsCheckbox.checked = true;
        
        // Trigger password strength check
        signupPasswordInput.dispatchEvent(new Event('input'));
        confirmPasswordInput.dispatchEvent(new Event('input'));
    });
    
    loginFormElement.insertBefore(demoLoginButton, loginFormElement.firstChild);
    signupFormElement.insertBefore(demoSignupButton, signupFormElement.firstChild);
    
    // Create demo user if it doesn't exist
    const users = JSON.parse(localStorage.getItem('azoomUsers') || '[]');
    if (!users.find(u => u.email === 'demo@azoomrental.com')) {
        const demoUser = {
            id: 'demo_user_001',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@azoomrental.com',
            phone: '(+65) 000-0000',
            password: 'demo123',
            licenseNumber: 'DEMO123456',
            createdAt: new Date().toISOString(),
            isVerified: true
        };
        users.push(demoUser);
        localStorage.setItem('azoomUsers', JSON.stringify(users));
    }
});
