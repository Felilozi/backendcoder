const fs = require('node:fs/promises');
class ProductManager {
    constructor(path) {
        this.products = [];
        this.productIdCounter = 1;
        this.error = {
            AddError: "Todos los campos son obligatorios",
            GetError: 'Error al leer el archivo ',
            UpError: 'No lo encontro el producto',
            DeleteError: 'Error al borrar al producto  '

        };
        this.funciona = {
            addFunciona: "Producto agregado:",
            upFunciona: "Producto actualizado:",
            deleteFunciona: 'Se borro el producto'
        }
        this.path = path;


    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error(this.error.AddError);
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error(this.error.GetError);
            return;
        }
        const product = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(product);
        fs.writeFile(this.path, JSON.stringify(this.products));
        console.log(this.funciona.addFunciona, product);
    }
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        }

        catch (err) {
            console.log(this.error.GetError)
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');

            const product = JSON.parse(data).find(product => product.id === id);
            if (product) {
                return product;
            } else {
                console.error("Producto no encontrado");
                return null;
            }
        }
        catch (err) {
            console.log(this.error.GetError)
        }
    }
    async updateProduct(id, datoActualizar, nuevoValor) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const productosParse = JSON.parse(data);
            const productIndex = productosParse.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error(this.error.UpError)
            }
            if (datoActualizar) {
                productosParse[productIndex][datoActualizar] = nuevoValor

            } else {
                const { title, description, price, thumbnail, code, stock } = nuevoValor
                const product = {
                    id,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                };
                productosParse[productIndex] = product
                //productIndex =  es la posicion de product en el array json 
            }
            fs.writeFile(this.path, JSON.stringify(productosParse));
            return this.funciona.upFunciona

        }
        catch (err) {
            console.log(this.error.UpError)
        }

    }
    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const productosParse = JSON.parse(data);
            const productIndex = productosParse.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error(this.error.UpError)
            }
            productosParse.splice(productIndex, 1);
            fs.writeFile(this.path, JSON.stringify(productosParse));
            return this.funciona.deleteFunciona

        }
        catch (err) {
            console.log(this.error.DeleteError)
        }

    }

}
// const path = "./products.json";
// // Probando codigo 
// const productManager = new ProductManager(path);
// console.log("Productos iniciales:", productManager.getProducts());
//  // "Productos iniciales: []"

// productManager.addProduct(
//     "Producto prueba",
//     "Este es un producto prueba",
//     200,
//     "Sin imagen",
//     "abc123",
//     25
// );
const path = "./products.json";
const productManager = new ProductManager(path);

// Agregando productos iniciales
const initialProducts = [
    {
        title: "Producto 1",
        description: "Remeras",
        price: 100,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_974378-MLA69392078340_052023-O.webp",
        code: "prod1",
        stock: 10
    },
    {
        title: "Producto 2",
        description: "Descripción del Producto 2",
        price: 150,
        thumbnail: "thumbnail2.jpg",
        code: "prod2",
        stock: 8
    },
    // ... Agrega más productos según sea necesario
];

// initialProducts.forEach((product) => {
//     const { title, description, price, thumbnail, code, stock } = product;
//     productManager.addProduct(title, description, price, thumbnail, code, stock);
// });

// console.log("Productos iniciales:", productManager.getProducts());


// productManager.getProducts()
//     .then((data) => console.log("Productos después de agregar uno:", data))
//     .catch((err) => console.log("Error", err));

// productManager.getProductById(2)
//     .then((product) => console.log("Buscando el id:", product))
//     .catch((err) => console.log("Error", err));

// productManager.updateProduct(1, "price", 1000)
//     .then((product) => console.log(product))
//     .catch((err) => console.log("Error", err));
// // productManager.deleteProduct(1)
// //     .then((product) => console.log(product))
// //     .catch((err) => console.log("Error", err));




module.exports = ProductManager;


// fs.writeFile = Para escribir contenido en un archivo. Si el archivo no existe, lo crea. Si existe, lo sobreescribe.
// fs.readFile  = Para obtener el contenido de un archivo.
// fs.appendFile = Para añadir contenido a un archivo. ¡No se sobreescribe!
// fs.unlink= Es el “delete” de los archivos. eliminará todo el archivo, no sólo el contenido