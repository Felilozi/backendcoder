import { Product } from '../Models/productModel.js';
import { ERROR } from '../../dictionaryError.js'

export class ProductDAO {
    async getProducts(filter, options) {
        const Product = await Product.paginate(filter, options)
        return Product;
    }

    async getProductsById(id) {
        const Product = await Product.findOne({ _id: id }).lean();
        return Product;
    }

    async deleteProduct(id, email) {
        // const Product = await Product.deleteOne({ _id: id }).lean();

        const productToDelete = await Product.findOne({ _id: id, owner: email });

        if (!productToDelete) {
            // If the product doesn't exist or the email doesn't match, return an error or handle it accordingly
            throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
        }

        // Update the product only if the email matches
        const deletedProduct = await Product.deleteOne({ _id: id, owner: email })
        return deletedProduct;
    }

    async createProducts(payload) {
        const newProduct = await Product.create(payload);
        return newProduct;
    }

    async updateProducts(id, payload, email) {
        const productToUpdate = await Product.findOne({ _id: id, owner: email });

        if (!productToUpdate) {
            // If the product doesn't exist or the email doesn't match, return an error or handle it accordingly
            throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
        }

        // Update the product only if the email matches
        const updatedProduct = await Product.updateOne({ _id: id, owner: email }, {
            $set: payload
        });

        return updatedProduct;
    }
}