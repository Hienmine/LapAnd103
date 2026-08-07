var express = require('express');
var router = express.Router();
var GioHang = require('../model/GioHang');
const JWT = require('jsonwebtoken');

/* POST (add) */
router.post('/GioHang_add', async function (req, res) {
  const { maKhachHang, maSanPham, soLuong } = req.body;
  const newGioHang = { maKhachHang, maSanPham, soLuong };
  try {
    const result = await GioHang.create(newGioHang);
    res.status(201).json({ trangthai: true, message: 'Thêm giỏ hàng thành công', data: result });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi thêm giỏ hàng', error });
  }
});

/* PUT (update) */
router.put('/GioHang_update', async function (req, res) {
  const {  maSanPham, soLuong } = req.body;
  const token = req.header("Authorization").split(' ')[1];//tùy vào cách gửi token từ client
  if(token){
    JWT.verify(token, process.env.SECRETKEY, async function (err, id){
      if(err){
        res.status(403).json({"status": 403, "err": err});
      }else{
        const maKhachHang = id.id;
        try {
          const findGioHang = await GioHang.findOne({ maKhachHang: maKhachHang });
          if (findGioHang) {
            findGioHang.maSanPham = maSanPham;
            findGioHang.soLuong = soLuong;
            await findGioHang.save();
            res.status(200).json({ trangthai: true, message: 'Cập nhật giỏ hàng thành công', data: findGioHang });
          } else {
            return res.status(200).json({ trangthai: false, message: 'Giỏ hàng không tồn tại' });
          }
      } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi cập nhật giỏ hàng', error });
  }
      }
    });
  }else{
    res.status(401).json({"status": 401});
  }  
});

/* DELETE (delete) */
router.delete('/GioHang_delete', async function (req, res) {
  const id = req.body.id || req.body;
  try {
    await GioHang.findByIdAndDelete(id);
    res.status(200).json({ trangthai: true, message: 'Xóa giỏ hàng thành công' });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi xóa giỏ hàng', error });
  }
});

/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await GioHang.find().populate('maKhachHang').populate('maSanPham');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả giỏ hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/* GET (search by maKhachHang) */
router.get('/GioHang_by_khachhang', async function (req, res) {
  const { maKhachHang } = req.query;
  if (!maKhachHang) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số maKhachHang' });
  }
  try {
    const list = await GioHang.find({ maKhachHang: maKhachHang }).populate('maSanPham');
    if (!list || list.length === 0) {
      return res.status(200).json({
        noidung: false,
        message: 'Không tìm thấy sản phẩm nào trong giỏ hàng của khách này',
        data: []
      });
    }
    res.status(200).json({ noidung: true, message: 'Lấy được danh sách giỏ hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy giỏ hàng', error });
  }
});

module.exports = router;
