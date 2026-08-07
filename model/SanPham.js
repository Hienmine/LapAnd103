const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const SanPhamSchema = new Schema({
    id: ObjectId,
    tenSanPham: { type: String, required: true },
    giaBan: { type: Number, required: true },
    moTa: { type: String, required: true },
    Soluong: { type: Number, required: true },
    danhMucId: { type: ObjectId, ref: 'DanhMuc' },
    ngayTao: { type: Date, default: Date.now },
    trangThai: { type: Number, default: 1 },
});
module.exports = mongoose.models.SanPham || mongoose.model('SanPham', SanPhamSchema);