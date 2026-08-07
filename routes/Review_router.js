var express = require('express');
var router = express.Router();
var Review = require('../model/Review');

/* POST (add review) */
router.post('/Review-add', async function (req, res) {
  const { maKhachHang, maSanPham, BinhLuan, SoSao } = req.body;
  const newReview = { maKhachHang, maSanPham, BinhLuan, SoSao };
  try {
    const result = await Review.create(newReview);
    res.status(201).json({ trangthai: true, message: 'Thêm đánh giá mới thành công', data: result });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi thêm đánh giá', error });
  }
});

/* PUT (update review) */
router.put('/Review_update', async function (req, res) {
  const { id, maKhachHang, maSanPham, BinhLuan, SoSao } = req.body;
  try {
    const findReview = await Review.findById(id); // tìm kiếm đánh giá theo id
    if (findReview) {
      findReview.maKhachHang = maKhachHang;
      findReview.maSanPham = maSanPham;
      findReview.BinhLuan = BinhLuan;
      findReview.SoSao = SoSao;
      await findReview.save();
      res.status(200).json({ trangthai: true, message: 'Cập nhật đánh giá thành công', data: findReview });
    } else {
      return res.status(200).json({ trangthai: false, message: 'Đánh giá không tồn tại' });
    }
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi cập nhật đánh giá', error });
  }
});

/* DELETE (delete review) */
router.delete('/Review_delete', async function (req, res) {
  const reviewId = req.body.id || req.body;
  try {
    await Review.findByIdAndDelete(reviewId); // tìm kiếm và xóa đánh giá
    res.status(200).json({ trangthai: true, message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi xóa đánh giá', error });
  }
});

/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await Review.find().populate('maKhachHang').populate('maSanPham');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả đánh giá', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/* GET (search by maSanPham) */
// query trả về giá trị http://localhost:3000/Review/Review_by_product?maSanPham=...
router.get('/Review_by_product', async function (req, res) {
  const { maSanPham } = req.query;
  if (!maSanPham) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số maSanPham' });
  }
  try {
    const list = await Review.find({ maSanPham: maSanPham }).populate('maKhachHang');
    if (!list || list.length === 0) {
      return res.status(200).json({
        noidung: false,
        message: 'Không tìm thấy đánh giá nào cho sản phẩm này',
        data: []
      });
    }
    res.status(200).json({ noidung: true, message: 'Lấy được danh sách đánh giá', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy đánh giá', error });
  }
});

module.exports = router;
