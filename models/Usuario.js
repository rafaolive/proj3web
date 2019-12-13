const mongoose = require("mongoose")

const Usuario = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    },
    nascimento: {
        type: Number,
        require: true
    },
    eAdmin: {
        type: Number,
        default:0
    }
})

mongoose.model("usuarios", Usuario)