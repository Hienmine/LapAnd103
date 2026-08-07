var express = require('express');
var router = express.Router();
var DanhMuc = require('../model/DanhMuc');

/* POST (add) */
router.post('/DanhMuc_add', async function (req, res) {
  const { tenDanhMuc, moTa } = req.body;
  const newDanhMuc = { tenDanhMuc, moTa, parentId: req.body.parentId || null }; //nếu parentId có giá trị thì đây là danh mục con, nếu không có giá trị thì đây là danh mục cha
  try {
    const result = await DanhMuc.create(newDanhMuc);
    res.status(201).json({ trangthai: true, message: 'Thêm danh mục thành công', data: result });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi thêm danh mục', error });
  }
});

/* PUT (update) */
router.put('/DanhMuc_update', async function (req, res) {
  const { id, tenDanhMuc, moTa } = req.body;
  try {
    const findDanhMuc = await DanhMuc.findById(id);
    if (findDanhMuc) {
      findDanhMuc.tenDanhMuc = tenDanhMuc;
      findDanhMuc.moTa = moTa;
      await findDanhMuc.save();
      res.status(200).json({ trangthai: true, message: 'Cập nhật danh mục thành công', data: findDanhMuc });
    } else {
      return res.status(200).json({ trangthai: false, message: 'Danh mục không tồn tại' });
    }
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi cập nhật danh mục', error });
  }
});

/* DELETE (delete) */
router.delete('/DanhMuc_delete', async function (req, res) {
  const id = req.body.id || req.body;
  try {
    await DanhMuc.findByIdAndDelete(id);
    res.status(200).json({ trangthai: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi xóa danh mục', error });
  }
});

/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await DanhMuc.find();
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả danh mục', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/* GET (search by tenDanhMuc) */
router.get('/DanhMuc_one', async function (req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số name' });
  }
  try {
    const list = await DanhMuc.find({ tenDanhMuc: name });
    if (!list || list.length === 0) {
      return res.status(200).json({
        noidung: false,
        message: 'Không tìm thấy danh mục này',
        data: []
      });
    }
    res.status(200).json({ noidung: true, message: 'Lấy được thông tin danh mục', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh mục', error });
  }
});

module.exports = router;
