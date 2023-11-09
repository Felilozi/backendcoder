'use strict'

import { Message } from '../models/messageModel.js'

export const getMessage = async (req, res) => {
    try {
        return res.render('chat')
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
export const createMessage = async (req, res) => {
    try {
        const message = new Message({
            user: req.body.user,
            message: req.body.message,
        })

        const newMessage = await message.save()
        console.log(newMessage)
        res.status(201).send('Mensaje enviado exitosamente!')
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
