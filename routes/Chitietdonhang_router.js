var express = require('express');
var router = express.Router();
var ChiTietDonHang = require('../model/ChiTietDonHang');

/* POST (add) */
router.post('/ChiTietDonHang_add', async function (req, res) {
  const { maDonHang, maSanPham } = req.body;
  const newChiTiet = { maDonHang, maSanPham };
  try {
    const result = await ChiTietDonHang.create(newChiTiet);
    res.status(201).json({ trangthai: true, message: 'Thêm chi tiết đơn hàng thành công', data: result });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi thêm chi tiết đơn hàng', error });
  }
});

/* PUT (update) */
router.put('/ChiTietDonHang_update', async function (req, res) {
  const { id, maDonHang, maSanPham } = req.body;
  try {
    const findChiTiet = await ChiTietDonHang.findById(id);
    if (findChiTiet) {
      findChiTiet.maDonHang = maDonHang;
      findChiTiet.maSanPham = maSanPham;
      await findChiTiet.save();
      res.status(200).json({ trangthai: true, message: 'Cập nhật chi tiết đơn hàng thành công', data: findChiTiet });
    } else {
      return res.status(200).json({ trangthai: false, message: 'Chi tiết đơn hàng không tồn tại' });
    }
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi cập nhật chi tiết đơn hàng', error });
  }
});

/* DELETE (delete) */
router.delete('/ChiTietDonHang_delete', async function (req, res) {
  const id = req.body.id || req.body;
  try {
    await ChiTietDonHang.findByIdAndDelete(id);
    res.status(200).json({ trangthai: true, message: 'Xóa chi tiết đơn hàng thành công' });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi xóa chi tiết đơn hàng', error });
  }
});

/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await ChiTietDonHang.find().populate('maDonHang').populate('maSanPham');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả chi tiết đơn hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/* GET (search by maDonHang) */
router.get('/ChiTietDonHang_by_donhang', async function (req, res) {
  const { maDonHang } = req.query;
  if (!maDonHang) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số maDonHang' });
  }
  try {
    const list = await ChiTietDonHang.find({ maDonHang: maDonHang }).populate('maSanPham');
    if (!list || list.length === 0) {
      return res.status(200).json({
        noidung: false,
        message: 'Không tìm thấy chi tiết nào cho đơn hàng này',
        data: []
      });
    }
    res.status(200).json({ noidung: true, message: 'Lấy được danh sách chi tiết đơn hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy chi tiết đơn hàng', error });
  }
});

module.exports = router;
