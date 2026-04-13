import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { register } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({ username: '', email: '', password: '' });
  const [error, setError] = React.useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        // Collect all error messages from the backend
        const message = Object.keys(errors)
          .map(key => `${key}: ${Array.isArray(errors[key]) ? errors[key][0] : errors[key]}`)
          .join(' | ');
        setError(message || 'Registration failed. Check your details.');
      } else {
        setError('Connection error. Please try again.');
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4 p-md-5 border-0 shadow-lg mt-5">
              <div className="text-center mb-5">
                <h2 className="fw-bold text-primary mb-2">Get Started</h2>
                <p className="text-muted">Create an account to master your interviews</p>
              </div>
              
              <Form onSubmit={handleRegister}>
                {error && <div className="alert alert-danger p-2 small">{error}</div>}
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label className="fw-medium">Username</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-3">
                      <User size={18} className="text-muted" />
                    </span>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. johndoe123" 
                      className="border-start-0 ps-0"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.trim() })}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="fw-medium">Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-3">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <Form.Control 
                      type="email" 
                      placeholder="name@example.com" 
                      className="border-start-0 ps-0"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-medium">Password</Form.Label>
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
                  Create Account
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Login</Link>
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

export default Register;
