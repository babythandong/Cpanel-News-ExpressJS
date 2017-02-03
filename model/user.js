var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        index: true
    },
    password: String,
    company: String,
    address: String,
    date: String,
    img_name: String,
    job: String
});

var User = module.exports = mongoose.model('users', userSchema);
module.exports.createUser = function(newUser, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                newUser.save(callback);
            });
        });
    }
    /* COMPARE PASSWORD */
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err
        callback(null, isMatch);
    });
}

//Get User by email
module.exports.getuserByEmail = function(email, callback) {
    var query = { email: email };
    User.findOne(query, callback);
}

module.exports.getAllUser = function(callback) {
    User.find({}, {}, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}
module.exports.delById = function(id, callback) {
    var query = { _id: id };
    User.findOneAndRemove(query, callback);
}
module.exports.editById = function(id, newData, callback) {
    var query = { _id: id };
    User.findOneAndUpdate(query, newData, { upsert: true }, callback);
}