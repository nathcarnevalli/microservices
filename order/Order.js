const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Mongoose adiciona automaticamente um identificador único
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true
    },
    horas: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    finalizado: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
