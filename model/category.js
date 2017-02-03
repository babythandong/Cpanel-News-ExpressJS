var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var catalogSchema = new Schema({
    name: String,
    description: String,
    date: String,
    count_post: String,
    slug: String,
    author: String
});


var Catalog = module.exports = mongoose.model('catalog', catalogSchema);

module.exports.createCatalog = function(newUser, callback) {
    newUser.save(callback);
}

module.exports.getAllCatalog = function(callback) {
    Catalog.find({}, {}, callback);
}

module.exports.getCatalogById = function(id, callback) {
    Catalog.findById(id, callback);
}

module.exports.editCatagoryById = function(id, newData, callback) {
    var query = { _id: id };
    Catalog.findOneAndUpdate(query, newData, callback);
}

module.exports.delCatalogById = function(id, callback) {
    var query = { _id: id };
    Catalog.findOneAndRemove(query, callback);
}

module.exports.updateBySLug = function(slug, newData, callback) {
    var query = { slug: slug };
    Catalog.findOneAndUpdate(query, newData, { upsert: true }, callback);
}
module.exports.convert_slug = function(str) {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
}