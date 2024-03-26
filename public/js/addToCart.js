async function performFetch(url) {
    
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(),
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
            alert('Producto Añadido al Carrito')
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error cases or display error messages if needed
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.addToCartButton');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.parentElement.querySelector('.productId').value;
            const cartId = document.getElementById('cid').innerText;            
            const url = `/api/cart/${cartId}/products/${productId}`;
            // Send request or perform action with the constructed URL
            performFetch(url);

        });
    });
});