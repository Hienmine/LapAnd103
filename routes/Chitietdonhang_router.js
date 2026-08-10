var express = require('express');
var router = express.Router();
var ChiTietDonHang = require('../model/ChiTietDonHang');

/**
 * @swagger
 * /ChiTietDonHang/ChiTietDonHang_add:
 *   post:
 *     summary: Thêm chi tiết đơn hàng
 *     tags: [ChiTietDonHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maDonHang:
 *                 type: string
 *                 description: ID đơn hàng.
 *               maSanPham:
 *                 type: string
 *                 description: ID sản phẩm.
 *     responses:
 *       201:
 *         description: Thêm chi tiết đơn hàng thành công.
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
 *         description: Lỗi khi thêm chi tiết đơn hàng.
 */
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

/**
 * @swagger
 * /ChiTietDonHang/ChiTietDonHang_update:
 *   put:
 *     summary: Cập nhật chi tiết đơn hàng
 *     tags: [ChiTietDonHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID chi tiết đơn hàng cần cập nhật.
 *               maDonHang:
 *                 type: string
 *                 description: ID đơn hàng mới.
 *               maSanPham:
 *                 type: string
 *                 description: ID sản phẩm mới.
 *     responses:
 *       200:
 *         description: Cập nhật chi tiết đơn hàng thành công.
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

/**
 * @swagger
 * /ChiTietDonHang/ChiTietDonHang_delete:
 *   delete:
 *     summary: Xóa chi tiết đơn hàng
 *     tags: [ChiTietDonHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID chi tiết đơn hàng cần xóa.
 *     responses:
 *       200:
 *         description: Xóa chi tiết đơn hàng thành công.
 *       400:
 *         description: Lỗi khi xóa.
 */
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

/**
 * @swagger
 * /ChiTietDonHang/list_all:
 *   get:
 *     summary: Lấy danh sách tất cả chi tiết đơn hàng
 *     tags: [ChiTietDonHang]
 *     responses:
 *       200:
 *         description: Danh sách chi tiết đơn hàng.
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
    const list = await ChiTietDonHang.find().populate('maDonHang').populate('maSanPham');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả chi tiết đơn hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/**
 * @swagger
 * /ChiTietDonHang/ChiTietDonHang_by_donhang:
 *   get:
 *     summary: Tìm chi tiết đơn hàng theo mã đơn hàng
 *     tags: [ChiTietDonHang]
 *     parameters:
 *       - in: query
 *         name: maDonHang
 *         schema:
 *           type: string
 *         required: true
 *         description: ID đơn hàng cần tìm.
 *     responses:
 *       200:
 *         description: Danh sách chi tiết đơn hàng.
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
 *         description: Lỗi khi lấy chi tiết đơn hàng.
 */
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
