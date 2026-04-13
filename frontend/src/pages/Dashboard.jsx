import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Award, Clock, ChevronRight } from 'lucide-react';
import { getDashboardData } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const iconMap = {
    Play: <Play className="text-primary" />,
    Award: <Award className="text-success" />,
    Clock: <Clock className="text-info" />,
    TrendingUp: <TrendingUp className="text-warning" />
  };

  if (loading) return <Loader />;

  return (
    <div className="py-5 bg-light min-vh-100">
      <Container>
        <div className="d-md-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">Welcome back, {data?.user?.username || 'User'}! 👋</h2>
            <p className="text-muted">Here's your interview preparation overview for {data?.user?.email}.</p>
          </div>
          <Button as={Link} to="/start-interview" className="btn-primary shadow-sm px-4 py-2">
            Start New Interview
          </Button>
        </div>

        {/* Stats Row */}
        {error && <div className="alert alert-danger shadow-sm mb-4">{error}</div>}
        
        <Row className="mb-5">
          {(data?.stats || []).map((stat, idx) => (
            <Col md={6} lg={3} key={idx} className="mb-4 mb-lg-0">
              <Card className="border-0 shadow-sm p-3 h-100">
                <Card.Body className="d-flex align-items-center p-0">
                  <div className={`${stat.color} bg-opacity-10 p-3 rounded-3 me-3`}>
                    {iconMap[stat.icon]}
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                    <p className="text-muted small mb-0">{stat.label}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {/* Recent Activity Table */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Interview History</h5>
                <Button variant="link" className="text-primary text-decoration-none p-0">View All</Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table borderless hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 text-muted fw-semi-bold">Role</th>
                        <th className="py-3 text-muted fw-semi-bold">Date</th>
                        <th className="py-3 text-muted fw-semi-bold">Score</th>
                        <th className="py-3 text-muted fw-semi-bold">Status</th>
                        <th className="px-4 py-3 text-muted fw-semi-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.recent_interviews || []).length > 0 ? (
                        data.recent_interviews.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 fw-medium">{item.role}</td>
                            <td className="py-3 text-muted">{item.date}</td>
                            <td className="py-3 fw-bold text-primary">{item.score}</td>
                            <td className="py-3">
                              <span className={`badge rounded-pill px-3 py-2 ${
                                item.status === 'Needs Practice' ? 'bg-danger bg-opacity-10 text-danger' : 
                                item.status === 'Excellent' ? 'bg-success bg-opacity-10 text-success' :
                                'bg-info bg-opacity-10 text-info'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="light" size="sm" className="rounded-circle">
                                <ChevronRight size={18} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            No interview history found. Start your first session!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Tips Section */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm bg-primary text-white p-4 h-100">
              <h5 className="fw-bold mb-4">Daily Interview Tip</h5>
              <p className="mb-4 opacity-75">
                "When answering behavioral questions, use the STAR method (Situation, Task, Action, Result) to provide structured and impactful responses."
              </p>
              <Button variant="light" className="text-primary fw-bold w-100 rounded-3 mt-auto">
                Read More Tips
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
