import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Kiểm tra xem thông tin có được điền đầy đủ không
  const hasIncompleteInfo = () => {
    return !userData.email || !userData.name || !userData.phone || !userData.address;
  };

  useEffect(() => {
    // Kiểm tra đăng nhập
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    // Lấy thông tin user từ API
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || ''); // Lưu role của user
        const response = await fetch(`http://localhost:3001/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData({
            username: data.username,
            email: data.email || '',
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || ''
          });

          // Kiểm tra và hiển thị thông báo nếu thông tin chưa đầy đủ
          if (!data.email || !data.name || !data.phone || !data.address) {
            setMessage('Vui lòng cập nhật thông tin');
          }
        } else {
          setMessage('Vui lòng cập nhật thông tin');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Có lỗi xảy ra khi tải thông tin');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa thông báo khi người dùng bắt đầu nhập thông tin
    if (message === 'Vui lòng cập nhật thông tin') {
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra xem còn trường nào trống không
    if (hasIncompleteInfo()) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage('Cập nhật thông tin thành công!');
      } else {
        setMessage('Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Thông tin cá nhân</h2>
              {message && (
                <div className={`alert ${message === 'Vui lòng cập nhật thông tin' || message === 'Vui lòng điền đầy đủ thông tin' ? 'alert-warning' : message.includes('thành công') ? 'alert-success' : 'alert-info'}`} role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
              
                <div className="mb-3">
                  <label style={{textAlign: 'left', display: 'block'}} className="form-label">Họ và tên:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={userData.name}
                   readOnly
                  />
                </div>

                <div className="mb-3">
                  <label style={{textAlign: 'left', display: 'block'}} className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={userData.email}
                  readOnly
                  />
                </div>

                <div className="mb-3">
                  <label style={{textAlign: 'left', display: 'block'}} className="form-label">Số điện thoại:</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={userData.phone}
                  readOnly
                  />
                </div>

                <div className="mb-3">
                  <label style={{textAlign: 'left', display: 'block'}} className="form-label">Địa chỉ:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={userData.address}
                    readOnly
                  />
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-primary flex-grow-1 mx-2"
                    onClick={() => navigate('/users')}
                  >
                    Cập nhật thông tin
                  </button>
                  {userRole !== 'tutor' && (
                    <button 
                      type="button" 
                      className="btn btn-success flex-grow-1 mx-2"
                      onClick={() => navigate('/signup')}
                    >
                      Trở thành Tutor
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
