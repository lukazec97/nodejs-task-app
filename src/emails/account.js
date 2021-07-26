const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const sendgridAPI_KEY = process.env.SG_API_KEY
sgMail.setApiKey(sendgridAPI_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.API_EMAIL,
        subject: 'Thanks for joining in!',
        text: `Hello, ${name}, welcome to the app. Let me know how you get along with the app`
    })

}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.API_EMAIL,
        subject: `Sorry to see you go!`,
        text: `Good bye, ${name}. Is there anything we could've done to make you stay?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

