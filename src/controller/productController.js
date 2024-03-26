'use strict'
import { ERROR, SUCCESS } from '../commons/dictionaryError.js'
import productService from '../servicios/productoServicios.js';
import userService from '../servicios/usersService.js';
import  {generateMailToken} from '../utils/helpers.js';
import MailingService from '../servicios/mailing.js';


export const getProducts = async (req, res) => {
    try {
        const currPage = parseInt(req.query.page) || 1;
        const result = await productService.getProducts(req.query);
        if (result.length === 0) {
            const responseError = {
                status: 'error',
                payload: ERROR.NO_PRODUCTS_FOUND,
            };
        

        return res.status(404).json(responseError);
    }

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
    const userData = await userService.getUser(email)



    let admin;
    if (userData.role === 'ADMIN') {
        admin = true
    } else {
        admin = false
    }
    `${nextLink}`
    const cart = userData.cart._id;
    
    

    res.render('allproductos', {
        response,
        products: result.docs,
        user: userData,
        admin,
        cart
    });



} catch (err) {
    console.log(err)
    res.status(500).send({
        status: 500,
        message: ERROR.NO_PRODUCTS_FOUND,
    })
}
}

export const saveProduct = async (req, res) => {
    try {
        const productSave = await productService.saveProduct(req.body,req.session.user.email,req.session.user.role)

        if (!productSave) {
            return res.status(500).send({
                status: 500,
                message: ERROR.PRODUCT_NOT_SAVED,
            })
        }
        res.status(201).send({
            status: 'success',
            message: SUCCESS.PRODUCT_SAVED,
            productSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_SAVED,
        })
    }
}
export const getProductByID = async (req, res) => {
    try {
        const products = await productService.getProductId(req.params.pid)

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: ERROR.PRODUCT_NOT_FOUND,
            })
        }
        res.status(200).send({
            body: products
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_FOUND,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productToDelete = await productService.deleteProduct.getProductByID(req.params.pid)
        if (productToDelete) {
        const products = await productService.deleteProduct(req.params.pid,req.session.user.email)
        }
        if (!products) {
            return res.status(404).send({
                status: 404,
                message: ERROR.PRODUCT_NOT_DELETED,
            })
        }
        if (productToDelete.ownerRole === 'PREMIUM'&& productToDelete.owner){
            const token = generateMailToken(productToDelete.owner)
                const htmlticket = `Se a producto  ${productToDelete.title}`
                const mailer = new MailingService()
                const sendMailer = await mailer.sendMailUser({
            
                    from: config.MAIL_USER,
                    to: productToDelete.owner,
                    subject: 'Product Eliminado',
                    html:htmlticket,
            
                })

        }
        return res.status(200).send({
            status: 'success',
            message: SUCCESS.PRODUCT_DELETED,
            data: `Product ID: ${req.params.pid} deleted`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_DELETED,
        })
    }
}

export const modifyProduct = async (req, res) => {
    try {
        const filter = { _id: req.params.pid }
        const products = await productService.updateProduct(req.body, req.session.user.email)
        if (!products) {
            return res.status(404).send({
                status: 404,
                message: ERROR.PRODUCT_NOT_UPDATED,
            })
        }

        return res.status(200).send({
            status: 'success',
            message: SUCCESS.PRODUCT_UPDATED,
            data: `Product ID: ${req.params.pid} updated with info: ${products}`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_UPDATED,
        })
    }
}