import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import './FindTutor.css';

const FindTutor = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:3001/courses');
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Container className="find-tutor-container">
        <div className="text-center mt-5">Đang tải...</div>
      </Container>
    );
  }

  return (
    <Container className="find-tutor-container">
      <h2 className="mb-4">Đăng ký môn học</h2>

      <div className="courses-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <img
              src={course.image || 'https://via.placeholder.com/150'}
              className="course-image"
              alt={course.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <div className="course-body">
              <h5 className="course-name">{course.name}</h5>
              <p className="course-info">
                <strong>Giảng viên:</strong> {course.restname}
              </p>
              <p className="course-info">
                <strong>Địa điểm:</strong> {course.address}
              </p>
              <p className="course-info">
                <strong>Lịch học:</strong> {course.openTime}
              </p>
              <p className="course-info">
                <strong>Trạng thái:</strong>{' '}
                <span className={course.status === 'Còn trống' ? 'status-available' : 'status-full'}>
                  {course.status}
                </span>
              </p>
              <div className="course-actions">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <FaEye /> Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center mt-4 text-muted">Không có khóa học nào.</div>
        )}
      </div>
    </Container>
  );
};

export default FindTutor;

