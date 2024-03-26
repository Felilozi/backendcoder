import { Product } from '../Models/productModel.js';
import { ERROR } from '../../commons/dictionaryError.js'

export class ProductDAO {
    async getProducts(filter, options) {
        const ProductBD = await Product.paginate(filter, options)
        return ProductBD;
    }

    async getProductsById(id) {
        const Products = await Product.findOne({ _id: id }).lean();
        return Products;
    }
    async deleteProduct(id, email) {

        const productToDelete = await Product.findOne({ _id: id, owner: email });

        if (!productToDelete) {
            throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
        }

        const deletedProduct = await Product.deleteOne({ _id: id, owner: email })
        return deletedProduct;
    }

    async createProducts(payload) {
        const newProduct = await Product.create(payload);
        return newProduct;
    }

    async updateProducts(id, payload, email) {
        const productToUpdate = await Product.findOne({ _id: id, owner: email });

        if (!productToUpdate && role != 'ADMIN')  {
            throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
        }
        const updatedProduct = await Product.updateOne({ _id: id, owner: email }, {
            $set: payload
        });

        return updatedProduct;
    }
}