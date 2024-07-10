const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
    const { to, subject, text } = req.body;

    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@attractgame.com',
            pass: 'Korea@2101',
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    try {
        let info = await transporter.sendMail({
            from: '"Attract Game" <info@attractgame.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        });

        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
