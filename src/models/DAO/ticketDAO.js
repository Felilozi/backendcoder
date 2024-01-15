import { Ticket } from "../schemas/ticketModel.js";

export class TicketDAO {
    async getTicket() {
        const Ticket = await Ticket.find().lean();
        return Ticket;
    }

    async getTicketById(id) {
        const order = await Ticket.findOne({ _id: id }).lean();
        return order;
    }

    async createTicket(payload) {
        const newOrder = await Ticket.create(payload);
        return newOrder;
    }

    async updateTicket(id, payload) {
        const updatedOrder = await Ticket.updateOne({ _id: id }, {
            $set: payload
        });
        return updatedOrder;
    }
}