const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ChiTietDonHangSchema = new Schema({
    id: ObjectId,
    maDonHang: { type: ObjectId, ref: 'DonHang', required: true },
    maSanPham: { type: ObjectId, ref: 'SanPham', required: true }
});
module.exports = mongoose.models.ChiTietDonHang || mongoose.model('ChiTietDonHang', ChiTietDonHangSchema);