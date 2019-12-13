// Carregando modulos
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
//conferindo - parei aqui
const index = require("./routes/index");
const passport = require('passport');
require("./config/aut")(passport);
multer = require('multer');
const session = require("express-session");
const flash = require("connect-flash");
const db = require("./config/db");

// Configurações
//conf sessao
app.use(session({
    secret: "projeto",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//conf middleware
app.use((req, res, next) => {
    res.locals.sucesso_msg = req.flash("sucesso_msg");
    res.locals.erro_msg = req.flash("erro_msg");
    res.locals.error = req.flash("erro");
    res.locals.user = req.user || null;
    next()
})
//config Handlebars - Template Engine
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//config Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//config Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI).then(() => {
    console.log("MongoDB conectado - projetoweb2 criado")
}).catch((err) => {
    console.log("Erro ao conectar ao MongoDB: " + err)
})
//config Public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: false}));

//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
// Rotas
app.use('/', index);
// Outros
// definição da porta do servidor deve estar por último 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
});