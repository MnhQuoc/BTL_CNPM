import React, { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router';

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Thêm loading để quản lý trạng thái gửi
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (name === 'username' && value.length < 8) {
      errorMessage = 'Tên đăng nhập phải từ 8 ký tự trở lên';
    }

    if (name === 'password' && !/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value)) {
      errorMessage = 'Mật khẩu phải từ 8 ký tự trở lên và bao gồm cả chữ và số';
    }

    if (name === 'phone' && !/^\d{10}$/.test(value)) {
      errorMessage = 'Số điện thoại phải có 10 số';
    }

    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = 'Email không hợp lệ';
    }

    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  const validateForm = () => {
    let valid = true;
    let errorMessages = {};
    if (form.username.length < 8) {
      errorMessages.username = 'Tên đăng nhập phải từ 8 ký tự trở lên';
      valid = false;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      errorMessages.password =
        'Mật khẩu phải từ 8 ký tự trở lên và bao gồm cả chữ và số';
      valid = false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      errorMessages.phone = 'Số điện thoại phải có 10 số';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errorMessages.email = 'Email không hợp lệ';
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!validateForm()) {
      setMessage('Vui lòng sửa các lỗi ở biểu mẫu.');
      setLoading(false);
      return;
    }

    try {
      // Kiểm tra username đã tồn tại
      const res = await axios.get(
        `http://localhost:3001/users?username=${form.username}`
      );
      console.log('API response:', res.data);

      if (!Array.isArray(res.data)) {
        throw new Error('API không trả về mảng dữ liệu');
      }

      if (res.data.some((user) => user.username === form.username)) {
        setMessage('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
        setLoading(false);
        return;
      }

      const newUserId = Date.now();
      const { username, password, phone, email } = form;

      // Đăng ký user mới
      await axios.post('http://localhost:3001/users', {
        id: newUserId,
        username,
        password,
        phone,
        email,
        role: 'user',
        blocked: false,
        verified: false,
      });

      // Gửi email xác nhận
      const confirmationLink = `http://localhost:5173/verify/${newUserId}`;
      await emailjs.send(
        'service_2o1ywkk',
        'template_m0x0lah',
        {
          username,
          email,
          userId: newUserId,
          confirmationLink,
        },
        'ZcmKYaJ0MqbWwcw2h'
      );

      setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
      setForm({ username: '', password: '', phone: '', email: '' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Lỗi:', error);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '20px',
          textAlign: 'left',
        }}
      >
        <h2 className="mb-4 text-center">Đăng Ký</h2>
        <p>Các trường có dấu * bắt buộc phải nhập</p>
        {message && <p className="mt-3">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập (<span className="text-danger">*</span>):
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập tên đăng nhập của bạn"
              required
            />
            {errors.username && (
              <p className="text-danger">{errors.username}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu (<span className="text-danger">*</span>):
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
            {errors.password && (
              <p className="text-danger">{errors.password}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Số điện thoại (<span className="text-danger">*</span>):
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập số điện thoại của bạn"
              required
            />
            {errors.phone && <p className="text-danger">{errors.phone}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email (<span className="text-danger">*</span>):
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập email của bạn"
              required
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>

          <button
            type="submit"
            className=" btn pill-btn w-100"
            style={{ padding: '15px' }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <span>Bạn đã có tài khoản?</span>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;