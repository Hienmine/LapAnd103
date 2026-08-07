const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const GioHangSchema = new Schema({
    id: ObjectId,
    maKhachHang: { type: ObjectId, ref: 'User', required: true },
    maSanPham: { type: ObjectId, ref: 'SanPham', required: true },
    soLuong: { type: Number, required: true,min: 1 },
});
module.exports = mongoose.models.GioHang || mongoose.model('GioHang', GioHangSchema);