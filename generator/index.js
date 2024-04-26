const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const amqp = require('amqplib/callback_api');
const fs = require('fs');
const pdf = require('html-pdf');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "nathaliacarnevalli004@gmail.com",
    pass: "fdli doss fvau apyf",
  },
});


amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue('user', {
      durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", 'user');

    channel.consume('user', function (msg) {
      console.log(" [x] Received %s", msg.content.toString());
      const clienteInfo = JSON.parse(msg.content.toString())

      const options = {
        from: `Certificate for ${clienteInfo.course} <nathaliacarnevalli004@gmail.com>`,
        to: clienteInfo.email,
        subject: `Certificate for ${clienteInfo.course}`,
        text: `Congratulations ${clienteInfo.name}! You have successfully completed the course ${clienteInfo.course}. Attached is your certificate.`,
        attachments: [
          {
            filename: 'certificate.pdf',
            path: 'certificate.pdf'
          }
        ]
      }

      const content = `
            <h1>Certificate</h1>
            <p>This is to certify that</p>
            <p>${clienteInfo.name} ${clienteInfo.lastname}</p>
            <p>Has successfully completed the course</p>
            <p>${clienteInfo.course}</p>
            <hr>
            <p>Duration:</p>
            <p>${clienteInfo.hours} HOURS</p>
            `
      pdf.create(content, {}).toFile("./certificate.pdf", (error, response) => {
        if (error) {
          return console.log('An error occurred... :(');
        }

        transporter.sendMail(options,
          (error) => {
            if (error) {
              console.log('Error sending email...');
            } else {
              console.log(`Certificate sent!`);
              fs.unlink('certificate.pdf', (unlinkError) => {
                if (unlinkError) {
                  console.error('Error deleting file:', unlinkError);
                } else {
                  console.log('Existing PDF file removed successfully.');
                }

              });
            }
          });
      });
    }, {
      noAck: true
    });
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
