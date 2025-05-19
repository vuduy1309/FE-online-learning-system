import { Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCourseContext } from "../context/CourseContext";
import Image from "./Image";

export default function CourseList() {
  const {
    loading,
    error,
    currentCourses,
    filteredCourses,
    indexOfFirstCourse,
    indexOfLastCourse,
    handleResetFilters
  } = useCourseContext();

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <h4 className="text-danger">{error}</h4>
        <Button variant="primary" onClick={handleResetFilters} className="mt-3">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>No courses found that match your criteria</h4>
        <Button variant="primary" className="mt-3" onClick={handleResetFilters}>
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-muted mb-3">
        Showing {indexOfFirstCourse + 1} - {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
      </p>
      
      <Row className="g-4">
        {currentCourses.map((course) => (
          <Col md={6} lg={4} key={course.CourseID} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Image
                src={course.ImageURL}
                alt={course.Title}
                fallbackSrc="https://via.placeholder.com/300x160?text=No+Image"
                style={{ height: "160px", objectFit: "cover" }}
                className="card-img-top"
              />
              <Card.Body>
                <Card.Title>
                  <Link to={`/courses/${course.CourseID}`} className="text-decoration-none">
                    {course.Title}
                  </Link>
                </Card.Title>
                <Card.Text className="text-muted small">
                  {course.Description?.length > 80
                    ? `${course.Description.substring(0, 80)}...`
                    : course.Description}
                </Card.Text>
                {course.InstructorName && (
                  <Card.Text className="text-muted small mb-0">
                    <i className="bi bi-person-circle me-1"></i>
                    Instructor: {course.InstructorName}
                  </Card.Text>
                )}
              </Card.Body>
              <Card.Footer className="bg-white">
                <Row>
                  <Col>
                    <strong className="text-success">${parseFloat(course.Price).toFixed(2)}</strong>
                  </Col>
                  <Col className="text-end">
                    <span className="badge bg-warning text-dark">
                      {course.AverageRating
                        ? `★ ${parseFloat(course.AverageRating).toFixed(1)}/5`
                        : "No rating"}
                    </span>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}