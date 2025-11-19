function checkPasswordStrength() {
    const password = document.getElementById('new-password').value;
    const strengthBar = document.getElementById('strength-bar');
    const strengthLevel = document.getElementById('strength-level');
    
    // Requirements
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Update requirement checklist
    updateRequirement('req-length', hasLength);
    updateRequirement('req-uppercase', hasUppercase);
    updateRequirement('req-lowercase', hasLowercase);
    updateRequirement('req-number', hasNumber);
    updateRequirement('req-special', hasSpecial);
    
    // Calculate strength
    let strength = 0;
    if (hasLength) strength += 20;
    if (hasUppercase) strength += 20;
    if (hasLowercase) strength += 20;
    if (hasNumber) strength += 20;
    if (hasSpecial) strength += 20;
    
    // Bonus points for longer passwords
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;
    
    // Cap at 100
    strength = Math.min(strength, 100);
    
    // Update progress bar
    strengthBar.style.width = strength + '%';
    
    // Update strength level and color
    if (password.length === 0) {
        strengthBar.className = 'strength-bar';
        strengthLevel.textContent = 'Not entered';
        strengthLevel.style.color = '#666';
    } else if (strength < 40) {
        strengthBar.className = 'strength-bar strength-weak';
        strengthLevel.textContent = 'Weak';
        strengthLevel.style.color = '#dc3545';
    } else if (strength < 60) {
        strengthBar.className = 'strength-bar strength-fair';
        strengthLevel.textContent = 'Fair';
        strengthLevel.style.color = '#ffc107';
    } else if (strength < 80) {
        strengthBar.className = 'strength-bar strength-good';
        strengthLevel.textContent = 'Good';
        strengthLevel.style.color = '#17a2b8';
    } else {
        strengthBar.className = 'strength-bar strength-strong';
        strengthLevel.textContent = 'Strong';
        strengthLevel.style.color = '#28a745';
    }
}

function updateRequirement(id, met) {
    const element = document.getElementById(id);
    const icon = element.querySelector('.icon');
    
    if (met) {
        element.classList.add('met');
        icon.textContent = '✅';
    } else {
        element.classList.remove('met');
        icon.textContent = '❌';
    }
}