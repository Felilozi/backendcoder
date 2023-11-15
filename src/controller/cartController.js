'use strict'

import { Cart } from '../models/cartModel.js'

export const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find({}).select(['-__v'])

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
        const carts = await query.findOne()

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No cart found',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: carts,
        })
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
        const carts = await Cart.deleteOne({ _id: req.params.cid })

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

export const addProductToCart = async (req, res) => {
    // try {
    //     // const query = Product.where({ id: req.params.pid });
    //     const { cid , pid } = req.params;
    //     const query = Cart.where({ _id: cid, 'products.producto': pid })
    //     const carts = await Cart.findOne({ _id: cid, 'products.producto': pid }).populate('products.producto')
    //     console.log(carts)
    //     let ProductByIdIndex = carts.products.findIndex(product => product.producto === req.params.pid)

    //     // Update the specified product quantity
    //     if (ProductByIdIndex !== -1) {
    //         carts.products[ProductByIdIndex].quantity += 1
    //     } else {
    //         // If the product doesn´t exists, create it
    //         const product = {
    //             producto: {_id : req.params.pid},
    //             quantity: 1,
    //         }
    //         carts.products.push(product)
    //     }

    //     const filter = { _id: req.params.cid }

    //     const update = {
    //         products: carts.products,
    //     }

    //     // `doc` is the document _after_ `update` was applied because of
    //     // `returnOriginal: false`
    //     const cartUpdated = await Cart.findOneAndUpdate(filter, update, {
    //         returnOriginal: false,
    //     })

    //     if (!carts) {
    //         return res.status(404).send({
    //             status: 404,
    //             message: 'No cart updated',
    //         })
    //     }

    //     return res.status(200).send({
    //         status: 200,
    //         message: 'Ok',
    //         data: `Cart ID: ${req.params.cid} updated with info: ${cartUpdated}`,
    //     })
    const { cid, pid } = req.params;

try {
  const cart = await Cart.findOneAndUpdate(
    { _id: cid, 'products.producto': pid },
    { $inc: { 'products.$.quantity': 1 } },
    { new: true } // Return the modified document
  ).populate('products.producto');

  if (!cart) {
    // If the cart is not found or the product is not in the cart, you might want to create a new entry
    // Alternatively, you can handle it based on your specific use case.
    // For this example, let's create a new entry if not found.
    const newCart = new Cart({
      _id: cid,
      products: [{ producto: pid, quantity: 1 }],
    });
    const savedCart = await newCart.save();
    return res.json(savedCart);
  }

  // At this point, 'cart' contains the cart with the updated quantity
  res.json(cart);

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
