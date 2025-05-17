import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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

            <h4 className="mt-4">Reviews</h4>
            {course.reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              course.reviews.map((review, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={review.Avatar || "/default-avatar.png"}
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
                    <Card.Text><strong>Rating :</strong> {review.Rating} / 5</Card.Text>
                    <Card.Text>
                      <strong>Review Date :</strong> {new Date(review.ReviewDate).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text><strong>Comment :</strong> <br/>{review.Comment}</Card.Text>
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
