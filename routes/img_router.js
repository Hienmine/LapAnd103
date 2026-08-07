var express = require('express');
var router = express.Router();
var Img = require('../model/Img');

/* POST (add) */
router.post('/Img_add', async function (req, res) {
  const { url, sanPhamId } = req.body;
  const newImg = { url, sanPhamId };
  try {
    const result = await Img.create(newImg);
    res.status(201).json({ trangthai: true, message: 'Thêm ảnh thành công', data: result });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi thêm ảnh', error });
  }
});

/* PUT (update) */
router.put('/Img_update', async function (req, res) {
  const { id, url, sanPhamId } = req.body;
  try {
    const findImg = await Img.findById(id);
    if (findImg) {
      findImg.url = url;
      findImg.sanPhamId = sanPhamId;
      await findImg.save();
      res.status(200).json({ trangthai: true, message: 'Cập nhật ảnh thành công', data: findImg });
    } else {
      return res.status(200).json({ trangthai: false, message: 'Ảnh không tồn tại' });
    }
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi cập nhật ảnh', error });
  }
});

/* DELETE (delete) */
router.delete('/Img_delete', async function (req, res) {
  const id = req.body.id || req.body;
  try {
    await Img.findByIdAndDelete(id);
    res.status(200).json({ trangthai: true, message: 'Xóa ảnh thành công' });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi xóa ảnh', error });
  }
});

/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await Img.find().populate('sanPhamId');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả ảnh', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/* GET (search by sanPhamId) */
router.get('/Img_by_sanpham', async function (req, res) {
  const { sanPhamId } = req.query;
  if (!sanPhamId) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số sanPhamId' });
  }
  try {
    const list = await Img.find({ sanPhamId: sanPhamId });
    if (!list || list.length === 0) {
      return res.status(200).json({
        noidung: false,
        message: 'Không tìm thấy ảnh nào cho sản phẩm này',
        data: []
      });
    }
    res.status(200).json({ noidung: true, message: 'Lấy được danh sách ảnh', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy ảnh', error });
  }
});

module.exports = router;
