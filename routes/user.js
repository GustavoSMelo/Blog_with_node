"use strict";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const users = require('./../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('./../config/auth')(passport);

router.get('/registro', (req, res) =>{
    res.render(`${__dirname}/../views/users/registro`, {title: 'Registro de usuario'});
});

router.post('/registro/created', (req, res) =>{
    users.findOne({email_user: req.body.email}).then((posts) =>{
        if(posts){
            res.redirect('/usuarios/registro');
            console.log('Usuario já cadastrado!');
        }

        else{
            const usernew = new users({
                nome_user: req.body.nome,
                email_user: req.body.email,
                senha_user: req.body.senha,
            });

            bcrypt.genSalt(10, (error, salt) =>{
                bcrypt.hash(usernew.senha_user, salt,(error, hash) =>{
                    if(error){
                        console.log(`erro ao cadastrar: ${error}`);
                        req.flash('error_msg', 'Erro ao cadastrar usuario! ');
                        res.redirect('/usuarios/registro');
                    }
                    
                    else{
                        usernew.senha_user = hash;
                        usernew.save().then(() =>{
                            req.flash('success_msg', 'Sucesso ao cadastrar usuario');
                            res.redirect('/');
                        });
                    }
                    
                });
            })
        }
    });
});

router.get('/login', (req, res) =>{
    res.render(`${__dirname}/../views/users/login`);
});

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req,  res, next);
    
});

router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'Sucesso ao se desconectar ');
    res.redirect('/');

});

module.exports = router;
