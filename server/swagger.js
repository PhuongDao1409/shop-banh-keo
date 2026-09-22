const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Tài liệu API Nhà Sách Online',
    version: '1.0.0',
    description: 'API phục vụ ứng dụng Mobile React Native',
  },
  paths: {
    '/api/books': {
      get: {
        summary: 'Lấy danh sách tất cả sách',
        responses: { 200: { description: 'Thành công' } },
      },
      post: {
        summary: 'Thêm một cuốn sách mới vào MySQL',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Lập Trình React Native Pro' },
                  author: { type: 'string', example: 'Nguyễn Văn A' },
                  price: { type: 'number', example: 199000 },
                  description: { type: 'string', example: 'Mô tả tóm tắt sách' },
                  coverImage: { type: 'string', example: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936067604627_1.jpg' },
                },
                required: ['title', 'price'],
              },
            },
          },
        },
        responses: { 201: { description: 'Thêm sách thành công' } },
      },
    },
    '/api/books/{id}': {
      get: {
        summary: 'Lấy chi tiết 1 cuốn sách theo ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Thành công' }, 404: { description: 'Không tìm thấy' } },
      },
    },
    '/api/categories': {
      get: {
        summary: 'Lấy danh sách các thể loại sách',
        responses: { 200: { description: 'Thành công' } },
      },
    },
  },
};

module.exports = swaggerDocument;