'use strict';

const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/session/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            if (result.ok) {
                return result.json();
            } else {
                throw new Error('Registration failed');
            }
        })
        .then(json => {
            // Redirect to '/api/product' upon successful registration
            window.location.href = '/api/views/login';
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error cases or display error messages if needed
        });
});