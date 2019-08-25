"use strict";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const categoria = mongoose.model('categorias');
const postagem = require('../models/postagens');
const {itAdmin} = require('./../helpers/itsAdmin');

router.get('/', itAdmin,(req, res) =>{
    res.render(`${__dirname}/../views/admin/home`);
});

router.get('/posts', (req, res) =>{
    res.render(`${__dirname}/../views/admin/posts`, {title: 'main page for posts'});
});


router.get('/categorias', itAdmin,(req, res) =>{
    categoria.find().sort({data: 'desc'}).then((posts) =>{
        res.render(`${__dirname}/../views/admin/category`, {posts: posts});
    }).catch((erro) =>{
        req.flash('msg_error', `Erro ao listar as categorias! ${erro}`);
        res.render('/admin/categorias', {});
    }); 
});

router.get('/categorias/add', itAdmin,(req, res) =>{
    res.render(`${__dirname}/../views/admin/addcategory`, {
        title: 'Adicionar uma nova categoria'
    });
});

router.post('/categorias/new', (req, res) =>{
    var erros = [];

    if(req.body.nomeC == '' || req.body.slugC == '' || 
    req.body.nomeC == undefined || req.body.slugC == undefined || req.body.nomeC == null || req.body.slugC == null){
        erros.push({texto: 'nome ou slug não foram registrados! '});
        window.alert(erros[0]);
    }

    else if(req.body.nomeC.length < 2){
        erros.push({texto: 'nome da categoria muito pequeno! '})
    }

    if(erros.length > 0){
        res.render('../views/admin/addcategory', {erros: erros});
    }else{
        const newCategory = {
            nome: req.body.nomeC,
            slug: req.body.slugC
        };
    
        new categoria(newCategory).save().then(() =>{
            req.flash('success_msg', 'Categoria salva com sucesso! ');
        }).catch((err) =>{
            req.flash('error_msg', 'Erro ao cadastrar categoria! ');
        });
        res.redirect('/admin/categorias');
    }
});

router.get('/test', (req, res) =>{
    res.render(`${__dirname}/../views/layouts/teste`, {
        title: 'Teste',
        style: 'bootstrap.css'
    });
});

router.get('/categorias/edit/:id', itAdmin,(req, res) =>{
    categoria.findOne({_id: req.params.id}).then((posts) =>{
        res.render('admin/editCategorias', {posts: posts, title: 'editar categoria'});
    }).catch((err) =>{
        res.send('Categoria nao encontrada! ');
    });
});

router.post('/categorias/edited', (req, res) =>{
    categoria.findOne({_id: req.body.id}).then((categoria) =>{
        categoria.nome = req.body.nomeC,
        categoria.slug = req.body.slugC

        categoria.save().then(() =>{
            req.flash('success_msg', 'sucesso ao editar categoria');
            res.redirect('/admin/categorias');
        }).catch((erro) =>{
            res.send(`Erro ao editar categoria! ${erro}`);
        });
    }).catch((err) =>{

    });
});

router.post('/categoria/deleted', (req, res) =>{
    categoria.deleteOne({_id: req.body.id}).then(() =>{
        req.flash('success_msg', 'Sucesso ao remover categoria ');
        res.redirect('/admin/categorias');
    });
});

// router.get('/postagens', (req, res) =>{
//     postagem.find().then((posts) =>{
//         res.render(`${__dirname}/../views/admin/postagens`, {posts: posts, title: 'Pagina principal de postagens'});
//     });
// });

router.get('/postagens', (req, res) =>{
    postagem.find().populate('categoria'/*Nome do campo definido no model*/).sort({data: 'desc'}).then((posts) =>{
        res.render(`${__dirname}/../views/admin/postagens`, {posts: posts, title: 'Home postagens '});
    });
});

router.get('/postagens/add', itAdmin, (req, res) =>{
    categoria.find().then((categoria) =>{
        res.render(`${__dirname}/../views/admin/addpostagem`, {categoria: categoria, title: 'Registro de categorias!'});
    });
});

router.post('/postagens/add/created', (req, res) =>{
    new postagem({
        Titulo: req.body.titulo,
        Slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }).save().then(() =>{
        res.redirect('/admin/postagens/');
    });
});

router.get('/postagens/editar/:id', (req, res) =>{
    postagem.findById({_id: req.params.id}).then((posts) =>{
        res.render(`${__dirname}/../views/admin/editPostagens`, {posts: posts, title: 'Editar postagens'});
    });
});

router.post('/postagens/edited', (req, res) =>{
    postagem.findById({_id: req.body.id}).then((postagem) =>{
        postagem.Titulo = req.body.titulo,
        postagem.Slug = req.body.slug,
        postagem.descricao = req.body.descricao,
        postagem.conteudo = req.body.conteudo,
        postagem.categoria = req.body.categoria

        postagem.save().then(() =>{
            res.redirect('/admin/postagens/');
        });
    });
});

router.get('/postagens/deleted/:id', (req, res) =>{
    postagem.deleteOne({_id: req.params.id}).then(() =>{
        res.redirect('/admin/postagens');
    })
});

module.exports = router;
