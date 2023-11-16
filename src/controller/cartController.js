'use strict'

import { Cart } from '../models/cartModel.js'

export const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find({}).select(['-__v']).populate('products.producto');

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

            // res.json(JSON.parse(products.slice(0, limit)))
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
        const cart = new Cart({
            products: [],
        })

        const cartSave = await cart.save()
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
        const query = Cart.where({ _id: req.params.cid })
        const carts = await query.findOne().populate('products.producto');
    
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
            price:product.producto.price * product.quantity,
            
        }));
        res.render('cartDetails', { products: productData });
        // res.render('cartDetails', {products:carts.products} );

        // res.status(200).send({
        //     status: 200,
        //     message: 'Ok',
        //     data: carts,
        // })
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
        // const query = Product.where({ id: req.params.pid });
        const carts = await Cart.deleteOne({ _id: req.params.cid }).populate('products.producto');

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

        // Buscar el carrito por su ID y actualizarlo
        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            { $pull: { products: { producto: productId } } },
            { new: true }
        ).populate('products.producto');

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
    const{quantity }= req.body ;

    try {
        const cart = await Cart.findOneAndUpdate(
            { _id: cid, 'products.producto': pid },
            { $inc: { 'products.$.quantity':quantity || 1 } },
            { new: true } // Return the modified document
        ).populate('products.producto');

        if (!cart) {
            const newCart = {
                producto: pid,
                quantity:quantity || 1
            };
            const savedCart = await Cart.findOneAndUpdate({ 
                _id: cid },
            { $push: { products: newCart } },
            { new: true } // Return the modified document
        ).populate('products.producto');

            return res.json(savedCart);
        }else {
            res.json(cart);
        }
        
        // At this point, 'cart' contains the cart with the updated quantity
        } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
export const  updateProduct = async (req, res) => {
    try { 
        // 1. Validar la entrada
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: 'error',
                message: 'La propiedad "products" debe ser un arreglo.',
            });
        }

        // 2. Buscar el carrito por ID
        const cartId = req.params.cid;
        const existingCart = await Cart.findById(cartId);

        if (!existingCart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            });
        }

        // 3. Actualizar el carrito
        existingCart.products = products;
        const updatedCart = await existingCart.save();

        // 4. Responder con la respuesta actualizada
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