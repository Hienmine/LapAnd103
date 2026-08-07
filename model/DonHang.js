const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const DonHangSchema = new Schema({
    id: ObjectId,
    maKhachHang: { type: ObjectId, ref: 'User', required: true },
    maSanPham: { type: ObjectId, ref: 'SanPham', required: true },
    soLuong: { type: Number, required: true },
    tongTien: { type: Number, required: true }
});
module.exports = mongoose.models.DonHang || mongoose.model('DonHang', DonHangSchema);