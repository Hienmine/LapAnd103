const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ImgSchema = new Schema({
    id: ObjectId,
    url: { type: String, required: true },
    sanPhamId: { type: ObjectId, ref: 'SanPham', required: true },
});
module.exports = mongoose.models.Img || mongoose.model('Img', ImgSchema);