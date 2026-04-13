import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { login } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify({ username: formData.username }));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4 p-md-5 border-0 shadow-lg mt-5">
              <div className="text-center mb-5">
                <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                <p className="text-muted">Login to continue your preparation</p>
              </div>
              
              <Form onSubmit={handleLogin}>
                {error && <div className="alert alert-danger p-2 small">{error}</div>}
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="fw-medium">Username</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-3">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <Form.Control 
                      type="text" 
                      placeholder="Username" 
                      className="border-start-0 ps-0"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <div className="d-flex justify-content-between">
                    <Form.Label className="fw-medium">Password</Form.Label>
                    <Link to="/forgot-password" size="sm" className="text-decoration-none text-primary small">Forgot Password?</Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-3">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <Form.Control 
                      type="password" 
                      placeholder="••••••••" 
                      className="border-start-0 ps-0"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-3 fw-bold rounded-3 mb-4 shadow-sm">
                  Log In
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Create Account</Link>
                  </p>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
