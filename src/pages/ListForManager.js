import { useEffect, useState } from "react";
import { Table, Button, Modal, Spinner, Image } from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function ListForManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewFeedback = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/feedback`);
      setSelectedFeedback(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading feedback:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4">
        <h2 className="mb-4 text-center">All Courses</h2>
        <Button className="mb-3">
          <Link to={`/courses/create`} className="text-white">
            Create New Course
          </Link>
        </Button>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Enrolls</th>
                <th>Lessons</th>
                <th>Materials</th>
                <th>Instructor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.CourseID}>
                  <td>{course.Title}</td>
                  <td>{course.Description}</td>
                  <td>${course.Price}</td>
                  <td>{course.Rating || "N/A"}</td>
                  <td>{course.EnrollmentCount}</td>
                  <td>{course.LessonCount}</td>
                  <td>{course.MaterialCount}</td>
                  <td>{course.InstructorName || "N/A"}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewFeedback(course.CourseID)}
                      >
                        View Feedback
                      </Button>
                      <Button variant="outline-dark" size="sm">
                        <Link to={`/courses/update/${course.CourseID}`}>
                          Update
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Course Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFeedback.length === 0 ? (
              <p>No feedback available.</p>
            ) : (
              selectedFeedback.map((fb, index) => (
                <div key={index} className="d-flex mb-3">
                  <Image
                    src={fb.AvatarURL || "/default-avatar.png"}
                    roundedCircle
                    width={48}
                    height={48}
                    className="me-3"
                  />
                  <div>
                    <strong>{fb.FullName}</strong>
                    <br />
                    <small>
                      {new Date(fb.ReviewDate).toLocaleDateString()} - Rating:{" "}
                      {fb.Rating}/5
                    </small>
                    <p>{fb.Comment}</p>
                  </div>
                </div>
              ))
            )}
          </Modal.Body>
        </Modal>
      </div>
      <Footer />
    </>
  );
}
