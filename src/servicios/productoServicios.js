'use strict'
import { Product } from '../models/Models/productModel.js'
import { getDAOS } from "../models/DAO/indexDAO.js"
const { productsDao } = getDAOS();
class productService {
    static async getProducts(query) {
        try {
            const sortField = query.sort || 'price';
            const sortOrder = parseInt(query.order === 'desc' ? '-1' : '1');

            const currPage = parseInt(query.page) || 1;
            const qlimit = parseInt(query.limit, 10) || 3;;

            const { category, minStock } = query; // Assuming query parameters for category and minStock

            const filter = {};
            if (category) {
                filter.category = category;
            }
            if (minStock) {
                filter.stock = { $gt: parseInt(minStock) || 0 };
            }

            const options = {
                page: currPage, // Page number
                limit: qlimit, // Number of documents per page

            };

            options.sort = { [sortField]: sortOrder };

            const results = await productsDao.getProducts(filter, options)

            return results

        } catch (error) {
            throw new Error(error.message)
        }
    }
    

    static async saveProduct(product, owner, ownerRole) {
        try {
            const newProduct = new Product({
                title: product.title,
                description:  product.description,
                price: parseFloat( product.price),
                thumbnails:  product.thumbnails,
                code:  product.code,
                stock:  product.stock,
                status:  product.status,
                owner,
                ownerRole,
                category:  product.category,
            })
            const productSave = await productsDao.createProducts(newProduct)

            return productSave

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getProductId(id) {
        try {
            const result = await productsDao.getProductsById(id)
            return result


        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteProduct(id,email) {
        try {
           
            const result = await productsDao.deleteProduct(id, email)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    static async updateProduct(product, email,role) {
        try {
            const update = {
                title:  product.title,
                description:  product.description,
                price:  product.price,
                thumbnails:  product.thumbnails,
                code:  product.code,
                stock:  product.stock,
                status:  product.status,
                category:  product.category,
            }
            const productUpdated = await productsDao.updateProducts(product._id,update)
            return productUpdated
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default productService;