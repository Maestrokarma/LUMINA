// database.js - Funciones de autenticación y gestión de usuarios

function showAuth(type) {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'block';
}

function closeAuth() {
    document.getElementById('auth-modal').style.display = 'none';
}

// Event listeners for auth
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.querySelector('.login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            closeAuth();
            // Open profile in new tab
            window.open('profile.html', '_blank');
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });
});