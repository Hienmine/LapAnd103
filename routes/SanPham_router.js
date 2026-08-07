var express = require('express');
var router = express.Router();
var SanPham = require('../model/SanPham');
var DanhMuc = require('../model/DanhMuc');
var Img = require('../model/Img');
var Review = require('../model/Review');
var GioHang = require('../model/GioHang');
var DonHang = require('../model/DonHang');
const upload = require('../config/upload');
/* post san pham */
/* link api:http://localhost:3000/SanPham/SanPham-add */
router.post('/SanPham-add', async function (req, res) {
  const { tenSanPham, giaBan, moTa, Soluong, danhMucId } = req.body;
  const newSanPham = { tenSanPham, giaBan, moTa, Soluong, danhMucId };
  await SanPham.create(newSanPham);
  res.status(201).json({ trangthai: true, message: 'thêm sản phẩm mới thành công' });
});
router.put('/Sanpham_update', async function (req, res) {
  const id = req.body;
  const findUser = await SanPham.findById(id); //tìm kiếm người dùng theo id
  if (findUser) {
    await findUser.save();
    res.status(200).json({ trangthai: true, message: 'Cập nhật người dùng thành công' }); //nếu findUser tồn tại thì cập nhật thông tin người dùng và trả về thông báo thành công
  } else {
    return res.status(200).json({ trangthai: false, message: 'Người dùng không tồn tại' }); //nếu findUser null trả về thông báo người dùng không tồn tại
  }

});
/* Delete (delete sanpham) */
router.delete('/sanpham_delete', async function (req, res) {
  const Id = req.body;
  await SanPham.findByIdAndDelete(Id); //tìm kiếm người dùng theo id và xóa người dùng đó
  res.status(200).json({ trangthai: true, message: 'xóa người dùng thành công' });
});

/*search */
router.get('/list_all', async function (req, res) {
  const list = await SanPham.find();
  res.status(200).json({ noidung: true, message: 'lấy được tất cả người dùng', data: list });
})

//query trả về giá trị http://localhost:3000/user/user_one/name(key)?name=Lê Văn A(value)
router.get('/sanpham_one', async function (req, res) {
  const { name } = req.query
  if (!name) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số name' });
  }
  const list = await SanPham.find({ tenSanPham: name });
  if (!list) {
    return res.status(200).json({
      noidung: false,
      message: 'Không tìm thấy người dùng này',
      data: []
    });
  }
  res.status(200).json({ noidung: true, message: 'lấy được thông tin người dùng', data: list });
})


// router.post('/addImg', upload.array('image', 5), async (req, res) => {
//   // upload.array('image',5) => up nhiều file tối đa là 5 (chú ý chữ 'u' thường)
//   try {
//     const data = req.body;
//     const { files } = req;

//     // Nếu không có file nào được upload
//     if (!files || files.length === 0) {
//       return res.status(400).json({ status: 400, message: "Không tìm thấy file ảnh nào" });
//     }

//     const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

//     const newfruit = new Fruits({
//       name: data.name,
//       quantity: data.quantity,
//       price: data.price,
//       status: data.status,
//       image: urlsImage,
//       description: data.description,
//     });

//     const result = await newfruit.save();

//     if (result) {
//       res.json({
//         "status": 200,
//         "messenger": "Thêm thành công",
//         "data": result
//       });
//     } else {
//       res.json({
//         "status": 400,
//         "messenger": "Lỗi, thêm không thành công",
//         "data": []
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: 500, message: "Lỗi server" });
//   }
// });

/* single upload */
router.post('/addImg', [upload.single('img')], async (req, res,next) => {
  try {
    const {file} = req;
    if (!file) {
      return res.json({ status: 0, link : "" }); 
    } else {
    const url = `http://localhost:3000/images/${file.filename}`;
    return res.json({ status: 1, url : url });
    }
  } catch (error) {
    console.log('Upload image error: ', error);
    return res.json({status: 0, link : "" });
  }
  });
  
/* multi upload */
router.post('/addImgs', [upload.array('img', 9)], async (req, res,next) => {
  try {
    const { files } = req;
    if (!files) {
      return res.json({ status: 0, links : [] });
    } else {
      const url=[];
      for(const singleFile of files){
        url.push(`http://localhost:3000/images/${singleFile.filename}`);
      }
      return res.json({ status: 1, links : url });
    }
  } catch (error) {
    console.log('Upload images error: ', error);
    return res.json({status: 0, links : [] });
  }
  });

