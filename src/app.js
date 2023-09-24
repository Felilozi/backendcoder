const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const PORT = 3000;

const productManager = new ProductManager('./src/products.json');


app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10);
        const products = await productManager.getProducts();
        if (!isNaN(limit)) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});
// const http = require('node:http');
// const httpServer = http.createServer((req, res) => {
//     req     ('mi primer hola mundo desde backen');
// })

// httpServer.listen(8080,'localhost', ()=>{
//     console.log('funciona');
// })      