var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
    title: {
        type: String,
        index: true
    },
    intro: String,
    content: String,
    author: String,
    category: String,
    date: String,
    img_name: String
});

var Posts = module.exports = mongoose.model('post', postSchema);
module.exports.createPost = function(newPost, callback) {
    newPost.save(callback);
}
module.exports.getAllPost = function(callback) {
    Posts.find({}, {}, callback);
}
module.exports.getPosttOfCategory = function(category, callback) {
    var query = { category: category };
    Posts.find(query, {}, callback);
}
module.exports.getCount = function(arr) {
    var count = arr.length;
    return count;
}