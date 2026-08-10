var express = require('express');
var router = express.Router();
var User = require('../model/User');
const Upload = require('../config/upload');
const Transporter = require('../config/mail');
const fs = require('fs');
const path = require('path');
/* post(add user) */
/** 
 * @swagger
 * /user/user_add:
 *   post:
 *     summary: Thêm người dùng mới
 *     tags: [User]
 *     description: Thêm một người dùng mới vào hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng.
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng.
 *               email:
 *                 type: string
 *                 description: Email của người dùng.
 *               Sdt:
 *                 type: string
 *                 description: Số điện thoại của người dùng.
 *               GioiTinh:
 *                 type: string
 *                 description: Giới tính của người dùng.
 *               NgaySinh:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh của người dùng.
 *               DiaChi:
 *                 type: string
 *                 description: Địa chỉ của người dùng.
 *     responses:
 *       200:
 *         description: Thêm người dùng thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trangthai:
 *                   type: boolean
 *                   description: Trạng thái thành công hay thất bại.
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả.
 */
router.post('/user_add', async function (req, res) {
  const { username, password, email, Sdt, GioiTinh, NgaySinh, DiaChi } = req.body;
  const newUser = {
    username,
    password,
    email,
    Sdt,
    GioiTinh,
    NgaySinh,
    DiaChi
  };
  await User.create(newUser);
  res.status(200).json({ trangthai: true, message: 'thêm người dùng mới thành công' });
});
/* Put (update user) */
//router.put('/user_update/', async function(req, res) {
//const {id,username,password,email, Sdt, GioiTinh, NgaySinh, DiaChi} = req.body;
//const updateinfo = {username,password,email, Sdt, GioiTinh, NgaySinh, DiaChi};
//const updateuser = await User.findByIdAndUpdate(
// id, 
//%set%{updateinfo}, 
// {new: true, runValidators: true}
//);
/** 
 * @swagger
 * /user/user_update:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     description: Cập nhật thông tin người dùng dựa trên ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của người dùng cần cập nhật.
 *               username:
 *                 type: string
 *                 description: Tên người dùng mới.
 *               password:
 *                 type: string
 *                 description: Mật khẩu mới.
 *               email:
 *                 type: string
 *                 description: Email mới.
 *               Sdt:
 *                 type: string
 *                 description: Số điện thoại mới.
 *               GioiTinh:
 *                 type: string
 *                 description: Giới tính mới.
 *               NgaySinh:
 *                 type: string
 *                 format: date
 */
router.put('/user_update', async function (req, res) {
  const { id, username, password, email, Sdt, GioiTinh, NgaySinh, DiaChi } = req.body;
  const findUser = await User.findById(id); //tìm kiếm người dùng theo id
  if (findUser) {
    findUser.username = username;
    findUser.password = password;
    findUser.email = email;
    findUser.Sdt = Sdt;
    findUser.GioiTinh = GioiTinh;
    findUser.NgaySinh = NgaySinh;
    findUser.DiaChi = DiaChi;
    await findUser.save();
    res.status(200).json({ trangthai: true, message: 'Cập nhật người dùng thành công' }); //nếu findUser tồn tại thì cập nhật thông tin người dùng và trả về thông báo thành công
  } else {
    return res.status(200).json({ trangthai: false, message: 'Người dùng không tồn tại' }); //nếu findUser null trả về thông báo người dùng không tồn tại
  }

});
/** 
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [User]
 *     description: Xóa người dùng theo ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của người dùng cần xóa.
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noidung:
 *                   type: boolean
 *                   description: Trạng thái thành công hay thất bại.
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả.
 */
router.delete('/user_delete', async function (req, res) {
  const userId = req.body;
  await User.findByIdAndDelete(userId); //tìm kiếm người dùng theo id và xóa người dùng đó
  res.status(200).json({ trangthai: true, message: 'xóa người dùng thành công' });
});
/** 
 * @swagger
 * /user/list_all:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [User]
 *     description: Trả về danh sách tất cả người dùng.
 *     responses:
 *       200:
 *         description: Danh sách người dùng được trả về thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noidung:
 *                   type: boolean
 *                   description: Trạng thái thành công hay thất bại.
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: Tên người dùng.
 *                       email:
 *                         type: string
 *                         description: Email của người dùng.
 */
/*search */
router.get('/list_all', async function (req, res) {
  const list = await User.find({},{username,email});
  res.status(200).json({ noidung: true, message: 'lấy được tất cả người dùng', data: list });
})
/** 
 * @swagger
 * /user/user_one:
 *   get:
 *     summary: Lấy thông tin người dùng theo tên
 *     tags: [User]
 *     description: Trả về thông tin người dùng dựa trên tham số name được cung cấp.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên người dùng cần tìm kiếm.
 *     responses:
 *       200:
 *         description: Thông tin người dùng được trả về thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noidung:
 *                   type: boolean
 *                   description: Trạng thái thành công hay thất bại.
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: Tên người dùng.
 *                       email:
 *                         type: string
 *                         description: Email của người dùng.
 *       400:
 *         description: Lỗi khi không cung cấp tham số name hoặc không tìm thấy người dùng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noidung:
 *                   type: boolean
 *                   description: Trạng thái thất bại.
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Thông báo lỗi.  
 */
