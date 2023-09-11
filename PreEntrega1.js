class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error("El código de producto ya está en uso");
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
        console.log("Producto agregado:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
            return null;
        }
    }
}

// Probando codigo 
const productManager = new ProductManager();
console.log("Productos iniciales:", productManager.getProducts()); // "Productos iniciales: []"

productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
);

console.log("Productos después de agregar uno:", productManager.getProducts()); 

// Agregamos producto
productManager.addProduct(
    "producto repetido",
    "Este es un producto repetido",
    150,
    "Sin imagen",
    "abc123",
    10
); // Muestra un  codigo de error "El código de producto ya está en uso"

const foundProduct = productManager.getProductById(1);
console.log("Producto encontrado por ID:", foundProduct); 
const notFoundProduct = productManager.getProductById(99); 
