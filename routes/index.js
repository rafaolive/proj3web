const express = require("express");
const router = express.Router();
//conferindo - parei aqui

const multer = require('multer');
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model('usuarios');
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../models/Postagem");
const Postagem = mongoose.model('postagens');
const {eAdmin} = require("../helpers/eAdmin");


router.get('/', (req, res) => {
    res.render('index')
});


router.get('/cadastro', (req, res) => {
    res.render('cadastro')
});

router.post('/cadastrar', async (req, res) => {
    let erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido!"})
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: "E-mail inválido!"})
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: "Senha inválida!"})
    } else if (req.body.senha.length < 4) {
        erros.push({texto: "Senha muito curta, mínimo 4 dígitos"})
    }
    if (!req.body.nascimento || typeof req.body.nascimento == undefined || req.body.nascimento == null) {
        erros.push({texto: "Ano de nascimento inválido!"})
    } else if (req.body.nascimento.length < 4) {
        erros.push({texto: "Ano de nascimento inválido! Digite 4 números"})
    }

    if (erros.length > 0) {
        res.send({erros: erros})
    } else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if (usuario) {
                //não está exibindo mensagem na tela, mas está fazendo essa parte
                erros.push({texto: "Já existe uma conta com este e-mail"});
                res.send({erros: erros})
            } else {
                const novoCadastro = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    nascimento: req.body.nascimento,
                    eAdmin: 1
                };
                /*criptografia hash na senha: */
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoCadastro.senha, salt, (erro, hash) => {
                        if (erro) {
                            erros.push({texto: "Erro ao salvar do usuário"});
                            res.send({erros: erros});
                        }
                        novoCadastro.senha = hash;
                        new Usuario(novoCadastro).save().then(() => {
                            erros.push({texto: "Usuário cadastrado com sucesso!"});
                            res.send({erros: erros});
                        }).catch((err) => {
                            erros.push({texto: "Erro ao salvar o usuário, tente novamente"});
                            res.send({erros: erros});
                        })
                    })
                }) /*fim do cadastro usando hash*/
                /*cadastro sem usar criptografia hash
                new Usuario(novoCadastro).save().then(() => {
                    req.flash("sucesso_msg", "Usuário cadastrado com sucesso")
                    console.log("Usuário cadastrado com sucesso!")
                    res.redirect("login")                
                }).catch((err) => {
                    req.flash("erro_msg", "Erro ao salvar o usuário, tente novamente")
                    res.redirect("cadastro")
                }) 
                */
            }
        }).catch((err) => {
            erros.push({texto: "Houve um erro interno"});
            res.send({erros: erros});
        })
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "login",
        failureFlash: true
    })(req, res, next);
});


router.get('/posts', (req, res) => {
    Postagem.find().then((postagens) => {
        res.render('home', {postagens: postagens})
    }).catch((err) => {
        console.log("Erro ao listar publicações!");
        req.flash("erro_msg", "Erro ao listar publicações");
        res.redirect('index')
    })
});

router.get('/admpost', eAdmin, (req, res) => {
    Postagem.find().then((postagens) => {
        res.render('admpost', {postagens: postagens})
    }).catch((err) => {
        console.log("Erro ao listar publicações!");
        req.flash("erro_msg", "Erro ao listar publicações");
        res.redirect('index')
    })
});

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

router.post('/postar', eAdmin, (req, res) => {
    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Apenas imagens são permitidas!'), null);
            }
            const nomearquivo = file.originalname;
            callback(null, true);
        }
    }).single('imagem');

    upload(req, res, function (err) {
        const novaPostagem = {
            texto: req.body.texto.trim(),
            imagem: req.file
        };
        new Postagem(novaPostagem).save().then(function () {
            res.redirect('admpost');
            console.log("Publicação realizada com sucesso")
        }).catch((err) => {
            console.log("Erro ao publicar")
        })
    })
});

router.post('/pesquisa', async (req, res) => {
    let query = req.body.pesq;

    if (query === "") {
        Postagem.find().then((postagens) => {
            res.send(postagens);
        }).catch((err) => {
            const msg = "Não foram encontrados resultados para a pesquisa";
            res.send({msg});
        });
    } else {
        Postagem.find({texto: new RegExp(query, 'i')}).then((postagens) => {
            res.send(postagens);
        }).catch((err) => {
            const msg = "Não foram encontrados resultados para a pesquisa";
            res.send({msg});
        });
    }
});


router.get("/logout", (req, res) => {
    req.logOut();
    req.flash('sucesso_msg', "Deslogado com sucesso!");
    res.redirect("/")
});


module.exports = router;
