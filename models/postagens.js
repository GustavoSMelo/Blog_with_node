"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true});

const posts = mongoose.Schema({
    Titulo: {
        type: String,
        require: true
    },

    Slug: {
        type: String,
        require: true
    },

    descricao: {
        type: String,
        require: true
    },

    conteudo: {
        type: String,
        require: true
    },

    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorias',
        require: true
    },

    Data_emissao: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('postagens', posts);
const postagem = mongoose.model('postagens');

module.exports = postagem;
