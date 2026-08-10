var express = require('express');
var router = express.Router();
var DanhMuc = require('../model/DanhMuc');

/**
 * @swagger
 * /DanhMuc/DanhMuc_add:
 *   post:
 *     summary: Thêm danh mục mới
 *     tags: [DanhMuc]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenDanhMuc:
 *                 type: string
 *                 description: Tên danh mục.
 *               moTa:
 *                 type: string
 *                 description: Mô tả danh mục.
 *               parentId:
 *                 type: string
 *                 description: ID danh mục cha (để trống nếu là danh mục gốc).
 *     responses:
 *       201:
 *         description: Thêm danh mục thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trangthai:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Lỗi khi thêm danh mục.
 */
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

/**
 * @swagger
 * /DanhMuc/DanhMuc_update:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [DanhMuc]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID danh mục cần cập nhật.
 *               tenDanhMuc:
 *                 type: string
 *                 description: Tên danh mục mới.
 *               moTa:
 *                 type: string
 *                 description: Mô tả mới.
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trangthai:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Lỗi khi cập nhật.
 */
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

/**
 * @swagger
 * /DanhMuc/DanhMuc_delete:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [DanhMuc]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID danh mục cần xóa.
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công.
 *       400:
 *         description: Lỗi khi xóa.
 */
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

/**
 * @swagger
 * /DanhMuc/list_all:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [DanhMuc]
 *     responses:
 *       200:
 *         description: Danh sách danh mục.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noidung:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tenDanhMuc:
 *                         type: string
 *                       moTa:
 *                         type: string
 *                       parentId:
 *                         type: string
 *       400:
 *         description: Lỗi khi lấy danh sách.
 */
/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await DanhMuc.find();
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả danh mục', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/**
 * @swagger
 * /DanhMuc/DanhMuc_one:
 *   get:
 *     summary: Tìm danh mục theo tên
 *     tags: [DanhMuc]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên danh mục cần tìm.
 *     responses:
 *       200:
 *         description: Thông tin danh mục.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noidung:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Lỗi khi lấy danh mục.
 */
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
