import { Product } from '../Models/productModel.js';

export class ProductDAO {
    async getProducts(filter, options) {
        const Product = await Product.paginate(filter, options)
        return Product;
    }

    async getProductsById(id) {
        const Product = await Product.findOne({ _id: id }).lean();
        return Product;
    }

    async deleteProduct(id) {
        const Product = await Product.deleteOne({ _id: id }).lean();
        return Product;
    }

    async createProducts(payload) {
        const newProduct = await Product.create(payload);
        return newProduct;
    }

    async updateProducts(id, payload) {
        const updatedProduct = await Product.updateOne({ _id: id }, {
            $set: payload
        });
        return updatedProduct;
    }
}