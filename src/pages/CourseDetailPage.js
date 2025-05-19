import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Row,
  Col,
  Button,
  ListGroup,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post(
        "/cart/add",
        {
          courseId: course.CourseID,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Added to cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      const response = await axiosInstance.post(
        "/cart/buynow",
        {
          courseId: course.CourseID,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Redirect to confirmation page with the temporary cart ID
      if (response.data && response.data.cartId) {
        navigate(`/confirm-order?buyNow=true&cartId=${response.data.cartId}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-warning">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-warning">
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-muted">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <>
      <Header />
      <Container className="mt-4 mb-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2 text-muted">Loading course details...</p>
          </div>
        ) : course ? (
          <>
            {/* Course Header */}
            <div className="mb-4">
              <h1 className="display-5 mb-3">{course.Title}</h1>
              {course.ImageURL && (
                <img
                  src={course.ImageURL}
                  alt={course.Title}
                  className="img-fluid rounded shadow-sm"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <Row>
              <Col lg={8}>
                {/* Course Information */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Course Information
                    </h4>
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <div className="row">
                        <div className="col-sm-3">
                          <strong>Description:</strong>
                        </div>
                        <div className="col-sm-9">
                          {course.Description || "No description available"}
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="row align-items-center">
                        <div className="col-sm-3">
                          <strong>Price:</strong>
                        </div>
                        <div className="col-sm-9">
                          <span className="h4 text-success mb-0">
                            ${parseFloat(course.Price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="row">
                        <div className="col-sm-3">
                          <strong>Instructor:</strong>
                        </div>
                        <div className="col-sm-9">
                          <Badge bg="info" className="fs-6">
                            {course.InstructorName || "N/A"}
                          </Badge>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="row">
                        <div className="col-sm-3">
                          <strong>Content:</strong>
                        </div>
                        <div className="col-sm-9">
                          <Badge bg="secondary" className="me-2">
                            {course.LessonCount || 0} Lessons
                          </Badge>
                          <Badge bg="secondary">
                            {course.MaterialCount || 0} Materials
                          </Badge>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="row">
                        <div className="col-sm-3">
                          <strong>Enrolled:</strong>
                        </div>
                        <div className="col-sm-9">
                          <Badge bg="success">
                            {course.EnrollmentCount || 0} Students
                          </Badge>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="row align-items-center">
                        <div className="col-sm-3">
                          <strong>Rating:</strong>
                        </div>
                        <div className="col-sm-9">
                          {course.Rating ? (
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                {renderStars(parseFloat(course.Rating))}
                              </div>
                              <Badge bg="warning" text="dark">
                                {parseFloat(course.Rating).toFixed(1)} / 5
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted">No rating yet</span>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>

              <Col lg={4}>
                {/* Action Buttons */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <i className="bi bi-cart me-2"></i>
                      Purchase Options
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-3">
                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={handleAddToCart}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleBuyNow}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-lightning-fill me-2"></i>
                        Buy Now
                      </Button>
                      <Button
                        as={Link}
                        to={"/"}
                        variant="dark"
                        size="lg"
                        className="d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-house me-2"></i>
                        Back to Home
                      </Button>
                    </div>
                    <div className="text-center mt-3">
                      <h3 className="text-success mb-0">
                        ${parseFloat(course.Price).toFixed(2)}
                      </h3>
                      <small className="text-muted">One-time purchase</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Reviews Section */}
            <Card className="shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h4 className="mb-0">
                  <i className="bi bi-star me-2"></i>
                  Student Reviews ({course.reviews?.length || 0})
                  {course.reviews?.length > 0 && course.Rating && (
                    <span className="text-muted ms-2">
                      - Average: {parseFloat(course.Rating).toFixed(1)} ★
                    </span>
                  )}
                </h4>
              </Card.Header>
              <Card.Body>
                {!course.reviews || course.reviews.length === 0 ? (
                  <div className="text-center py-4">
                    <i
                      className="bi bi-chat-square-quote text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="text-muted mt-3 mb-0">
                      No reviews yet. Be the first to review this course!
                    </p>
                  </div>
                ) : (
                  <div className="reviews-container">
                    {course.reviews.map((review, index) => (
                      <Card key={index} className="mb-3 border-left-primary">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Col xs="auto">
                              <img
                                src={
                                  review.AvatarURL || "/api/placeholder/50/50"
                                }
                                alt={`${review.FullName}'s avatar`}
                                className="rounded-circle border"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            </Col>
                            <Col>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1 fw-bold">
                                    {review.FullName}
                                  </h6>
                                  <div className="d-flex align-items-center mb-2">
                                    <div className="me-2">
                                      {renderStars(review.Rating)}
                                    </div>
                                    <Badge bg="primary">
                                      {review.Rating} / 5
                                    </Badge>
                                  </div>
                                </div>
                                <small className="text-muted">
                                  <i className="bi bi-calendar3 me-1"></i>
                                  {new Date(
                                    review.ReviewDate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </small>
                              </div>

                              {review.Comment && (
                                <div className="mt-2">
                                  <blockquote className="blockquote-footer mb-0">
                                    <p className="mb-0 fst-italic">
                                      "{review.Comment}"
                                    </p>
                                  </blockquote>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        ) : (
          <div className="text-center py-5">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "3rem" }}
            ></i>
            <h3 className="mt-3">Course Not Found</h3>
            <p className="text-muted">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
}
