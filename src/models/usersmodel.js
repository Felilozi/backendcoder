import mongoose from 'mongoose'

const { Schema, model } = mongoose
const usuarioSchema = new Schema({
    first_name:String,
    last_name:String,
    email:String,
    age:Number,
    password:String,
    cart: {
        type: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
            }
        }
    },
    role: {
        type: String,
        default: 'USER' // Set default value to false for users who are not admins
    }
})
export const Users = model('users', usuarioSchema)