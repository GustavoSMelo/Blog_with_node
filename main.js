"use strict";

//carregando modulos: 
    const express = require('express');
    const app = express();
    const path = require('path');
    const session = require('express-session');
    const flash = require('connect-flash');
    const postagens = require('./models/postagens');
    const categorias = require('./models/Category');
    const passport = require('passport');
    require('./config/auth')(passport);

//configuracoes

    //sessoes
        app.use(session({
            secret: 'umacoisamuitosecreta',
            resave: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(flash());

    //handlebars

    const handlebars = require('express-handlebars');
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    //bodyparser
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //middleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        
        next();
    });

//rotas
    const admin = require('./routes/admin');
    app.use('/admin', admin);

    app.get('/404', (req, res) =>{
        res.send('Erro 404, not found! ');
    });

    app.get('/', (req, res) =>{
        postagens.find().populate('categoria').sort({data: 'desc'}).then((posts) =>{
            res.render(`${__dirname}/views/index`, {posts: posts, title: 'Blog NodeJS'});
        });
    });

    app.get('/postagens/:slug', (req, res) =>{
        postagens.findOne({Slug: req.params.slug}).then((posts) =>{
            if(posts){
                res.render(`${__dirname}/views/postagem/mainPost`, {posts: posts, title: 'Postagem'});
            }
            else{
                res.redirect('/404');
            }
        });
    });

    app.get('/categorias', (req, res) =>{
        categorias.find().sort({data: 'desc'}).then((posts) =>{
            if(posts){
                res.render(`${__dirname}/views/categorias/homeCat`, {posts: posts, title: 'pagina principal de categorias'});
            }
            else{
                res.redirect('/404');
            }
        });
    });

    app.get('/categorias/:slug', (req, res) =>{
        categorias.findOne({slug: req.params.slug}).then((categoria) =>{
            if(categoria){
                postagens.find({categoria: categoria._id}).then((posts) =>{
                    res.render(`${__dirname}/views/categorias/postagensCat`, {posts: posts, categoria: categoria, title: 'Todos os posts com determinada categoria'});
                });
            }
            else{
                res.redirect('/404', {title: '404'});
            }
        });
    });

    const users = require('./routes/user');
    app.use('/usuarios', users);


//outros
    app.use(express.static(path.join(__dirname,"public")));

    const PORT = process.env.POST || 9997

    app.listen(PORT, () =>{
        console.log('Sevidor rodando na porta: http://localhost:9997');
    });