//query trả về giá trị http://localhost:3000/user/user_one/name(key)?name=Lê Văn A(value)
router.get('/user_one', async function (req, res) {
  const { name } = req.query
  if (!name) {
    return res.status(200).json({ noidung: false, message: 'Vui lòng cung cấp tham số name' });
  }
  const list = await User.find({ username: name });
  if (!list) {
    return res.status(200).json({
      noidung: false,
      message: 'Không tìm thấy người dùng này',
      data: []
    });
  }
  res.status(200).json({ noidung: true, message: 'lấy được thông tin người dùng', data: list });
})

//params trả về https://gemini.google.com/app(api)/1eb39c5da132641c(giá trị)
// router.get('/user_one/:name',async function(req,res){
//   const {name}=req.params
//   const list=await User.find({username:name})
//   res.status(200).json({noidung:true,message:'lấy được thông tin người dùng',data:list})
// })



// /* send email */
// const Users = require('../model/User');
// const Transporter = require('../config/mail')
// router.post('/register-send-email', Upload.single('avatar'), async (req, res) => {
//   try {
//     const data = req.body;
//     const { file } = req
//     const newUser = Users({
//       username: data.username,
//       password: data.password,
//       email: data.email,
//       name: data.name,
//       avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
//       //url avatar http://localhost:3000/uploads/filename
//     })
//     const result = await newUser.save()
//     if (result) {   //Gửi mail
//       const mailOptions = {
//         from: "dinhnt24@fpt.edu.vn", //email gửi đi
//         to: result.email, // email nhận
//         subject: "Đăng ký thành công", //subject
//         text: "Cảm ơn bạn đã đăng ký", // nội dung mail
//       };
//       // Nếu thêm thành công result !null trả về dữ liệu
//       await Transporter.sendMail(mailOptions); // gửi mail
//       res.json({
//         "status": 200,
//         "messenger": "Thêm thành công",
//         "data": result
//       })
//     } else {// Nếu thêm không thành công result null, thông báo không thành công
//       res.json({
//         "status": 400,
//         "messenger": "Lỗi, thêm không thành công",
//         "data": []
//       })
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * @swagger
 * /user/send-email:
 *   post:
 *     summary: Gửi email
 *     tags: [User]
 *     description: Gửi email với tiêu đề và nội dung được cung cấp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Địa chỉ email người nhận.
 *               subject:
 *                 type: string
 *                 description: Tiêu đề của email.
 *               content:
 *                 type: string
 *                 description: Nội dung của email.
 *     responses:
 *       200:
 *         description: Gửi email thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái HTTP.
 *                 messenger:
 *                   type: string
 *                   description: Thông báo kết quả gửi email.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Lỗi gửi email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messenger:
 *                   type: string
 *                   description: Thông báo lỗi gửi email.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/* gửi mail */
router.post('/send-email', async (req, res) => {
  try{
    const {to, subject, content} = req.body;
    const templatePath = path.join(__dirname, '../mail/mail.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    htmlContent = htmlContent.replace('{{title}}', subject);
    const mailOptions = {
      from: "Admin Lap <lehienmine@gmail.com>",
      to: to,
      subject: subject,
      html: htmlContent
    };
    await Transporter.sendMail(mailOptions);
    res.json({
      "status": 200,
      "messenger": "Gửi mail thành công",
      "data": []
    })
  } catch (error) {
    console.log(error);
    res.json({
      "messenger": "Lỗi gửi mail",
      "data": []
    })
  }
});
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [User]
 *     description: Đăng nhập người dùng bằng username, email và password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập của người dùng.
 *               email:
 *                 type: string
 *                 description: Email của người dùng.
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng.
 *     responses:
 *       200:
 *         description: Đăng nhập thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái HTTP.
 *                 messenger:
 *                   type: string
 *                   description: Thông báo kết quả đăng nhập.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       description: ID của người dùng.
 *                     username:
 *                       type: string
 *                       description: Tên đăng nhập của người dùng.
 *                 token:
 *                   type: string
 *                   description: Token JWT cho phiên đăng nhập.
 *                 refreshToken:
 *                   type: string
 *                   description: Token JWT để làm mới phiên đăng nhập.
 *       400:
 *         description: Đăng nhập không thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái HTTP.
 *                 messenger:
 *                   type: string
 *                   description: Thông báo lỗi đăng nhập.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Thông báo lỗi.
 */
/* token */
const JWT = require('jsonwebtoken');
router.post('/login', async (req, res) => {
  try {
    const { username, email,password } = req.body;
    const user = await User.findOne({ username,email,password });
    if (user) {
      const token = JWT.sign({ id: user._id }, process.env.SECRETKEY, { algorithm: 'HS256', expiresIn: '1h' });
      const refreshToken = JWT.sign({ id: user._id }, process.env.SECRETKEY, { algorithm: 'HS256', expiresIn: '1d' })
      res.json({
        "status": 200,
        "messenger": "Đăng nhâp thành công",
        "data": { user_id: user._id, username: user.username },
        "token": token,
        "refreshToken": refreshToken
      })
    } else {
      
      res.json({
        "status": 400,
        "messenger": "Lỗi, đăng nhập không thành công",
        "data": []
      })
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
