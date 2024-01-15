import { Product } from '../models/Moleds/productModel.js'
import { getDAOS } from "../models/daos/index.dao.js";
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
    // class productService {

    //     static async getProduct(data) {
    //         try {
    //             const limit = parseInt(data.limit, 10) || 2;
    //             const { category, minStock, status } = data;
    //             const filter = {};
    //             if (category) {
    //                 filter.category = category;
    //             }
    //             if (minStock) {
    //                 filter.stock = { $gt: parseInt(minStock) || 1 };
    //             }
    //             if (status) {
    //                 filter.status = status;
    //             }

    //             const sortField = data.sort || 'createdAt';
    //             const sortOrder = data.order === 'desc' ? -1 : 1;

    //             // const products = await Product.find(filter).sort({ [sortField]: sortOrder }).limit(limit).exec();
    //             const options = {
    //                 sort: { [sortField]: sortOrder },
    //                 page: data.page || 1,
    //                 limit: limit
    //             };
    //             const result = await Product.paginate(filter, options);
    //             return result


    //         } catch (error) {
    //             throw new Error(error.message)
    //         }
    //     }

    static async saveProduct(data) {
        try {
            const product = new Product({
                title: data.title,
                description: data.description,
                price: data.price,
                thumbnails: data.thumbnails,
                code: data.code,
                stock: data.stock,
                status: data.status,
                category: data.category,
            })

            //         const result = await product.save()
            //         return result


            //     } catch (error) {
            //         throw new Error(error.message)
            //     }
            // }
            const productSave = await productsDao.createProducts(newProduct)

            return productSave

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getProductByID(id) {
        try {
            // const query = Product.where({ _id: id })
            // const result = await query.findOne()
            const result = await productsDao.getProductsById(id)
            return result


        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteProduct(id) {
        try {
            // const products = await Product.deleteOne({ _id: id })
            const result = await productsDao.deleteProduct(id)

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async modifyProduct(id) {
        try {
            const filter = { _id: id }
            const update = {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                thumbnails: req.body.thumbnails,
                code: req.body.code,
                stock: req.body.stock,
                status: req.body.status,
                category: req.body.category,
            }

            // `doc` is the document _after_ `update` was applied because of
            // `returnOriginal: false`
            // const result = await Product.findOneAndUpdate(filter, update, {
            //     returnOriginal: false,
            // })
            // return result
            const productUpdated = await productsDao.updateProducts(product._id,update)
            return productUpdated
        } catch (error) {
            throw new Error(error.message)
        }
    }




}

export default productService;