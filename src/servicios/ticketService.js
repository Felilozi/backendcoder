import { ERROR } from "../commons/dictionaryError.js"

import { getDAOS } from "../models/DAO/indexDAO.js"

const { ticketsDao, productsDao, cartDao, usersDao } = getDAOS();

export default class TicketService {
    static async getTicket() {
        const Ticket = await ticketsDao.getTicket();
        return Ticket;
    }

   static  async getTicketById(id) {
        if (!id) {
            throw new Error(ERROR.CART_NOT_FOUND);        }
        const Ticket = await ticketsDao.getTicketById(id);
        if (!Ticket) {
            throw new Error(ERROR.CART_NOT_FOUND);        }
        return Ticket;
    }

    static async createTicket(ticket) {
        const { code, purchaser, products } = ticket;
        if (!code){
            throw new Error(ERROR.CART_NOT_FOUND);        }

        const userDB = await usersDao.getUsersByEmail(purchaser);
        if (!userDB) {
            throw new Error(ERROR.CART_NOT_FOUND);        }

        if (!products || !Array.isArray(products) || !products.length) {
            throw new Error(ERROR.CART_NOT_FOUND);        }

       

        const newTicket = await ticketsDao.createTicket(ticket);
        return newTicket;
    }

    static async resolveTicket(id, resolution) {
        if (!id || !resolution) {
            throw new Error(ERROR.CART_NOT_FOUND);        }

        if (resolution !== 'completed' && resolution !== 'rejected') {
            throw new Error(ERROR.CART_NOT_FOUND);        }

        const Ticket = await ticketsDao.getTicketById(id);
        if (!Ticket) {
            throw new Error(ERROR.CART_NOT_FOUND);        }

        Ticket.status = resolution;
        await ticketsDao.updateTicket(id, Ticket);
        return Ticket;
    }
}