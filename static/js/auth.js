// Firebase Authentication Module

// Initialize Firebase Auth and Google Provider
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Handle form submission for email/password login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const idToken = await userCredential.user.getIdToken();
                
                // Send token to backend
                await sendTokenToBackend(idToken);
            } catch (error) {
                console.error('Login failed:', error);
                showError('Invalid email or password');
            }
        });
    }
});

// Google Sign In function
async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const idToken = await result.user.getIdToken();
        await sendTokenToBackend(idToken);
    } catch (error) {
        console.error('Google sign-in failed:', error);
        showError('Google sign-in failed');
    }
}

// Helper function to send token to backend
async function sendTokenToBackend(idToken) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id_token=${idToken}`
        });
        
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            window.location.href = '/studio';
        }
    } catch (error) {
        console.error('Error sending token to backend:', error);
        showError('Authentication failed');
    }
}

// Helper function to show error messages
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger';
    alertDiv.textContent = message;
    
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const form = document.querySelector('form');
    form.insertBefore(alertDiv, form.firstChild);
}

// Export functions
window.authModule = {
    signInWithGoogle
};