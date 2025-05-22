import { Container, Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { FaBell, FaHeart, FaShoppingCart } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

export default function Header() {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const iconStyle = {
    fontSize: "20px",
    color: "#6c757d",
    cursor: "pointer",
    transition: "color 0.2s ease",
  };

  const iconHoverStyle = {
    color: "#495057",
  };

  const renderRoleBasedNav = () => {
    if (!user) return null;

    switch (user.roleId) {
      case 1:
        return (
          <Nav.Link
            as={Link}
            to="/dashboard"
            className="text-dark fw-medium me-3"
          >
            Dashboard
          </Nav.Link>
        );
      case 2:
        return (
          <Nav.Link
            as={Link}
            to="/courses/listCourse"
            className="text-dark fw-medium me-3"
          >
            Manage Courses
          </Nav.Link>
        );
      case 3:
        return (
          <>
            <Nav.Link
              as={Link}
              to="/courses/instructorCourses"
              className="text-dark fw-medium me-3"
            >
              View List Course
            </Nav.Link>
          </>
        );
      case 5:
        return (
          <Nav.Link
            as={Link}
            to="/complaints/list"
            className="text-dark fw-medium me-3"
          >
            View List Khiếu Nại
          </Nav.Link>
        );
      default:
        return (
          <Nav.Link
            as={Link}
            to="/courses"
            className="text-dark fw-medium me-3"
          >
            Courses
          </Nav.Link>
        );
    }
  };

  return (
    <Navbar bg="white" className="shadow-sm border-bottom">
      <Container className="px-4">
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4 text-decoration-none"
        >
          <span style={{ color: "#5624d0" }}>EduPlatform</span>
          <small className="text-muted ms-2 fw-normal d-none d-md-inline">
            Online Learning
          </small>
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2">
          <Nav.Link
            as={Link}
            to="/"
            className="text-dark fw-medium d-none me-3 d-lg-block"
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/about"
            className="text-dark fw-medium d-none me-3 d-lg-block"
          >
            About
          </Nav.Link>
          {renderRoleBasedNav()}
          <Nav.Link
            as={Link}
            to="/support"
            className="text-dark fw-medium d-none  d-lg-block"
          >
            Support
          </Nav.Link>
        </div>

        <Nav className=" d-flex align-items-center">
          <div className="d-flex align-items-center gap-3 me-3">
            <Link
              to="/wishlist"
              className="text-decoration-none position-relative"
              title="Wishlist"
            >
              <FaHeart
                style={iconStyle}
                onMouseOver={(e) =>
                  (e.target.style.color = iconHoverStyle.color)
                }
                onMouseOut={(e) => (e.target.style.color = iconStyle.color)}
              />
            </Link>

            <Link
              to="/cart/view"
              className="text-decoration-none position-relative"
              title="Shopping Cart"
            >
              <FaShoppingCart
                style={iconStyle}
                onMouseOver={(e) =>
                  (e.target.style.color = iconHoverStyle.color)
                }
                onMouseOut={(e) => (e.target.style.color = iconStyle.color)}
              />
              {cartItemsCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "10px",
                    padding: "3px 6px",
                    minWidth: "18px",
                    height: "18px",
                    lineHeight: "12px",
                  }}
                >
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            <div className="position-relative" title="Notifications">
              <FaBell
                style={iconStyle}
                onMouseOver={(e) =>
                  (e.target.style.color = iconHoverStyle.color)
                }
                onMouseOut={(e) => (e.target.style.color = iconStyle.color)}
              />
              <span
                className="position-absolute top-0 start-100 translate-middle bg-warning rounded-circle"
                style={{
                  width: "8px",
                  height: "8px",
                }}
              ></span>
            </div>

            <div className="position-relative" title="Messages">
              <FaMessage
                style={iconStyle}
                onMouseOver={(e) =>
                  (e.target.style.color = iconHoverStyle.color)
                }
                onMouseOut={(e) => (e.target.style.color = iconStyle.color)}
              />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                style={{
                  fontSize: "10px",
                  padding: "3px 6px",
                  minWidth: "18px",
                  height: "18px",
                  lineHeight: "12px",
                }}
              >
                3
              </span>
            </div>
          </div>

          {user ? (
            <Dropdown align="end" show={show} onToggle={() => setShow(!show)}>
              <div
                onClick={() => setShow(!show)}
                className="d-flex align-items-center cursor-pointer"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
                  style={{
                    width: "36px",
                    height: "36px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {user.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="d-none d-md-block">
                  <div
                    className="text-dark fw-medium"
                    style={{ fontSize: "14px" }}
                  >
                    {user.fullName || "User"}
                  </div>
                  <small className="text-muted">
                    {user.roleId === 1 && "Admin"}
                    {user.roleId === 2 && "Manager"}
                    {user.roleId === 3 && "Instructor"}
                    {user.roleId === 5 && "Support"}
                    {![1, 2, 3, 5].includes(user.roleId) && "Student"}
                  </small>
                </div>
                <i
                  className="fas fa-chevron-down ms-2 text-muted"
                  style={{ fontSize: "12px" }}
                ></i>
              </div>

              <Dropdown.Menu className="shadow-sm border-0 mt-2">
                <Dropdown.ItemText className="px-3 py-2 border-bottom">
                  <div className="fw-semibold">{user.fullName}</div>
                  <small className="text-muted">{user.email}</small>
                </Dropdown.ItemText>
                <Dropdown.Item as={Link} to="/profile" className="py-2">
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/my-courses" className="py-2">
                  <i className="fas fa-graduation-cap me-2"></i>
                  My Courses
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings" className="py-2">
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} as={Link} to="/" className="py-2 text-danger">
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div className="d-flex gap-2">
              <Button
                as={Link}
                to="/login"
                variant="outline-primary"
                className="fw-medium"
                style={{ fontSize: "14px" }}
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="primary"
                className="fw-medium d-none d-sm-block"
                style={{ fontSize: "14px" }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
