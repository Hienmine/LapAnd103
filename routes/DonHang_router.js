var express = require('express');
var router = express.Router();
var DonHang = require('../model/DonHang');

/**
 * @swagger
 * /DonHang/DonHang_add:
 *   post:
 *     summary: Thêm đơn hàng mới
 *     tags: [DonHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maKhachHang:
 *                 type: string
 *                 description: ID khách hàng.
 *               maSanPham:
 *                 type: string
 *                 description: ID sản phẩm.
 *               soLuong:
 *                 type: number
 *                 description: Số lượng sản phẩm.
 *               tongTien:
 *                 type: number
 *                 description: Tổng tiền đơn hàng.
 *     responses:
 *       201:
 *         description: Thêm đơn hàng thành công.
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
 *         description: Lỗi khi thêm đơn hàng.
 */
/* POST (add) */
router.post('/DonHang_add', async function (req, res) {
  const { maKhachHang, maSanPham, soLuong, tongTien } = req.body;
  const newDonHang = { maKhachHang, maSanPham, soLuong, tongTien };
  try {
    const result = await DonHang.create(newDonHang);
    res.status(201).json({ trangthai: true, message: 'Thêm đơn hàng thành công', data: result });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi thêm đơn hàng', error });
  }
});

/**
 * @swagger
 * /DonHang/DonHang_update:
 *   put:
 *     summary: Cập nhật đơn hàng
 *     tags: [DonHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID đơn hàng cần cập nhật.
 *               maKhachHang:
 *                 type: string
 *                 description: ID khách hàng mới.
 *               soLuong:
 *                 type: number
 *                 description: Số lượng mới.
 *               giaBan:
 *                 type: number
 *                 description: Giá bán mới.
 *     responses:
 *       200:
 *         description: Cập nhật đơn hàng thành công.
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
router.put('/DonHang_update', async function (req, res) {
  const { id, maKhachHang, soLuong, giaBan } = req.body;
  try {
    const findDonHang = await DonHang.findById(id);
    if (findDonHang) {
      findDonHang.maKhachHang = maKhachHang;
      findDonHang.soLuong = soLuong;
      findDonHang.giaBan = giaBan;
      await findDonHang.save();
      res.status(200).json({ trangthai: true, message: 'Cập nhật đơn hàng thành công', data: findDonHang });
    } else {
      return res.status(200).json({ trangthai: false, message: 'Đơn hàng không tồn tại' });
    }
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi cập nhật đơn hàng', error });
  }
});

/**
 * @swagger
 * /DonHang/DonHang_delete:
 *   delete:
 *     summary: Xóa đơn hàng
 *     tags: [DonHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID đơn hàng cần xóa.
 *     responses:
 *       200:
 *         description: Xóa đơn hàng thành công.
 *       400:
 *         description: Lỗi khi xóa.
 */
/* DELETE (delete) */
router.delete('/DonHang_delete', async function (req, res) {
  const id = req.body.id || req.body;
  try {
    await DonHang.findByIdAndDelete(id);
    res.status(200).json({ trangthai: true, message: 'Xóa đơn hàng thành công' });
  } catch (error) {
    res.status(400).json({ trangthai: false, message: 'Lỗi khi xóa đơn hàng', error });
  }
});

/**
 * @swagger
 * /DonHang/list_all:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [DonHang]
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng.
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
    const list = await DonHang.find().populate('maKhachHang');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả đơn hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/**
 * @swagger
 * /DonHang/DonHang_by_khachhang:
 *   get:
 *     summary: Tìm đơn hàng theo khách hàng
 *     tags: [DonHang]
 *     parameters:
 *       - in: query
 *         name: maKhachHang
 *         schema:
 *           type: string
 *         required: true
 *         description: ID khách hàng cần tìm đơn hàng.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của khách hàng.
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
 *         description: Lỗi khi lấy đơn hàng.
 */
/* GET (search by maKhachHang) */
router.get('/DonHang_by_khachhang', async function (req, res) {
  const { maKhachHang } = req.query;
  if (!maKhachHang) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số maKhachHang' });
  }
  try {
    const list = await DonHang.find({ maKhachHang: maKhachHang });
    if (!list || list.length === 0) {
      return res.status(200).json({
        noidung: false,
        message: 'Không tìm thấy đơn hàng nào cho khách hàng này',
        data: []
      });
    }
    res.status(200).json({ noidung: true, message: 'Lấy được danh sách đơn hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy đơn hàng', error });
  }
});

module.exports = router;
