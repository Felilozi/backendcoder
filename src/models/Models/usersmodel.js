import mongoose from 'mongoose'

const { Schema, model } = mongoose
const usuarioSchema = new Schema({

    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: [{
            cid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
            }
        }
        ], default: [],
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'USER' // Set default value to false for users who are not admins
    }
})
export const Users = model('users', usuarioSchema)
//ok