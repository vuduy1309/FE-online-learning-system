import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ConfirmOrderPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [cartId, setCartId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCart = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const urlCartId = queryParams.get("cartId");

      const endpoint = urlCartId
        ? `/cart/checkout?cartId=${urlCartId}`
        : "/cart/checkout";

      const res = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCartItems(res.data.items);
      setTotalPrice(res.data.totalPrice);
      setCartId(res.data.cartId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [location.search]);

  const handleConfirm = async () => {
    try {
      await axiosInstance.post(
        "/orders/confirm",
        { paymentMethod, cartId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Order confirmed successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm order");
    }
  };

  const paymentOptions = [
    { value: "VNPay", label: "VNPay", icon: "💳" },
    { value: "Momo", label: "Momo", icon: "📱" },
    { value: "Internet Banking", label: "Internet Banking", icon: "🏦" },
  ];

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="d-flex align-items-center mb-4">
              <h2 className="mb-0">Order Confirmation</h2>
            </div>

            {loading ? (
              <Card className="text-center py-5">
                <Card.Body>
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Loading order details...</p>
                </Card.Body>
              </Card>
            ) : error ? (
              <Alert variant="danger" className="text-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            ) : (
              <>
                {/* Order Items */}
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <h5 className="mb-0">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Order Items ({cartItems.length})
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table className="mb-0">
                        <tbody>
                          {cartItems.map((item, index) => (
                            <tr key={item.CartItemID} className={index !== cartItems.length - 1 ? 'border-bottom' : ''}>
                              <td className="py-3 ps-3" width="15%">
                                <Image
                                  src={item.ImageURL || "/api/placeholder/80/80"}
                                  alt={item.Title}
                                  width={80}
                                  height={80}
                                  className="rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                              </td>
                              <td className="py-3" width="55%">
                                <h6 className="mb-1 fw-semibold">{item.Title}</h6>
                                {item.Description && (
                                  <p className="text-muted mb-0 small">
                                    {item.Description.length > 120
                                      ? `${item.Description.substring(0, 120)}...`
                                      : item.Description}
                                  </p>
                                )}
                              </td>
                              <td className="py-3 text-end pe-3" width="30%">
                                <span className="fw-semibold text-primary fs-5">
                                  ${parseFloat(item.Price).toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>

                {/* Payment & Summary */}
                <Row>
                  <Col md={7}>
                    <Card className="shadow-sm">
                      <Card.Header className="bg-light border-0 py-3">
                        <h5 className="mb-0">
                          <i className="fas fa-credit-card me-2"></i>
                          Payment Method
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label className="fw-semibold mb-3">
                            Select your preferred payment method:
                          </Form.Label>
                          {paymentOptions.map((option) => (
                            <div key={option.value} className="mb-2">
                              <Form.Check
                                type="radio"
                                id={option.value}
                                name="paymentMethod"
                                value={option.value}
                                checked={paymentMethod === option.value}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                label={
                                  <span className="d-flex align-items-center">
                                    <span className="me-2">{option.icon}</span>
                                    <span>{option.label}</span>
                                  </span>
                                }
                                className="p-3 border rounded bg-light"
                              />
                            </div>
                          ))}
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={5}>
                    <Card className="shadow-sm">
                      <Card.Header className="bg-light border-0 py-3">
                        <h5 className="mb-0">
                          <i className="fas fa-receipt me-2"></i>
                          Order Summary
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal ({cartItems.length} items):</span>
                          <span>${parseFloat(totalPrice).toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax:</span>
                          <span>$0.00</span>
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
                            variant="primary"
                            size="lg"
                            onClick={handleConfirm}
                            className="fw-semibold"
                          >
                            <i className="fas fa-check me-2"></i>
                            Confirm Order
                          </Button>
                          <Button
                            as={Link}
                            to="/cart/view"
                            variant="outline-secondary"
                            className="fw-semibold"
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Security Note */}
                    <Alert variant="info" className="mt-3">
                      <small>
                        <i className="fas fa-shield-alt me-2"></i>
                        Your payment information is secure and encrypted.
                      </small>
                    </Alert>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}