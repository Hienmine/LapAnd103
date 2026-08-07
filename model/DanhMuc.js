const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const DanhMucSchema = new Schema({
    id: ObjectId,
    tenDanhMuc: { type: String, required: true },
    moTa: { type: String, required: true },
    // parentId: { type: ObjectId, ref: 'DanhMucCha' },
    parentId: { type: ObjectId, ref: 'DanhMuc', default: null }, //nếu parentId có giá trị thì đây là danh mục con, nếu không có giá trị thì đây là danh mục cha
});
module.exports = mongoose.models.DanhMuc || mongoose.model('DanhMuc', DanhMucSchema);