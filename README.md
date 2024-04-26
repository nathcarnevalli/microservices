# Microservices 

<p>The application consists of a certificate generation system with two microservices that communicate asynchronously through RabbitMQ. It was developed using Postman as a client and the Node.js language. Also, Nodemailer is used to send emails to the recipient, pdf-html for generating a PDF based on HTML, and Mongoose for communication with the database built with MongoDB.</p>

<p>Within this project, the user fills in the email, name and lastname fields. The order microservice, upon receiving a request, searches the database to see if the course has been completed in order to issue the certificate. If the course has been successfully completed, the microservice sends a message containing the user's information retrieved from the database query to RabbitMQ. The message broker sends the message to the certificate generation microservice, which assumes responsibility for creating the customized certificate, incorporating all the provided information upon consuming the message, and then sending it to the recipient.</p>

