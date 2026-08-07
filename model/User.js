const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const UserSchema = new Schema({
    id: { type: ObjectId },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    Sdt: { type: String, required: true },
    GioiTinh: { type: String, required: true },
    NgaySinh: { type: Date},   
    DiaChi: { type: String},
});
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);