// - Lấy ra toàn bộ danh sách sản phẩm có giá bán từ 20000
// - Lấy ra toàn bộ danh sách sản phẩm có giá bán nhỏ hơn 5000
// - Lấy ra toàn bộ danh sách sản phẩm có số lượng từ 5 đến 10
// - Lấy ra toàn bộ danh sách sản phẩm có số lượng 10 hoặc có giá bán trên 50000
// - Lấy ra toàn bộ danh sách sản phẩm có tên chứa chữ "bánh" (không phân biệt chữ hoa chữ thường)
// - Lấy ra toàn bộ danh sách sản phẩm có chứa từ "Choco" và có số lượng từ 10 trở lên nhưng giá bán không quá 30000
// API Lọc sản phẩm theo tồn kho hoặc giá: Lấy danh sách sản phẩm có so_luong_ton_kho > 3 hoặc gia_ban < 100000.
// API Lọc sản phẩm theo khoảng giá: Lấy sản phẩm có gia_ban >= 50000 và gia_ban <= 500000.
// API Thống kê sản phẩm tồn kho thấp: Lấy sản phẩm có so_luong_ton_kho <= 5.
// API Lọc danh mục con: Lấy danh sách danh mục có ma_danh_muc_cha khác null hoặc khớp với mã cha chỉ định.
// API Lọc hình ảnh sản phẩm: Lấy danh sách ảnh của một sản phẩm dựa trên ma_san_pham cụ thể.
// API Kiểm tra giỏ hàng người dùng: Lấy thông tin giỏ hàng có ma_nguoi_dung khớp và so_luong > 0.
// API Lọc đơn hàng giá trị/số lượng lớn: Lấy đơn hàng có tổng giá trị lớn hơn ngưỡng cho phép hoặc chứa số lượng sản phẩm lớn hơn 3.
// API Lọc chi tiết đơn hàng theo giá: Lấy các chi tiết đơn hàng có gia > 200000 hoặc so_luong >= 2.
// API Lọc đánh giá chất lượng cao: Lấy danh sách đánh giá có so_sao >= 4 của một sản phẩm.
// API Lọc người dùng theo thời gian: Lấy danh sách tài khoản có ngay_tao lớn hơn mốc thời gian cụ thể và trang_thai = 1
router.get('/list_all_loc', async function (req, res) {
  const { price, quantity, name,priceMin,priceMax,ngaytao,trangthai,soSao, } = req.query;
  const parentId = req.query.parentId0
  const SanPhamId = req.query.SanPhamId
  const userId = req.query.userId
  // const list = await SanPham.find({ giaBan: { $gte: price }});
  // const list = await SanPham.find({ giaBan: { $lt: price }});
  // const list = await SanPham.find({ Soluong: { $gte: quantity, $lte: 10 }});
  // const list = await SanPham.find({ $or: [{ Soluong: quantity }, { giaBan: { $gt: price } }] });
  // const list = await SanPham.find({ tenSanPham: { $regex: name, $options: 'i' } });
  // const list = await SanPham.find({ tenSanPham: { $in: name }, Soluong: { $gte: quantity }, giaBan: { $lte: price } });
  // const list = await SanPham.find({ $or: [{ Soluong: { $gt: quantity } }, { giaBan: { $lt: price } }] });
  // const list = await SanPham.find({giaBan:{$gte:priceMin,$lte:priceMax}});
  // const list=await SanPham.find({ Soluong: { $lte: quantity } });
  // const list=await DanhMuc.find( parentId? {parentId:parentId}:{ parentId: { $eq: null }} );
  // const list=await Img.find({ sanPhamId: SanPhamId }).select('url');
  // const list=await GioHang.find({ $and: [{ maKhachHang: userId }, { Soluong: { $gt: 0 } }] });
  // const list=await DonHang.find({ $or: [{ tongTien: { $gt: price } }, { soLuong: { $gt: quantity } }] });
  // const list=await SanPham.find({ $or: [{ gia: { $gt: price } }, { Soluong: { $gte: quantity } }] });
  // const list=await Review.find({ SoSao: { $gte: soSao } });
  // const list=await SanPham.find({ $and: [{ ngayTao: {$gte: new Date(ngaytao) }, trangThai: { $eq: trangthai } }] });
  res.status(200).json({ noidung: true, message: 'lấy được tất cả người dùng', data: list });
})
module.exports = router;
