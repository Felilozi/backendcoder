import { Product } from '../models/productModel.js'
class productService {

    static async getProduct(data) {
        try {
            const limit = parseInt(data.limit, 10) || 2;
            const { category, minStock, status } = data;
            const filter = {};
            if (category) {
                filter.category = category;
            }
            if (minStock) {
                filter.stock = { $gt: parseInt(minStock) || 1 };
            }
            if (status) {
                filter.status = status;
            }

            const sortField = data.sort || 'createdAt';
            const sortOrder = data.order === 'desc' ? -1 : 1;

            // const products = await Product.find(filter).sort({ [sortField]: sortOrder }).limit(limit).exec();
            const options = {
                sort: { [sortField]: sortOrder },
                page: data.page || 1,
                limit: limit
            };
            const result = await Product.paginate(filter, options);
            return result


        } catch (error) {
            throw new Error(error.message)
        }
    }

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

            const result = await product.save()
            return result


        } catch (error) {
            throw new Error(error.message)
        }
    }
    static async getProductByID(id) {
        try {
            const query = Product.where({ _id: id })
            const result = await query.findOne()
            return result


        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteProduct(id) {
        try {
            const products = await Product.deleteOne({ _id: id })

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
            const result = await Product.findOneAndUpdate(filter, update, {
                returnOriginal: false,
            })
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }




}

export default productService;