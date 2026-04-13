import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Layers, Zap, Download } from 'lucide-react';
import { createSession } from '../services/api';

const StartInterview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'Frontend',
    level: 'Fresher'
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('role', formData.role);
      data.append('level', formData.level);
      if (resume) {
        data.append('resume', resume);
      }

      const response = await createSession(data);
      localStorage.setItem('currentSession', JSON.stringify(response.data));
      navigate('/session');
    } catch (error) {
      console.error("Failed to create session:", error);
      alert("Failed to connect to the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg p-4 p-md-5">
              <div className="text-center mb-5">
                <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                  <Zap size={48} className="text-primary" />
                </div>
                <h2 className="fw-bold">Interview Setup</h2>
                <p className="text-muted">Configure your session to get relevant questions.</p>
              </div>

              <Form onSubmit={handleStart}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <Briefcase size={18} className="me-2 text-primary" /> Select Role
                  </Form.Label>
                  <Form.Select 
                    className="py-3" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Frontend">Frontend Developer</option>
                    <option value="Backend">Backend Developer</option>
                    <option value="Fullstack">Full Stack Developer</option>
                    <option value="HR">HR Interview</option>
                    <option value="DSA">DSA / Problem Solving</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <Layers size={18} className="me-2 text-primary" /> Experience Level
                  </Form.Label>
                  <Form.Select 
                    className="py-3"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                  >
                    <option value="Fresher">Fresher (0-1 Years)</option>
                    <option value="Intermediate">Intermediate (2-4 Years)</option>
                    <option value="Senior">Senior (5+ Years)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <Download size={18} className="me-2 text-primary" /> Upload Resume (Optional)
                  </Form.Label>
                  <Form.Control 
                    type="file" 
                    accept=".pdf"
                    className="py-3"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                  <Form.Text className="text-muted">
                    Upload your PDF resume to get personalized questions based on your experience.
                  </Form.Text>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-3 fw-bold rounded-3 shadow-md"
                  disabled={loading}
                >
                  {loading ? 'Analyzing Resume...' : 'Start Interview Now'}
                </Button>
                <p className="text-center text-muted small mt-3">
                  Check your camera and microphone before starting.
                </p>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StartInterview;
