function toggleSlideButton() {
    const slideButton = document.querySelector('.slide-button');
    const registerForm = document.getElementById('register');
    const loginForm = document.getElementById('login');

    slideButton.classList.toggle('active');

    if (slideButton.classList.contains('active')) {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
        alert('Username and password cannot be empty.');
        return;
    }

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    alert(result.message);
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert('Username and password cannot be empty.');
        return;
    }

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        localStorage.setItem('username', username);
        window.location.href = '/game.html';
    } else {
        alert(result.message);
    }
}
