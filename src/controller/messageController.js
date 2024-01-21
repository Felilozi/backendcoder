'use strict'

import { Message } from "../models/Models/messageModel.js";
export const getMessage = async (req, res) => {

    try {

        return res.render('chat');

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: 500,
            message: err.message,
        });
    }

}
export const createMessage = async (req, res) => {

    try {
        const message = new Message
            ({
                user: req.body.user,
                message: req.body.message,
            })

        const newMessage = await Message.save()
        res.status(201).send(
            'Mensaje enviado exitosamente!'
        )
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: 500,
            message: err.message,
        });
    }
}