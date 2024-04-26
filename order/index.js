const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const Order = require('./Order');

// Database
mongoose.connect('mongodb://localhost:27017/work');
const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err);
});

db.once('open', () => {
  console.log('Database connected!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/order', async (req, res) => {
  const { name, lastname, email } = req.body; // Get the information entered by the user in the body

  if (!name || !lastname || !email === "") {
    return res.status(400).json({ error: 'All fields must be filled correctly.' });
  } else {
    // Compare the information with the database to see if the user is registered in the system
    const client = await Order.findOne({ name: name, lastname: lastname, email: email });

    if (!client) { // User doesn't exist
      return res.status(400).json({ error: 'Client not found...' });
    } else { // User exists
      if (client.completed) { // Check if the registered user has completed the course
        amqp.connect('amqp://localhost', (err, connection) => {
          if (err) {
            throw err;
          }
          connection.createChannel((err1, channel) => {
            if (err1) {
              throw err1;
            }

            channel.assertQueue('user', {
              durable: false
            });
            const msg = JSON.stringify(client);
            channel.sendToQueue('user', Buffer.from(msg));
            console.log(" Sent %s", msg);
          })

        })
        res.status(200).json({ message: 'Order successfully placed!' });
      } else {
        return res.status(400).json({ error: 'Order rejected because the course has not been completed...' });
      }
    }
  }

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
