// src/pages/HomePage.js
import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <Container className="mt-5 mb-5">
        <h2 className="mb-4 text-center">Available Courses</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row>
            {courses.map(course => (
              <Col md={4} key={course.CourseID} className="mb-4">
                <Card className="h-100">
                  {course.ImageURL && (
                    <Card.Img
                      variant="top"
                      src={course.ImageURL}
                      alt={course.Title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{course.Title}</Card.Title>
                    <Card.Text>{course.Description}</Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${course.Price}
                    </Card.Text>
                    <Card.Text>
                      <strong>Rating:</strong>{" "}
                      {course.AverageRating ? course.AverageRating + " / 5" : "No rating yet"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
}
