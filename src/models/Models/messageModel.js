'use strict'

import mongoose from "mongoose";

const { Schema, model } = mongoose
const MessageSchema = new Schema({
    user: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
});

export const Message = model('messages', MessageSchema)