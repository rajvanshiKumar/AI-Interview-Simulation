import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Globe, Send, Briefcase, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-5 pb-3 bg-white border-top mt-5">
      <Container>
        <Row className="mb-5">
          <Col lg={4} className="mb-4 mb-lg-0">
            <h4 className="fw-bold text-primary mb-4 d-flex align-items-center">
              <span className="me-2">🤖</span> AI Interview Pro
            </h4>
            <p className="text-muted mb-4 pe-lg-5">
              Empowering candidates to ace their dream interviews using cutting-edge AI technology for real-time feedback and analysis.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted hover-text-primary"><Globe size={20} /></a>
              <a href="#" className="text-muted hover-text-primary"><Send size={20} /></a>
              <a href="#" className="text-muted hover-text-primary"><Briefcase size={20} /></a>
            </div>
          </Col>

          <Col md={4} lg={2} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Platform</h6>
            <ul className="list-unstyled">
              <li className="mb-3"><Link to="/" className="text-muted text-decoration-none hover-link">Home</Link></li>
              <li className="mb-3"><Link to="/dashboard" className="text-muted text-decoration-none hover-link">Dashboard</Link></li>
              <li className="mb-3"><Link to="/start-interview" className="text-muted text-decoration-none hover-link">Practice Now</Link></li>
              <li><Link to="/result" className="text-muted text-decoration-none hover-link">Recent Results</Link></li>
            </ul>
          </Col>

          <Col md={4} lg={3} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="#" className="text-muted text-decoration-none hover-link">Interview Tips</a></li>
              <li className="mb-3"><a href="#" className="text-muted text-decoration-none hover-link">Success Stories</a></li>
              <li className="mb-3"><a href="#" className="text-muted text-decoration-none hover-link">AI Methodology</a></li>
              <li><a href="#" className="text-muted text-decoration-none hover-link">Career Blog</a></li>
            </ul>
          </Col>

          <Col md={4} lg={3}>
            <h6 className="fw-bold mb-4">Contact Support</h6>
            <ul className="list-unstyled">
              <li className="mb-3 text-muted d-flex align-items-center">
                <Mail size={16} className="me-2" /> Gupta1@gmail.com
              </li>
              <li className="mb-3 text-muted d-flex align-items-center">
                <Phone size={16} className="me-2" /> +91 987654321
              </li>
              <li className="text-muted d-flex align-items-center">
                <MapPin size={16} className="me-2" /> Gurugram, Haryana, India
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="bg-light" />

        <Row className="align-items-center pt-3">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="text-muted mb-0 small">
              © 2026 AI Interview Pro. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0 fw-bold text-dark">
              Created and developed by <span className="text-primary">Rajvanshi Gupta</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
