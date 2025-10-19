import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaShoppingCart } from 'react-icons/fa';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { Rate } from 'antd';

import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/courses/${id}`);
        setFood(res.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const itemToAdd = {
      id: food.id,
      name: food.name,
      image: food.image,
      restname: food.restname
    };

    addToCart(itemToAdd);
    setMessage('Đã thêm vào giỏ hàng!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!food) {
    return (
      <Container className="text-center mt-5">
        <h5>Đang tải dữ liệu...</h5>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow rounded">
            <Card.Img
              variant="top"
              src={food.image || 'https://via.placeholder.com/500x500'}
              alt={food.name}
              className="img-fluid"
            />
            <Card.Body>
              <p className="fw-bold text-warning fs-5 mb-2">
                {food.restname ? `🏠 ${food.restname}` : ''}
              </p>

              <Card.Title className="fs-2 fw-bold">{food.name}</Card.Title>

              <div className="mb-3">
                <Rate disabled allowHalf defaultValue={food.rating || 0} />
                <span className="text-muted ms-2">
                  {food.rating ? `${food.rating}/5` : 'Chưa có đánh giá'}
                </span>
              </div>

              <p>
                <FaMapMarkerAlt className="text-danger me-2" />
                {food.location}, {food.address}
              </p>
              <p>
                <FaPhoneAlt className="text-success me-2" />
                {food.phone}
              </p>
            
              <p>
                <FaClock className="text-primary me-2" />
                {food.openTime}
                {food.status?.toLowerCase() === 'open' && (
                  <Badge bg="success" className="ms-3">
                    Đang mở
                  </Badge>
                )}
              </p>

              <hr />
              <p className="mt-3">{food.description}</p>

              {message && (
                <Alert variant="success" className="mt-3">
                  {message}
                </Alert>
              )}

              {userRole === 'user' && (
                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart className="me-2" />
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodDetail;
