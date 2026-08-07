const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ReviewSchema = new Schema({
    id: ObjectId,
    maKhachHang: { type: ObjectId, ref: 'User', required: true },
    maSanPham: { type: ObjectId, ref: 'SanPham', required: true },
    BinhLuan: { type: String, required: true },
    SoSao: { type: Number, required: true }
});
module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);