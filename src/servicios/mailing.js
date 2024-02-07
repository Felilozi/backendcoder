import mailer from 'nodemailer';
import { config } from '../config.js';

export default class MailingService {

    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.USER,
            port: 587,
            auth: {
                user: config.mailing.USER,
                pass: config.mailing.PASSWORD
            }
        })
    }

    async sendMailUser({ from, to, subject, html, attachments = [] }) {
        let result =  this.client.sendMail(from, to, subject, html, attachments);
        return result;
    }

}