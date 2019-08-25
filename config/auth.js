"use strict";

//carregando modulos
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('./../models/User');
const user = mongoose.model('usuarios');

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) =>{
        user.findOne({email_user:  email}).then((user) =>{
            if(!user){
                console.log("Conta não encontrada! ");
                return done(null, false, {message: "Esta conta não existe em nosso sistema! "});
            };

            bcrypt.compare(senha, user.senha_user, (error, iguais) =>{
                if(iguais){
                    return done(null, user);
                }

                else{
                    console.log('Senha invalida! ');
                    console.log(`${senha} e foi : ${user.senha_user}`)
                    return done(null, false, {message: "Senha inválida, tente novamente "});
                };

            });
        });
    }));

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser((id, done) =>{
        user.findById(id, (err, user) =>{
            done(err, user);
        });
    });
};
