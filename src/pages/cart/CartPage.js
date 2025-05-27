import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import CartImage from "../../components/image/CartImage";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/cart/view", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(res.data.items);
      setTotalPrice(res.data.totalPrice);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (courseId) => {
    // Đổi tham số từ cartItemId thành courseId
    try {
      await axiosInstance.post(
        `/cart/remove`,
        { courseId }, // Thêm courseId vào request body
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Item removed successfully");
      fetchCart();
      fetchCartCount();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  return (
    <>
      <Header />
      <Container className="py-5">
        <div className="d-flex align-items-center mb-4">
          <h2 className="mb-0 me-3">Shopping Cart</h2>
          {cartItems.length > 0 && (
            <span className="badge bg-secondary">{cartItems.length} items</span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading your cart...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        ) : cartItems.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <div className="mb-4">
                <i className="fas fa-shopping-cart fa-4x text-muted"></i>
              </div>
              <h4 className="text-muted mb-3">Your cart is empty</h4>
              <p className="text-muted mb-4">
                Looks like you haven't added any courses yet.
              </p>
              <Button as={Link} to="/" variant="primary" size="lg">
                <i className="fas fa-book me-2"></i>
                Browse Courses
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row className="mt-4">
              <Col md={8}>
                <Card className="shadow-sm">
                  <Card.Body className="p-0">
                    <Table responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0 py-3 ps-4">Course</th>
                          <th className="border-0 py-3">Description</th>
                          <th className="border-0 py-3 text-end">Price</th>
                          <th className="border-0 py-3 text-center pe-4">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, index) => (
                          <tr
                            key={item.CartItemID}
                            className={
                              index !== cartItems.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            <td className="py-3 ps-4">
                              <div className="d-flex align-items-center">
                                <CartImage
                                  src={item.ImageURL}
                                  alt={item.Title}
                                  fallbackSrc="https://via.placeholder.com/80x80?text=No+Image"
                                  width={80}
                                  height={80}
                                  className="rounded me-3 flex-shrink-0"
                                  style={{ objectFit: "cover" }}
                                />
                                <div>
                                  <h6 className="mb-1 fw-semibold">
                                    <Link
                                      to={`/courses/${item.CourseID}`}
                                      className="text-decoration-none fw-bold"
                                    >
                                      {item.Title}
                                    </Link>
                                  </h6>
                                  <small className="text-muted">Course</small>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <p
                                className="mb-0 text-muted"
                                style={{ maxWidth: "300px" }}
                              >
                                {item.Description}
                              </p>
                            </td>
                            <td className="py-3 text-end">
                              <span className="fw-semibold fs-5 text-primary">
                                ${parseFloat(item.Price).toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 text-center pe-4">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemove(item.CourseID)} // Đổi từ CartItemID thành CourseID
                                className="btn-sm"
                              >
                                <i className="fas fa-trash me-1"></i>
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({cartItems.length} items):</span>
                      <span>${parseFloat(totalPrice).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong className="text-primary fs-4">
                        ${parseFloat(totalPrice).toFixed(2)}
                      </strong>
                    </div>
                    <div className="d-grid gap-2">
                      <Button
                        as={Link}
                        to="/checkout"
                        variant="primary"
                        size="lg"
                        className="fw-semibold"
                      >
                        <i className="fas fa-credit-card me-2"></i>
                        Proceed to Checkout
                      </Button>
                      <Button
                        as={Link}
                        to="/"
                        variant="outline-secondary"
                        className="fw-semibold"
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Continue Shopping
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}
