const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'And103 API',
      version: '1.0.0',
      description: 'API documentation cho dự án And103',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'User', description: 'Quản lý người dùng' },
      { name: 'SanPham', description: 'Quản lý sản phẩm' },
      { name: 'DanhMuc', description: 'Quản lý danh mục' },
      { name: 'DonHang', description: 'Quản lý đơn hàng' },
      { name: 'ChiTietDonHang', description: 'Quản lý chi tiết đơn hàng' },
      { name: 'GioHang', description: 'Quản lý giỏ hàng' },
      { name: 'Review', description: 'Quản lý đánh giá' },
      { name: 'Img', description: 'Quản lý hình ảnh' },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
