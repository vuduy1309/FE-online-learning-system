import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-3 py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-dark">
          <span style={{ color: "#5624d0" }}>Online</span> learning system
        </Navbar.Brand>
        <Form className="d-flex flex-grow-1 mx-3" style={{ maxWidth: "600px" }}>
          <FormControl
            type="search"
            placeholder="Find your next course by skill, topic, or instructor"
            className="rounded-pill px-4"
            style={{ border: "1px solid #ccc", height: "40px" }}
          />
        </Form>

        <Nav className="ms-auto align-items-center gap-3">
          <Nav.Link className="text-dark">About Us</Nav.Link>
          <Nav.Link className="text-dark">Course</Nav.Link>
          <Nav.Link className="text-dark">My Profile</Nav.Link>

          <i className="bi bi-heart"></i>
          <i className="bi bi-cart"></i>
          <i className="bi bi-bell"></i>
          <div className="position-relative" style={{ fontSize: "0.85rem" }}>
            <i className="bi bi-chat-dots" style={{ fontSize: "1rem" }}></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark"
              style={{
                fontSize: "0.55rem",
                padding: "2px 4px", 
                minWidth: "16px", 
                height: "16px",
                lineHeight: "12px",
              }}
            >
              3
            </span>
          </div>

          {user ? (
            <Dropdown align="end" show={show} onToggle={() => setShow(!show)}>
              <div
                onClick={() => setShow(!show)}
                className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {user.fullName?.[0]?.toUpperCase() || "U"}
              </div>

              <Dropdown.Menu>
                <Dropdown.ItemText>Hello, {user.fullName}</Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/profile">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link
              as={Link}
              to="/login"
              className="btn btn-outline-dark btn-sm"
            >
              Login
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
