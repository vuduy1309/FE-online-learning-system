import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function Footer() {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing! We will send new course updates to " + email);
    setEmail("");
  };

  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">About Us</h5>
            <p className="mb-0">
              Online Learning System provides high-quality programming courses to help you develop 
              coding skills anytime, anywhere with our team of professional developers and instructors.
            </p>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Courses</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Web Development</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">JavaScript</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Python</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">React</a></li>
              <li><a href="#" className="text-white text-decoration-none">View All</a></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Learning Guide</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">FAQ</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Policies</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5 className="fw-bold mb-3">Get New Course Updates</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>
        
        <div className="border-top pt-4">
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <small>&copy; {new Date().getFullYear()} Online Learning System. All rights reserved.</small>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <a href="#" className="text-white me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="bi bi-github"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-linkedin"></i>
              </a>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}