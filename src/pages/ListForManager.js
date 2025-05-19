import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spinner,
  Image,
  Container,
  Card,
  Badge,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function ListForManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses/listCourse");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = async (courseId, courseTitle) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/feedback`);
      setSelectedFeedback(res.data);
      setSelectedCourseTitle(courseTitle);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading feedback:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-warning"></i>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-warning"></i>
      );
    }
    return stars;
  };

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Course Management</h2>
                <p className="text-muted mb-0">
                  Manage all courses in the system ({courses.length} total)
                </p>
              </div>
              <Button
                as={Link}
                to="/courses/create"
                variant="primary"
                className="fw-semibold"
              >
                Create New Course
              </Button>
            </div>
          </Col>
        </Row>

        {loading ? (
          <Card className="text-center py-5">
            <Card.Body>
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading courses...</p>
            </Card.Body>
          </Card>
        ) : courses.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="fas fa-book fa-4x text-muted mb-3"></i>
              <h4 className="text-muted">No courses found</h4>
              <p className="text-muted mb-4">
                Start by creating your first course
              </p>
              <Button as={Link} to="/courses/create" variant="primary">
                Create Course
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0" hover>
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3 ps-4">Course</th>
                      <th className="border-0 py-3">Instructor</th>
                      <th className="border-0 py-3 text-center">Statistics</th>
                      <th className="border-0 py-3 text-center">Performance</th>
                      <th className="border-0 py-3 text-center pe-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr
                        key={course.CourseID}
                        className={
                          index !== courses.length - 1 ? "border-bottom" : ""
                        }
                      >
                        <td className="py-3 ps-4">
                          <div>
                            <h6 className="mb-1 fw-semibold">{course.Title}</h6>
                            <p
                              className="text-muted mb-2 small"
                              style={{ maxWidth: "300px" }}
                            >
                              {course.Description.length > 100
                                ? `${course.Description.substring(0, 100)}...`
                                : course.Description}
                            </p>
                            <span className="badge bg-primary">
                              ${course.Price}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="fw-semibold">
                            {course.InstructorName || "Not assigned"}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="d-flex flex-column align-items-center gap-1">
                            <div>
                              <i className="fas fa-users me-1 text-muted"></i>
                              <span className="fw-semibold">
                                {course.EnrollmentCount}
                              </span>
                              <small className="text-muted ms-1">
                                enrollments
                              </small>
                            </div>
                            <div>
                              <i className="fas fa-play me-1 text-muted"></i>
                              <span className="fw-semibold">
                                {course.LessonCount}
                              </span>
                              <small className="text-muted ms-1">lessons</small>
                            </div>
                            <div>
                              <i className="fas fa-file-alt me-1 text-muted"></i>
                              <span className="fw-semibold">
                                {course.MaterialCount}
                              </span>
                              <small className="text-muted ms-1">
                                materials
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {course.Rating ? (
                            <div>
                              <div className="mb-1">
                                {renderStars(course.Rating)}
                              </div>
                              <span className="fw-semibold">
                                {course.Rating}
                              </span>
                              <small className="text-muted">/5</small>
                            </div>
                          ) : (
                            <span className="text-muted">No ratings yet</span>
                          )}
                        </td>
                        <td className="py-3 text-center pe-4">
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() =>
                                handleViewFeedback(
                                  course.CourseID,
                                  course.Title
                                )
                              }
                              title="View feedback"
                            >
                              View Feedback
                            </Button>
                            <Button
                              as={Link}
                              to={`/courses/update/${course.CourseID}`}
                              variant="outline-primary"
                              size="sm"
                              title="Edit course"
                            >
                              Update
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Feedback Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <i className="fas fa-comments me-2"></i>
              Feedback for "{selectedCourseTitle}"
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            {selectedFeedback.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No feedback yet</h5>
                <p className="text-muted">
                  This course hasn't received any reviews.
                </p>
              </div>
            ) : (
              <div className="p-3">
                {selectedFeedback.map((fb, index) => (
                  <div
                    key={index}
                    className={`d-flex p-3 ${
                      index !== selectedFeedback.length - 1
                        ? "border-bottom"
                        : ""
                    }`}
                  >
                    <Image
                      src={fb.AvatarURL || "/api/placeholder/48/48"}
                      roundedCircle
                      width={48}
                      height={48}
                      className="me-3 flex-shrink-0"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong className="d-block">{fb.FullName}</strong>
                          <small className="text-muted">
                            {new Date(fb.ReviewDate).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          {renderStars(fb.Rating)}
                          <span className="ms-2 fw-semibold">
                            {fb.Rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="mb-0">{fb.Comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Footer />
    </>
  );
}
