const mongoose = require("mongoose");

const Postagem = mongoose.Schema({
    texto: {
        type: String,
        require: true
    },
    imagem: {
        type: String,
        default: "Sem imagem"
    }
});

mongoose.model("postagens", Postagem);