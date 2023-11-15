'use strict'

import mongoose from 'mongoose'

const { Schema, model } = mongoose


const cartSchema = new Schema({
    products: {
        type:[{
            producto:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            quantity:{
                type: Number,
            }

            
        }] ,
        default:[],
        required: true,
    },

    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
})

export const Cart = model('carts', cartSchema)
