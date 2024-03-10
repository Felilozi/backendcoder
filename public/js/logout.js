const logoutButton = document.getElementById('logoutButton'); // Get the logout button element

logoutButton.addEventListener('submit', e => {
    e.preventDefault();
    
    fetch('/api/users/logout', {
        method: 'DELETE',
        body: JSON.stringify(),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200 || result.status === 'success' ) {
            window.location.href =  '/api/views/login';
        }
    })
})