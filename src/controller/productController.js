'use strict'

import { Product } from '../models/productModel.js'

export const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const products = await Product.find({}).sort({ [sortField]: sortOrder }).limit(limit).exec();

        res.json(products);
        console.log(products)


        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products found',
            })
        }

        // const limit = parseInt(req.query.limit, 10)
        // if (!isNaN(limit)) {
        //     products.slice(0, limit)
        //     return res.render('realTimeProducts', { products })

        //     // res.json(JSON.parse(products.slice(0, limit)))
        // } else {
        //     return res.render('realTimeProducts', { products })
        // }
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

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: products,
        })
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
