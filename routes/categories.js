var express = require('express');
var router = express.Router();
var Catalog = require('../model/category');
var Post = require('../model/post');
router.get('/add', function(req, res, next) {
    res.render('add_category', { 'title': 'Add Category' });
});

router.get('/', function(req, res, next) {
    Catalog.getAllCatalog(function(err, catagories) {
        if (err) {
            return err;
        } else {
            res.render('list_category', { 'title': 'List Category', 'catagories': catagories });
        }
    });

});

router.get('/add', function(req, res, next) {
    res.render('add_category', { 'title': 'Add Category' });
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var author = req.body.author;
    var slug = Catalog.convert_slug(name);
    var description = req.body.description;
    var date = new Date();

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('author', 'Author field is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('add_category', { 'errors': errors });
    } else {
        var catalog = new Catalog({ name: name, author: author, description: description, date: date, slug: slug, count_post: 0 });
        Catalog.createCatalog(catalog, function(err, catalog) {
            if (err) {
                return err;
            } else {
                req.flash('success', 'Catalog is created');
                res.location('/categories');
                res.redirect('/categories');
            }
        });
    }
});

router.get('/view/:id', function(req, res, next) {
    var id = req.params.id;
    Catalog.getCatalogById(id, function(err, category) {
        if (err) {
            return err;
        } else {
            res.render('view_category', { 'title': 'View Category', 'category': category });
        }
    });
});



router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    Catalog.getCatalogById(id, function(err, category) {
        if (err) {
            return err;
        } else {
            res.render('edit_category', { 'title': 'Edit Category', 'category': category });
        }
    });
});

router.post('/edit/:id', function(req, res, next) {
    var name = req.body.name;
    var author = req.body.author;
    var description = req.body.description;
    var date = new Date();
    var id = req.params.id;
    Catalog.editCatagoryById(id, { name: name, author: author, description: description, date: date }, function(err, catalog) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Update category success');
            res.location('/categories');
            res.redirect('/categories');
        }
    });
})

router.get('/del/:id', function(req, res, next) {
    var id = req.params.id;
    Catalog.delCatalogById(id, function(err, catalog) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Delete category success');
            res.location('/categories');
            res.redirect('/categories');
        }
    });
});
module.exports = router;