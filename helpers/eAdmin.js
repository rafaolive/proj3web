module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){ //permite que só usuários autenticados que são administradores entrem
            return next();
        }
        req.flash("erro_msg", "Você precisa ser um Admin")
        res.redirect("/")
    }

}