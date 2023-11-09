'use strict'

import mongoose from 'mongoose'

const { Schema, model } = mongoose

const products = new Schema({
    productId: String,
    quantity: Number,
})

const cartSchema = new Schema({
    products: {
        type: [products],
        required: true,
    },

    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
})

export const Cart = model('carts', cartSchema)
