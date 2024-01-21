import { HTTP_STATUS, HttpError } from "../utils/response.utils.js"

import { getDAOS } from "../models/DAO/indexDAO.js"

const { ticketsDao, productsDao, cartDao, usersDao } = getDAOS();

export class TicketService {
    async getTicket() {
        const Ticket = await ticketsDao.getTicket();
        return Ticket;
    }

    async getTicketById(id) {
        if (!id) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        const Ticket = await ticketsDao.getTicketById(id);
        if (!Ticket) {
            throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND)
        }
        return Ticket;
    }

    async createTicket(payload) {
        const { business, user, products } = payload;
        if (!business || !user) {
            throw new HttpError('`business` and `user` are required fields', HTTP_STATUS.BAD_REQUEST);
        }

        const businessDB = await businessesDao.getBusinessById(business);
        if (!businessDB) {
            throw new HttpError('Business not found', HTTP_STATUS.BAD_REQUEST);
        }

        const userDB = await usersDao.getUserById(user);
        if (!userDB) {
            throw new HttpError('User not found', HTTP_STATUS.BAD_REQUEST);
        }

        if (!products || !Array.isArray(products) || !products.length) {
            throw new HttpError('Products array not valid', HTTP_STATUS.BAD_REQUEST);
        }

        const productsMap = products.reduce((productsMap, currentProduct) => {
            productsMap[currentProduct.reference] = currentProduct.quantity;
            return productsMap;
        }, {});

        const productsIds = Object.keys(productsMap);
        const productsFilter = { _id: { $in: productsIds } };
        const productsDB = await productsDao.getproducts(productsFilter);

        if (!productsDB || !productsDB.length) {
            throw new HttpError('Please check products list', HTTP_STATUS.BAD_REQUEST);
        }

        let totalPrice = 0;
        const productsPayload = productsDB.map(product => {
            const reference = product._id;
            const quantity = productsMap[reference];
            const price = product.price;
            totalPrice += price * quantity;
            return {
                reference,
                quantity,
                price,
            }
        });

        const Ticket_number = Date.now();
        const newTicketPayload = {
            Ticket_number,
            business,
            user,
            status: 'pending',
            products: productsPayload,
            total_price: totalPrice,
        };

        const newTicket = await TicketDao.createTicket(newTicketPayload);
        return newTicket;
    }

    async resolveTicket(id, resolution) {
        if (!id || !resolution) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
        }

        if (resolution !== 'completed' && resolution !== 'rejected') {
            throw new HttpError('Wrong value for `resolution` param', HTTP_STATUS.BAD_REQUEST);
        }

        const Ticket = await TicketDao.getTicketById(id);
        if (!Ticket) {
            throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND);
        }

        Ticket.status = resolution;
        await TicketDao.updateTicket(id, Ticket);
        return Ticket;
    }
}