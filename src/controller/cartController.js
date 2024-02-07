'use strict'

import CartService from '../servicios/cartServicios.js' 

import { generateUniqueCode } from '../utils/helpers.js';
import { ERROR ,SUCCESS} from '../dictionaryError.js';
import productService from '../servicios/productoServicios.js';


export const getCarts = async (req, res) => {
    try {
        const carts = await CartService.getCarts()

        // const carts = await CartService.getCartsService()
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
        // const cartSave = await CartService.createCart()
        const cartSave = await CartService.createCart(req.session.user.email)
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
        // const carts = await CartService.getCartbyId(req.id.cid)
        const carts = await CartService.getCartId(req.params.cid)
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
        res.render('cartDetails', { products: productData })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const deleteCart = async (req, res) => {
    try {
        const carts = await CartService.deleteCart(req.params.cid)
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
        const updatedCart = await CartService.deleteProductFromCart(cartId, productId)

        if (updatedCart) {
            console.log('Product deleted from cart', updatedCart);
            res.status(200).json({ message:  SUCCESS.PRODUCT_DELETED_FROM_CART, cart: updatedCart });
        }

        else {
            // console.log('Cart not found');
            res.status(404).json({ message: ERROR.CART_NOT_FOUND });
        }
    } catch (error) {
        // Handle error
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: ERROR.SERVER_ERROR});
    }
};

export const addProductToCart = async (req, res) => {

    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartService.addProductToCart(cid, pid, quantity)

        if (!cart) {
            const newCart = {
                producto: pid,
                quantity: quantity || 1
            };
            const savedCart = await CartService.addProductToCartsavedCart(cid, newCart)

            const productData = savedCart.products.map(product => ({
                title: product.producto.title,
                description: product.producto.description,
                quantity: product.quantity,
                price: product.producto.price * product.quantity,

            }));
            res.render('cartDetails', { products: productData });

        } else {
            // res.json(cart);
            const productData = cart.products.map(product => ({
                title: product.producto.title,
                description: product.producto.description,
                quantity: product.quantity,
                price: product.producto.price * product.quantity,

            }));
            res.render('cartDetails', { products: productData });
        }
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

        const updatedCart = await CartService.updateProduct(products, cartId)

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
        // Verificar el stock y actualizar la base de datos
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
                const product = await productService.getProductByID(productId);
                const productUpdated = await updateProduct.getProductId(product);// Llenar el array con la información del producto procesado
                processedProducts.push({
                    //   productId: product._id,
                    product: product.title,
                    quantity: requestedQuantity,
                    //   unitPrice: product.price,
                });

                // Quitar el producto del array 'products' en el carrito
                await cartService.deleteProduct(cartId, productId)

            } else {
                // No hay suficiente stock, agregar el ID del producto al array de no procesados
                unprocessedProductIds.push(`${ERROR.STOCK_LIMIT} ${cartProduct._doc.title}`);
            }
        }

        if (processedProducts.length > 0) {
            // Si hay productos procesados, generar el ticket
            const ticket = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: processedProducts.reduce((total, product) => total + product.quantity * product.unitPrice, 0),
                purchaser: cart.purchaser,
                processedProducts,
            };

            if (unprocessedProductIds.length > 0) {
                res.status(200).json({ message:  SUCCESS.PURCHASE_SUCCESSFUL, ticket, unprocessedProductIds });
            } else {
                res.status(200).json({ message: SUCCESS.PURCHASE_SUCCESSFUL, ticket })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: ERROR.SERVER_ERROR });
    }
};