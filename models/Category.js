const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true}).then(() =>{
    console.log('Acesso ao banco de dados concedido! ');
}).catch((err) =>{
    console.error(`Erro ao se conectar a base de dados! ${err}`);
});

const Categoria = mongoose.Schema({
    nome:{
        type: String,
        required: true
    },

    slug:{
        type: String,
        required: true
    },

    data: {
        type: Date,
        default: Date.now()
    }
});
mongoose.model('categorias', Categoria);
const categorias = mongoose.model('categorias');

module.exports = categorias;
