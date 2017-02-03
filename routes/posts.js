var express = require('express');
var router = express.Router();
var Catalog = require('../model/category');
var Post = require('../model/post');
router.get('/add', function(req, res, next) {
    Catalog.getAllCatalog(function(req, catagories) {
        res.render('add_post', { 'title': 'Add post', 'catagories': catagories });
    });

});
router.post('/add', function(req, res, next) {
    var title = req.body.title;
    var category = req.body.category;
    var intro = req.body.intro;
    var content = req.body.content;
    var author = req.body.author;
    var img = req.files;
    if (img) {
        var img_name = img[0].filename;
    } else {
        var img_name = "b0d1355bd467008238317b56b5e17dd6";
    }
    var date = new Date();
    var newPost = Post({
        title: title,
        category: category,
        intro: intro,
        content: content,
        author: author,
        date: date,
        img_name: img_name
    });
    Post.createPost(newPost, function(err, post) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Post is created');
            res.location('/posts');
            res.redirect('/posts');
        }
    });
});
router.get('/', function(req, res, next) {
    Post.getAllPost(function(err, posts) {
        res.render('list_post', { 'title': 'List post', 'posts': posts });
    });
});

router.get('/view/:slug', function(req, res, next) {
    var slug = req.params.slug;
    Post.getPosttOfCategory(slug, function(err, posts) {
        if (err) {
            return err;
        } else {
            var count = Post.getCount(posts);
            var newData = { count_post: count };
            Catalog.updateBySLug(slug, newData, function(err, count) {
                res.render('detail_category', { 'title': 'List Post Of Article', 'posts': posts, 'count': count });
            });

        }
    });
});
module.exports = router;