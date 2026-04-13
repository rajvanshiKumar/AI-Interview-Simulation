import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Mic, Video, BarChart3, ShieldCheck } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Mic className="text-primary mb-3" size={32} />,
      title: "Voice Analysis",
      description: "Get real-time feedback on your tone, pace, and clarity."
    },
    {
      icon: <Video className="text-primary mb-3" size={32} />,
      title: "Facial Tracking",
      description: "Analyze your body language and eye contact during responses."
    },
    {
      icon: <BarChart3 className="text-primary mb-3" size={32} />,
      title: "Performance Scores",
      description: "Detailed metrics on grammar, confidence, and content quality."
    },
    {
      icon: <ShieldCheck className="text-primary mb-3" size={32} />,
      title: "Industry Standards",
      description: "Interview questions curated by industry experts from top tech companies."
    }
  ];

  return (
    <div className="hero-gradient min-vh-100">
      {/* Hero Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="display-3 fw-800 mb-4 animate__animated animate__fadeInUp">
                AI Interview <span className="text-gradient">Simulator Pro</span>
              </h1>
              <p className="lead text-muted mb-5 fs-4 animate__animated animate__fadeInUp animate__delay-1s">
                Practice interviews with advanced AI and get real-time feedback. Master your skills and land your dream job.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start animate__animated animate__fadeInUp animate__delay-2s">
                <Button as={Link} to="/start-interview" size="lg" className="btn-primary px-5 py-3 shadow-lg">
                  Start FREE Interview
                </Button>
                <Button as={Link} to="/register" variant="outline-primary" size="lg" className="px-5 py-3 border-2 fw-semibold">
                  Join for Free
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center animate__animated animate__zoomIn">
              <div className="position-relative">
                <div className="bg-primary opacity-10 rounded-circle position-absolute top-50 start-50 translate-middle w-100 h-100" style={{ filter: 'blur(80px)' }}></div>
                <img 
                  src="https://img.freepik.com/free-vector/ai-technology-robot-head-background-vector_53876-117783.jpg" 
                  alt="AI Interview" 
                  className="img-fluid rounded-4 shadow-2xl relative"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-1 mb-3">Why Choose Pro?</h2>
            <p className="text-muted">Explore the powerful features that make our platform the #1 choice.</p>
          </div>
          <Row>
            {features.map((feature, idx) => (
              <Col md={6} lg={3} key={idx} className="mb-4">
                <Card className="h-100 p-4 border-0 shadow-sm hover-shadow-lg">
                  <Card.Body className="p-0">
                    {feature.icon}
                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
