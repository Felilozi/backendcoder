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
                throw new Error('Error al comprar el carrito');
            }
        })
        .then(json => {
            alert('Carrito comprado')
            window.location.href = "/api/product";
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error cases or display error messages if needed
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.purchaseCart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartId = document.getElementById('cid').innerText;
            const url = `/api/cart/${cartId}/purchase`;

            // Send request or perform action with the constructed URL
            performFetch(url);
        });
    });
});