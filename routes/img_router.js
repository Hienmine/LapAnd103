var express = require('express');
var router = express.Router();
var Img = require('../model/Img');

/**
 * @swagger
 * /Img/Img_add:
 *   post:
 *     summary: Thêm ảnh sản phẩm
 *     tags: [Img]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL ảnh sản phẩm.
 *               sanPhamId:
 *                 type: string
 *                 description: ID sản phẩm.
 *     responses:
 *       201:
 *         description: Thêm ảnh thành công.
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
 *         description: Lỗi khi thêm ảnh.
 */
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

/**
 * @swagger
 * /Img/Img_update:
 *   put:
 *     summary: Cập nhật ảnh
 *     tags: [Img]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID ảnh cần cập nhật.
 *               url:
 *                 type: string
 *                 description: URL ảnh mới.
 *               sanPhamId:
 *                 type: string
 *                 description: ID sản phẩm mới.
 *     responses:
 *       200:
 *         description: Cập nhật ảnh thành công.
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

/**
 * @swagger
 * /Img/Img_delete:
 *   delete:
 *     summary: Xóa ảnh
 *     tags: [Img]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID ảnh cần xóa.
 *     responses:
 *       200:
 *         description: Xóa ảnh thành công.
 *       400:
 *         description: Lỗi khi xóa.
 */
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

/**
 * @swagger
 * /Img/list_all:
 *   get:
 *     summary: Lấy danh sách tất cả ảnh
 *     tags: [Img]
 *     responses:
 *       200:
 *         description: Danh sách ảnh.
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
 *         description: Lỗi khi lấy danh sách.
 */
/* GET list_all */
router.get('/list_all', async function (req, res) {
  try {
    const list = await Img.find().populate('sanPhamId');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả ảnh', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/**
 * @swagger
 * /Img/Img_by_sanpham:
 *   get:
 *     summary: Tìm ảnh theo sản phẩm
 *     tags: [Img]
 *     parameters:
 *       - in: query
 *         name: sanPhamId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID sản phẩm cần tìm ảnh.
 *     responses:
 *       200:
 *         description: Danh sách ảnh của sản phẩm.
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
 *         description: Lỗi khi lấy ảnh.
 */
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
