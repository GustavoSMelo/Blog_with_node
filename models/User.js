"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true});

const usuario = mongoose.Schema({
    nome_user:{
        type: String,
        require: true
    },

    email_user:{
        type: String,
        require: true
    },

    senha_user:{
        type: String,
        require: true
    },

    data_cadastro: {
        type: Date,
        require: true,
        default: Date.now()
    },

    itsAdmin:{
        type: Boolean,
        require: true,
        default: false
    }
});

mongoose.model('usuarios', usuario);
const users = mongoose.model('usuarios');

module.exports = users;
