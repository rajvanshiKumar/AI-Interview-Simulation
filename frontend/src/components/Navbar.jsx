import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

const AppNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="glass-nav sticky-top py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary d-flex align-items-center">
          <span className="me-2">🤖</span> AI Interview Pro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="mx-2 fw-medium">Home</Nav.Link>
            
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="px-3 fw-medium d-flex align-items-center">
                  <LayoutDashboard size={18} className="me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link className="px-3 fw-medium d-flex align-items-center" onClick={handleLogout} style={{cursor: 'pointer'}}>
                  <LogOut size={18} className="me-1" /> Logout
                </Nav.Link>
                <div className="ms-3 d-none d-lg-block">
                  <div className="bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill d-flex align-items-center border border-primary border-opacity-25">
                    <User size={16} className="me-2" />
                    <span className="small fw-bold">Hello, {user.username}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="px-3 fw-medium d-flex align-items-center">
                  <LogIn size={18} className="me-1" /> Login
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="ms-lg-3 px-4 py-2 rounded-pill fw-bold shadow-sm"
                >
                  Sign Up Free
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
