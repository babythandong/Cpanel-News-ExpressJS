var express = require('express');
var router = express.Router();
var session = require('express-session');
router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/users/login');
    } else {

        res.render('dashboard', { 'title': 'Cpanel Admin' });
        var user = req.session.user;
        res.render('layout', { 'title': 'Cpanel Admin', 'user': user });
    }
});
module.exports = router;