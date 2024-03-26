'use strict'
import cartService from '../servicios/cartServicios.js';
import { generateUniqueCode, generateTicketHTML,generateMailToken} from '../utils/helpers.js';
import { ERROR, SUCCESS } from "../commons/dictionaryError.js";
import productService from '../servicios/productoServicios.js';
import userService from '../servicios/usersService.js';
import TicketService from '../servicios/ticketService.js';

import MailingService from '../servicios/mailing.js';
import { config } from '../config.js';

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts()
        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: ERROR.CART_NOT_FOUND,
            })
        }

        const limit = parseInt(req.query.limit, 10)
        if (!isNaN(limit)) {
            carts.slice(0, limit)
            return res.status(200).send({
                status: 200,
                message: 'Ok',
                data: carts,
            })

        } else {
            return res.status(200).send({
                status: 200,
                message: SUCCESS.CARTS_RETRIEVED,
                data: carts,
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const createCart = async (req, res) => {
    try {
        // const cartSave = await cartService.createCart()
        const cartSave = await cartService.createCart(req.session.user.email)
        res.status(201).send({
            cartSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const getCartbyId = async (req, res) => {
    try {

        const carts = await cartService.getCartId(req.params.cid)
        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: ERROR.CART_NOT_FOUND,
            })
        }
        const productData = carts.products.map(product => ({
            title: product.producto.title,
            description: product.producto.description,
            quantity: product.quantity,
            price: product.producto.price * product.quantity,

        }));
        res.status(200).send({ body: carts })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
//borra todo el carrito
export const deleteCart = async (req, res) => {
    try {
        // const carts = await cartService.deleteCart(req.params.cid)
        const carts = await cartService.deleteCart(req.params.pid)

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: ERROR.CART_NOT_DELETED,
            })
        }

        return res.status(200).send({
            status: 200,
            message: SUCCESS.CART_DELETED,
            data: `Cart ID: ${req.params.cid} deleted`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
export const deleteProductFromCart = async (req, res) => {
    try {


        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartService.deleteProductFromCart(cartId, productId)

        if (updatedCart) {
            
            res.status(200).json({ message: SUCCESS.PRODUCT_DELETED_FROM_CART, cart: updatedCart });
        }

        else {
            res.status(404).json({ message: ERROR.CART_NOT_FOUND });
        }
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: ERROR.SERVER_ERROR });
    }
};

export const addProductToCart = async (req, res) => {

    try {
        const { quantity } = req.body;

        const { pid } = req.params;

        const user = await userService.getUser(req.session.user.email);
        const cid = user.cart._id.toString();
        const cart = await cartService.addProduct(pid, quantity, cid)
        res.status(200).send({
            body: cart,
            message: SUCCESS.CART_UPDATED
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
export const updateProduct = async (req, res) => {
    try {

        const { products } = req.body;
        const cartId = req.params.cid;

        const updatedCart = await cartService.updateProduct(products, cartId)

        if (updatedCart) {
            res.status(200).json({
                status: 'success',
                message: SUCCESS.CART_UPDATED,
                data: updatedCart,
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: ERROR.CART_NOT_UPDATED,
                data: updatedCart,
            });
        }


    } catch (error) {

        res.status(500).json({
            status: 'error',
            message: ERROR.SERVER_ERROR,
        });
    }
};
export const purchaseCart = async (req, res) => {

    try {

        const cartId = req.params.cid;

        // Obtener el carrito
        const cart = await cartService.getCartId(cartId)

        const processedProducts = [];
        const unprocessedProductIds = [];
        for (const cartProduct of cart.products) {
            const productId = cartProduct.producto;
            const requestedQuantity = cartProduct.quantity;
            const product = await productService.getProductId(productId);
            if (product.stock >= requestedQuantity && product.status !== false) {
                // Suficiente stock, restar del stock y continuar
                product.stock -= requestedQuantity;
                if (product.stock === 0) {
                    product.status = false;
                }

                const productUpdated = await productService.updateProduct(product, req.session.user.email, req.session.user.role);
                processedProducts.push({
                    product: product.title,
                    quantity: requestedQuantity,
                    unitPrice: product.price,
                });

                await cartService.deleteProduct(cartId, productId)

            } else {
                unprocessedProductIds.push(`${ERROR.STOCK_LIMIT} ${cartProduct._doc.title}`);
            }
        }

        if (processedProducts.length > 0) {

            const ticket = {
                code: generateUniqueCode(),
                createdAt: new Date(),
                amount: processedProducts.reduce((total, product) => total + product.quantity * product.unitPrice, 0),
                purchaser: cart.purchaser,
                products: processedProducts,
            };

            const ticketCreart = await TicketService.createTicket(ticket)
            if (ticketCreart) {
                const token = generateMailToken(req.body.email)
                const htmlticket = generateTicketHTML(ticket)
                const mailer = new MailingService()
                const sendMailer = await mailer.sendMailUser({
            
                    from: config.MAIL_USER,
                    to: req.session.user.email,
                    subject: 'Restaurar Contraseña',
                    html:htmlticket,
            
                })}
            if (unprocessedProductIds.length > 0) {
                res.status(200).json({ message: SUCCESS.PURCHASE_SUCCESSFUL, ticket, unprocessedProductIds });
            } else {
                res.status(200).json({ message: SUCCESS.PURCHASE_SUCCESSFUL, ticket })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: ERROR.SERVER_ERROR });
    }
};