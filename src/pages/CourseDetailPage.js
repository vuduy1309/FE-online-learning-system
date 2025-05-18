import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, Spinner, Row, Col, Button } from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
          userId: user.id,
          courseId: course.CourseID,
          price: course.Price,
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
      await axiosInstance.post(
        "/cart/buynow",
        {
          userId: user.id, // <-- thêm dòng này
          courseId: course.CourseID,
          price: course.Price,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Purchase successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5 mb-5">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : course ? (
          <>
            <h2>{course.Title}</h2>
            {course.ImageURL && (
              <img
                src={course.ImageURL}
                alt={course.Title}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              />
            )}
            <p className="mt-3">
              <strong>Description:</strong> {course.Description}
            </p>
            <p>
              <strong>Price:</strong> ${course.Price}
            </p>
            <p>
              <strong>Instructor:</strong> {course.InstructorName || "N/A"}
            </p>
            <p>
              <strong>Lessons:</strong> {course.LessonCount || 0}
            </p>
            <p>
              <strong>Materials:</strong> {course.MaterialCount || 0}
            </p>
            <p>
              <strong>Enrolled:</strong> {course.EnrollmentCount || 0} students
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              {course.Rating ? `${course.Rating} / 5` : "No rating yet"}
            </p>
            <Row className="my-4">
              <Col md={2}>
                <Button
                  variant="dark"
                  className="me-2"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Col>
              <Col md={2}>
                <Button variant="primary" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </Col>
            </Row>

            <h4 className="mt-4">Reviews</h4>
            {course.reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              course.reviews.map((review, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={review.AvatarURL || "/default-avatar.png"}
                        alt="avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "12px",
                        }}
                      />
                      <div>
                        <strong>{review.FullName}</strong>
                      </div>
                    </div>
                    <Card.Text>
                      <strong>Rating:</strong> {review.Rating} / 5
                    </Card.Text>
                    <Card.Text>
                      <strong>Review Date:</strong>{" "}
                      {new Date(review.ReviewDate).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Comment:</strong> <br />
                      {review.Comment}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </>
        ) : (
          <p>Course not found</p>
        )}
      </Container>
      <Footer />
    </>
  );
}
