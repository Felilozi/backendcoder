import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ticketSchema = new Schema({
    // "_id": ObjectId,                   // Autogenerado por MongoDB
    code: {
        type: String,
        required: true
    },
    // Autogenerado y único
    createdAt: { type: Date, default: Date.now },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String,
        required: false
    },               // Correo del usuario asociado al carrito

    products: {
        type: [{
            product: {
                type: String,
            },
            quantity: {
                type: Number,
            }


        }]
    }
}
);


export const Ticket = model('tickets', ticketSchema)