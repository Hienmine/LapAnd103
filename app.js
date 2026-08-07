var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
var mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/sawger');
require('./model/User');
require('./model/DonHang');
require('./model/ChiTietDonHang');
require('./model/Review');
require('./model/SanPham');
require('./model/DanhMuc');
require('./model/Img');
require('./model/GioHang');

var indexRouter = require('./routes/index');
var ChiTietDonHangRouter = require('./routes/ChiTietDonHang_router');
var ReviewRouter = require('./routes/Review_router');
var GioHangRouter = require('./routes/giohang_router');
var DanhMucRouter = require('./routes/DanhMuc._router');
var ImgRouter = require('./routes/img_router');
var SanPhamRouter = require('./routes/SanPham_router');
var UserRouter = require('./routes/users.router');
var DonHangRouter = require('./routes/DonHang_router');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();
//connect database
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
    .catch(err => console.log('>>>>>>>>> DB Error: ', err));


app.use('/', indexRouter);
app.use('/user', UserRouter);
app.use('/ChiTietDonHang', ChiTietDonHangRouter);
app.use('/Review', ReviewRouter);
app.use('/GioHang', GioHangRouter);
app.use('/DanhMuc', DanhMucRouter);
app.use('/Img', ImgRouter);
app.use('/SanPham', SanPhamRouter);
app.use('/DonHang', DonHangRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
