var express = require('express');
var router = express.Router();
var GioHang = require('../model/GioHang');
const JWT = require('jsonwebtoken');

/**
 * @swagger
 * /GioHang/GioHang_add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [GioHang]
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
 *     responses:
 *       201:
 *         description: Thêm giỏ hàng thành công.
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
 *         description: Lỗi khi thêm giỏ hàng.
 */
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

/**
 * @swagger
 * /GioHang/GioHang_update:
 *   put:
 *     summary: Cập nhật giỏ hàng (cần đăng nhập)
 *     tags: [GioHang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maSanPham:
 *                 type: string
 *                 description: ID sản phẩm mới.
 *               soLuong:
 *                 type: number
 *                 description: Số lượng mới.
 *     responses:
 *       200:
 *         description: Cập nhật giỏ hàng thành công.
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
 *       401:
 *         description: Chưa đăng nhập.
 *       403:
 *         description: Token không hợp lệ.
 */
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

/**
 * @swagger
 * /GioHang/GioHang_delete:
 *   delete:
 *     summary: Xóa giỏ hàng
 *     tags: [GioHang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID giỏ hàng cần xóa.
 *     responses:
 *       200:
 *         description: Xóa giỏ hàng thành công.
 *       400:
 *         description: Lỗi khi xóa.
 */
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

/**
 * @swagger
 * /GioHang/list_all:
 *   get:
 *     summary: Lấy danh sách tất cả giỏ hàng
 *     tags: [GioHang]
 *     responses:
 *       200:
 *         description: Danh sách giỏ hàng.
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
    const list = await GioHang.find().populate('maKhachHang').populate('maSanPham');
    res.status(200).json({ noidung: true, message: 'Lấy được tất cả giỏ hàng', data: list });
  } catch (error) {
    res.status(400).json({ noidung: false, message: 'Lỗi khi lấy danh sách', error });
  }
});

/**
 * @swagger
 * /GioHang/GioHang_by_khachhang:
 *   get:
 *     summary: Tìm giỏ hàng theo khách hàng
 *     tags: [GioHang]
 *     parameters:
 *       - in: query
 *         name: maKhachHang
 *         schema:
 *           type: string
 *         required: true
 *         description: ID khách hàng cần tìm giỏ hàng.
 *     responses:
 *       200:
 *         description: Danh sách giỏ hàng của khách hàng.
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
 *         description: Lỗi khi lấy giỏ hàng.
 */
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
