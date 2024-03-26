import mailer from 'nodemailer';
import { config } from '../config.js';

export default class MailingService {

    constructor() {
        this.client = mailer.createTransport({
            service: config.MAIL_SERVICE,
            port: 587,
            auth: {
                user: config.MAIL_USER,
                pass: config.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // Ignora la validación del certificado SSL
              }
        })
    }

    async sendMailUser({ from, to, subject, html, attachments = [] }) {

        const mailOptions = {
            from,
            to,
            subject,
            text: html
        };

        this.client.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error occurred:', error);
            } else {
                console.log('Email sent successfully:', info.response);
                return info.response.toString();
            }
        });
    }

}