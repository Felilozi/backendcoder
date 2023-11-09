'use strict'

import mongoose from 'mongoose'

const { Schema, model } = mongoose
const ProductSchema = new Schema({
    id: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnails: {
        type: [String],
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
})

export const Product = model('products', ProductSchema)
