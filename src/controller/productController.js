'use strict'

import { Product } from '../models/productModel.js'
import { Users } from "../models/usersmodel.js";

export const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 2;
    // const page = parseInt(req.query.page) || 1;
    const { category, minStock, status } = req.query;

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
    try {
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        // const products = await Product.find(filter).sort({ [sortField]: sortOrder }).limit(limit).exec();
        const options = {
            sort: { [sortField]: sortOrder },
            page: req.query.page || 1,
            limit: limit
        };
        const result = await Product.paginate(filter, options);


        const response = {
            status: 'success',
            payload: result.docs,
            pagination: {
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.page - 1 : null,
                nextPage: result.hasNextPage ? result.page + 1 : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/product?page=${result.page - 1}` : null,
                nextLink: result.hasNextPage ? `/api/product?page=${result.page + 1}` : null,
            }
        };
        const { first_name, last_name, email, age } = req.session.user

        const query = Users.where({
            first_name,
            last_name,
            email,
            age
        })

        const userData = await query.findOne();

        console.log(userData)
        let admin;
        if (userData._doc.role === 'ADMIN') {
            admin = true
        } else {
            admin = false
        }
        res.render('allproductos', {
            response,
            products: result.docs,
            user: userData,
            admin
        });



    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const saveProduct = async (req, res) => {
    try {
        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            thumbnails: req.body.thumbnails,
            code: req.body.code,
            stock: req.body.stock,
            status: req.body.status,
            category: req.body.category,
        })

        const productSave = await product.save()
        res.status(201).send({
            productSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const getProductByID = async (req, res) => {
    try {
        const query = Product.where({ _id: req.params.pid })
        console.log(req.params)
        const products = await query.findOne()

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products found',
            })
        }

        res.render('productosDetalles', products)

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        // const query = Product.where({ id: req.params.pid });
        const products = await Product.deleteOne({ _id: req.params.pid })

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products deleted',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: `Product ID: ${req.params.pid} deleted`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const modifyProduct = async (req, res) => {
    try {
        // const query = Product.where({ id: req.params.pid });
        const filter = { _id: req.params.pid }

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
        const products = await Product.findOneAndUpdate(filter, update, {
            returnOriginal: false,
        })

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products updated',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: `Product ID: ${req.params.pid} updated with info: ${products}`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
