"use strict";

module.exports = {
    itAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.itsAdmin == 1){
            return next();
        }

        else{
            req.flash('error_msg', 'Voce precisa ser um admin... ');
            res.redirect('/');
        };
    }
};