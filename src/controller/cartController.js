'use strict'

// import { Cart } from '../models/cartModel.js'
import CartService from '../servicios/cartServicios.js' 

export const getCarts = async (req, res) => {
    try {

        const carts = await CartService.getCartsService()
        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No carts found',
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
                message: 'Ok',
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
        const cartSave = await CartService.createCart()
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
        const carts = await CartService.getCartbyId(req.id.cid)
        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No cart found',
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
                message: 'No carts deleted',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
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
            res.status(200).json({ message: 'Product deleted from cart', cart: updatedCart });
        }

        else {
            // Cart with the given ID not found
            console.log('Cart not found');
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        // Handle error
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
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

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: 'error',
                message: 'La propiedad "products" debe ser un arreglo.',
            });
        }
        const existingCart = await CartService.updateProduct(req.params.cid)

        if (!existingCart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            });
        }
        existingCart.products = products;
        const updatedCart = await existingCart.save();


        res.status(200).json({
            status: 'success',
            message: 'Carrito actualizado con éxito.',
            data: updatedCart,
        });
    } catch (error) {
        console.error('Error actualizando el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.',
        });
    }
};