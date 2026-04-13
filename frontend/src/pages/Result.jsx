import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getResults } from '../services/api';
import Loader from '../components/Loader';
import { 
  CheckCircle, AlertTriangle, TrendingUp, Award, 
  Lightbulb, RefreshCcw, LayoutDashboard, Download,
  MessageSquare, User, Zap, Brain
} from 'lucide-react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Result = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [userName, setUserName] = React.useState("User");

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUserName(JSON.parse(savedUser).username);
    }
  }, []);

  React.useEffect(() => {
    const fetchResults = async () => {
      const savedSession = localStorage.getItem('currentSession');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        try {
          const response = await getResults(session.id);
          setData(response.data);
        } catch (error) {
          console.error("Failed to fetch results:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div className="min-vh-100 d-flex align-items-center"><Loader /></div>;
  if (!data) return <div className="min-vh-100 d-flex align-items-center justify-content-center"><h3>No result data found.</h3></div>;

  const overallScore = data.overall_score || 75;
  const responses = data.responses || [];

  // Calculate averages for charts
  const avgGrammar = responses.length ? Math.round(responses.reduce((s, r) => s + r.grammar_score, 0) / responses.length) : 0;
  const avgConfidence = responses.length ? Math.round(responses.reduce((s, r) => s + r.confidence_score, 0) / responses.length) : 0;
  const avgContent = responses.length ? Math.round(responses.reduce((s, r) => s + r.content_score, 0) / responses.length) : 0;

  // Chart Data
  const barData = {
    labels: ['Grammar', 'Confidence', 'Content Quality'],
    datasets: [
      {
        label: 'Score Percentage',
        data: [avgGrammar, avgConfidence, avgContent],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)', // Primary
          'rgba(34, 197, 94, 0.8)', // Success
          'rgba(245, 158, 11, 0.8)', // Warning
        ],
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: responses.map((_, i) => `Q${i+1}`),
    datasets: [
      {
        label: 'Performance Trend',
        data: responses.map(r => Math.round((r.grammar_score + r.confidence_score + r.content_score) / 3)),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 3,
      },
    ],
  };

  const doughnutData = {
    datasets: [
      {
        data: [overallScore, 100 - overallScore],
        backgroundColor: ['#4f46e5', '#f1f5f9'],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  };

  const radarData = {
    labels: ['Grammar', 'Confidence', 'Content', 'Technical', 'Speed'],
    datasets: [
      {
        label: 'Skill Proficiency',
        data: [avgGrammar, avgConfidence, avgContent, Math.round(avgContent*0.9), 85],
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: '#4f46e5',
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4f46e5',
      },
    ],
  };

  const questionsFeedback = [
    {
      id: 1,
      question: "Tell me about yourself.",
      answer: "I am a frontend developer with experience in React and Bootstrap...",
      good: "Clear introduction and highlighted key skills early.",
      improve: "Try to link your experiences more directly to the job description."
    },
    {
      id: 2,
      question: "Why do you want to work for this company?",
      answer: "I admire your innovative approach to AI and believe I can contribute...",
      good: "Showed genuine interest and research into the company.",
      improve: "Provide more specific examples of how your skills solve their current challenges."
    }
  ];

  return (
    <div className="py-5 bg-light min-vh-100">
      <Container>
        {/* Header Section */}
        <div className="mb-5 animate__animated animate__fadeInDown">
          <h4 className="text-primary fw-bold mb-0">Hello, {userName} 👋</h4>
          <h1 className="display-5 fw-800">Your Interview Performance Report</h1>
          <p className="lead text-muted">Here’s how you performed. Improve and get job-ready!</p>
        </div>

        {/* Top Summary Section */}
        <Row className="mb-4">
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm h-100 p-4">
              <Row className="align-items-center h-100">
                <Col md={5} className="text-center mb-4 mb-md-0 position-relative">
                  <div style={{ width: '200px', margin: 'auto' }}>
                    <Doughnut data={doughnutData} options={{ plugins: { legend: { display: false } } }} />
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <h1 className="fw-800 mb-0" style={{ fontSize: '3rem' }}>{overallScore}%</h1>
                      <p className="text-muted small fw-bold">OVERALL SCORE</p>
                    </div>
                  </div>
                </Col>
                <Col md={7}>
                  <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3 fs-6">
                    Performance: Excellent
                  </Badge>
                  <h3 className="fw-bold mb-3">AI Summary</h3>
                  <p className="text-muted fs-5 mb-4">
                    {data.summary || '"You have good technical knowledge but need improvement in communication and confidence. Your answer structure is solid, but remember to maintain better eye contact with the camera."'}
                  </p>
                  <div className="d-flex align-items-center text-primary fw-bold">
                    <TrendingUp size={20} className="me-2" /> You performed better than 65% of users
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100 p-4 bg-primary text-white overflow-hidden position-relative">
              <div className="position-relative z-index-1">
                <div className="bg-white bg-opacity-20 p-3 rounded-3 d-inline-block mb-4">
                  <Award size={32} />
                </div>
                <h4 className="fw-bold mb-2">New Badge Earned!</h4>
                <h2 className="display-6 fw-bold mb-4">Intermediate Pro</h2>
                <p className="opacity-75 mb-4">You've reached a new level of interview mastery. Keep practicing to reach 'Expert' status.</p>
                <Button variant="light" className="text-primary fw-bold px-4 py-2 rounded-3 w-100">
                  View Achievements
                </Button>
              </div>
              <Award className="position-absolute opacity-10" size={240} style={{ bottom: '-60px', right: '-60px' }} />
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Competency Graph</h5>
              <div style={{ height: '300px' }}>
                <Radar 
                  data={radarData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: { r: { beginAtZero: true, max: 100, ticks: { display: false } } }
                  }} 
                />
              </div>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Performance Trend</h5>
              <div style={{ height: '300px' }}>
                <Line 
                  data={lineData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } }
                  }} 
                />
              </div>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Score Snapshot</h5>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={barData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } }
                  }} 
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Strengths and Weaknesses */}
        <Row className="mb-4">
          <Col md={6} className="mb-4">
            <Card className="border-0 shadow-sm p-4 h-100 border-start border-success border-5">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <CheckCircle className="text-success me-2" /> Key Strengths
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-3 d-flex align-items-center p-3 bg-light rounded-3">
                  <span className="me-3 fs-4">✅</span> Strong technical understanding
                </li>
                <li className="mb-3 d-flex align-items-center p-3 bg-light rounded-3">
                  <span className="me-3 fs-4">✅</span> Good answer structure
                </li>
                <li className="d-flex align-items-center p-3 bg-light rounded-3">
                  <span className="me-3 fs-4">✅</span> Relevant examples used
                </li>
              </ul>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="border-0 shadow-sm p-4 h-100 border-start border-warning border-5">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <AlertTriangle className="text-warning me-2" /> Areas for Improvement
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-3 d-flex align-items-center p-3 bg-light rounded-3">
                  <span className="me-3 fs-4">⚠️</span> Low confidence in speaking
                </li>
                <li className="mb-3 d-flex align-items-center p-3 bg-light rounded-3">
                  <span className="me-3 fs-4">⚠️</span> Minor grammar mistakes
                </li>
                <li className="d-flex align-items-center p-3 bg-light rounded-3">
                  <span className="me-3 fs-4">⚠️</span> Short or incomplete answers
                </li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* Skill Analysis Circular Indicators */}
        <Card className="border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-5">Professional Skill Analysis</h5>
          <Row className="text-center">
            {[
              { name: "Communication", score: avgConfidence, color: "primary", icon: <MessageSquare size={20} /> },
              { name: "Technical", score: avgContent, color: "info", icon: <Zap size={20} /> },
              { name: "Confidence", score: Math.round(avgConfidence*0.8), color: "warning", icon: <User size={20} /> },
              { name: "Problem Solving", score: avgGrammar, color: "success", icon: <Brain size={20} /> },
            ].map((skill, idx) => (
              <Col sm={6} md={3} key={idx} className="mb-4 mb-md-0">
                <div className="d-flex flex-column align-items-center">
                  <div className="skill-circle mb-3 shadow-sm border" style={{ borderColor: `var(--bs-${skill.color}) !important` }}>
                    <h4 className={`fw-bold mb-0 text-${skill.color}`}>{skill.score}%</h4>
                  </div>
                  <div className={`text-${skill.color} mb-1`}>{skill.icon}</div>
                  <h6 className="fw-bold text-muted">{skill.name}</h6>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Detailed Feedback Section */}
        <Card className="border-0 shadow-sm mb-4 overflow-hidden">
          <Card.Header className="bg-white p-4 border-0">
            <h5 className="fw-bold mb-0">Detailed Question-wise Feedback</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {responses.map((f, idx) => (
              <div key={idx} className={`p-4 ${idx !== responses.length - 1 ? 'border-bottom' : ''}`}>
                <div className="d-flex mb-3">
                  <div className="flex-shrink-0 bg-primary bg-opacity-10 text-primary rounded-circle w-10 h-10 d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: '40px', height: '40px' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{f.question_text}</h5>
                    <p className="text-muted small mb-3">User Answer: <span className="fst-italic">"{f.answer_text}"</span></p>
                    
                    <Row>
                      <Col md={6} className="mb-2">
                        <div className="p-3 bg-success bg-opacity-10 rounded-3 h-100 border-start border-success border-4">
                          <h6 className="fw-bold text-success mb-2">What was good</h6>
                          <p className="small mb-0 text-dark opacity-75">{f.feedback_good}</p>
                        </div>
                      </Col>
                      <Col md={6} className="mb-2">
                        <div className="p-3 bg-warning bg-opacity-10 rounded-3 h-100 border-start border-warning border-4">
                          <h6 className="fw-bold text-warning mb-2">What to improve</h6>
                          <p className="small mb-0 text-dark opacity-75">{f.feedback_improve}</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Improvement Suggestions */}
        <Row className="mb-5">
          <Col lg={12}>
            <Card className="border-0 shadow-sm p-4 bg-white">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <Lightbulb className="text-warning me-2" /> Improvement Suggestions
              </h5>
              <Row>
                {[
                  "Practice speaking clearly by recording yourself and listening back.",
                  "Improve grammar by using tools like Grammarly and reading technical blogs.",
                  "Add specific quantitative examples in your answers (e.g., 'Optimized performance by 20%').",
                  "Increase answer length for behavioral questions to 1.5 - 2 minutes."
                ].map((tip, idx) => (
                  <Col md={6} key={idx} className="mb-3">
                    <div className="d-flex align-items-start bg-light p-3 rounded-3 h-100">
                      <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                        <TrendingUp size={16} className="text-primary" />
                      </div>
                      <p className="mb-0 small fw-medium">{tip}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-3 justify-content-center pt-3 border-top">
          <Button as={Link} to="/start-interview" variant="primary" size="lg" className="px-5 py-3 rounded-4 shadow-md fw-bold border-0">
            <RefreshCcw size={20} className="me-2" /> Retake Interview
          </Button>
          <Button as={Link} to="/dashboard" variant="outline-primary" size="lg" className="px-5 py-3 rounded-4 border-2 fw-bold">
            <LayoutDashboard size={20} className="me-2" /> Go to Dashboard
          </Button>
          <Button variant="dark" size="lg" className="px-5 py-3 rounded-4 shadow-md fw-bold border-0">
            <Download size={20} className="me-2" /> Download Report (PDF)
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Result;
