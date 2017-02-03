var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
    var user = req.session.user;
    res.render('layout', { 'title': 'Cpanel Admin', 'user': user });
    User.getAllUser(function(err, users) {
        if (err) {
            return err;
        } else {
            res.render('list_user', { 'title': 'Cpanel Express | List User', 'users': users });
            console.log('Session ' + req.session);

        }
    });
});
router.get('/register', function(req, res, next) {
    res.render('register', { 'title': 'Register member' });
});
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var date = new Date();
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email field is not valid').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password is not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', { 'errors': errors });
    } else {
        var user = new User({ name: name, email: email, password: password, date: date });
        User.createUser(user, function(err, user) {
            if (err) {
                return err;
            } else {
                console.log(user);
                res.location('/users/login');
                res.redirect('/users/login');
            }
        });
    }
});

router.get('/login', function(req, res, next) {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    res.render('login', { 'title': 'Login' });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/users/login');
});
router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    User.getuserByEmail(email, function(err, user) {
        if (err) {
            return err;
        } else {
            if (!user) {
                return res.status(404).send();
            } else {
                User.comparePassword(password, user.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {

                        req.session.user = user;
                        res.location('/dashboard');
                        res.redirect('/dashboard')
                        console.log('Session ' + req.session.user);
                    } else {

                    }
                });
            }
        }
    });
});

/*passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        User.getuserByEmail(username, function(err, user) {
            if (err) throw err;
            if (!user) return done(null, false, { message: "Unknows user" });
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);

                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function(req, res) {
        res.location('/');
        res.redirect('/dashboard');
    }
);
*/
/* MEMBER CPANEL DASHBOARD */
router.get('/add', function(req, res, next) {
    res.render('add_user', { 'title': 'Add User' });
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var company = req.body.company;
    var address = req.body.address;
    var job = req.body.job;

    var img = req.files;
    console.log(img);
    var img_name = img[0].filename;
    var date = new Date();
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email field is valid').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        res.render('add_user', { 'title': 'Add User' });
    } else {
        var newMember = new User({
            name: name,
            email: email,
            password: password,
            company: company,
            job: job,
            address: address,
            img_name: img_name,
            date: date
        });
        User.createUser(newMember, function(err, user) {
            if (err) {
                return err;
            } else {
                req.flash('success', 'Member is added');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

router.get('/del/:id', function(req, res, next) {
    var id = req.params.id;
    User.delById(id, function(err, user) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Member is removed');
            res.location('/');
            res.redirect('/');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    User.getUserById(id, function(err, post) {
        res.render('edit_user', { 'title': 'Edit Member', 'post': post });
    });
});

router.post('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var company = req.body.company;
    var address = req.body.address;
    var job = req.body.job;
    var img = req.files;
    var img_name = img[0].filename;
    var date = new Date();
    User.findOneAndUpdate(id, { name: name, email: email, company: company, address: address, job: job, img_name: img_name, date: date }, function(err, post) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Member is removed');
            res.location('/');
            res.redirect('/');
        }
    })
});


module.exports = router;