var nodemailer = require('nodemailer');
const Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'lehienmine@gmail.com',
        pass: 'vwadiinzzljlopji'
    }
});
module.exports = Transporter;