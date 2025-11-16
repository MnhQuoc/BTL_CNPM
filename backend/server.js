// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ✅ Route xác minh email
server.get('/verify/:id', (req, res) => {
  const id = req.params.id;
  const db = router.db;

  // So sánh id dưới dạng chuỗi để tránh lỗi khi id là số trong db.json
  const user = db.get('users').find(u => String(u.id) === id).value();

  if (!user) {
    return res.status(404).send('Người dùng không tồn tại');
  }

  if (user.verified) {
    return res.send('Tài khoản đã xác minh thành công');
  }

  db.get('users')
    .find(u => String(u.id) === id)
    .assign({ verified: true })
    .write();

  res.send('Xác minh tài khoản thành công!');
});

// ✅ Middleware kiểm tra: mỗi tutor chỉ dạy 1 môn (có thể có nhiều khung giờ) - cho tutorCourses
server.use('/tutorCourses', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const db = router.db;
    const courseData = req.body;
    const tutorId = courseData.tutorId;
    const subjectName = courseData.name;

    if (!tutorId || !subjectName) {
      return next(); // Let json-server handle missing fields
    }

    // Lấy tất cả courses của tutor này từ tutorCourses
    const tutorCourses = db.get('tutorCourses')
      .filter(course => String(course.tutorId) === String(tutorId))
      .value();

    if (req.method === 'POST') {
      // Khi tạo mới: kiểm tra xem tutor đã có môn nào khác chưa
      if (tutorCourses.length > 0) {
        const existingSubject = tutorCourses[0].name;
        if (existingSubject !== subjectName) {
          return res.status(400).json({
            error: 'Mỗi tutor chỉ được dạy 1 môn học. Bạn đã có môn: ' + existingSubject + '. Vui lòng thêm khung giờ mới cho môn này thay vì tạo môn mới.'
          });
        }
      }
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // Khi cập nhật: kiểm tra xem có đang đổi sang môn khác không
      // Lấy courseId từ URL (ví dụ: /tutorCourses/1 hoặc /1)
      let courseId = null;
      const urlPath = req.url.split('?')[0]; // Bỏ query parameters
      const urlParts = urlPath.split('/').filter(part => part);
      
      // Tìm courseId trong URL (số hoặc chuỗi)
      for (let i = urlParts.length - 1; i >= 0; i--) {
        const part = urlParts[i];
        if (part && part !== 'tutorCourses') {
          courseId = part;
          break;
        }
      }
      
      if (courseId) {
        const otherCourses = tutorCourses.filter(course => String(course.id) !== String(courseId));
        
        if (otherCourses.length > 0) {
          const existingSubject = otherCourses[0].name;
          if (existingSubject !== subjectName) {
            return res.status(400).json({
              error: 'Mỗi tutor chỉ được dạy 1 môn học. Bạn đã có môn: ' + existingSubject + '. Không thể đổi sang môn khác.'
            });
          }
        }
      }
    }
  }
  next();
});

// Các route mặc định
server.use(router);

// Start server
server.listen(3001, () => {
  console.log('🚀 JSON Server đang chạy tại http://localhost:3001');
});
