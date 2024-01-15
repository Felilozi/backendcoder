'use strict'
import productService from '../servicios/productoServicios.js' ; 
import UserService from '../servicios/userServicios.js' ; 

export const getProducts = async (req, res) => {
    try { 
        const currPage = parseInt(req.query.page) || 1;
        const result = await productService.getProduct(req.query);
        if (result.length === 0) {
            const responseError = {
                status: 'error',
                payload: 'No products found',
            };

            return res.status(404).json(responseError);
        }
        // const hasNextPage = page < totalPages;
        // const hasPrevPage = page > 1;
        const hasNextPage = result.hasNextPage;
        const hasPrevPage = result.hasPrevPage;
        let prevLink = null;
        let nextLink = null;

        if (hasPrevPage) {
            prevLink = `/api/product?page=${currPage - 1}`;
        }

        if (hasNextPage) {
            nextLink = `/api/product?page=${currPage + 1}`;
        }
        const totalPages = result.totalPages;
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
        const { email } = req.session.user
        // const userData = await query.findOne();
        const userData = await UserService.getUser(email)


        console.log(userData)
        let admin;
        if (userData.role === 'ADMIN') {
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
        const productSave = await productService.saveProduct(req.body)
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
        const products = await productService.getProductByID(req.params.pid)

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
        const products = await productService.deleteProduct(req.params.pid);
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
        const filter = { _id: req.params.pid }
        // const products = await productService.modifyProduct(req.params.pid);
        const products = await productService.modifyProduct(req.body)
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
