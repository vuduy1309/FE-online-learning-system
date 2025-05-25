import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Card, Modal } from "react-bootstrap";
import axiosInstance from "../../api/axios";

function ViewQuizStatsModal({ show, onHide, lessonId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizStats, setQuizStats] = useState([]);

  useEffect(() => {
    if (!show) return;
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.get(`/quizzes/${lessonId}/quiz-scores`);
        if (res.data.success) {
          setQuizStats(res.data.data);
        } else {
          setError("Failed to load quiz stats.");
        }
      } catch (err) {
        setError("Failed to load quiz stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [lessonId, show]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quiz Statistics for Lesson</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Loading data...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : quizStats.length === 0 ? (
          <Alert variant="info">
            No quiz statistics available for this lesson.
          </Alert>
        ) : (
          <Card>
            <Card.Body>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Quiz Title</th>
                    <th>Best Score</th>
                    <th>Latest Score</th>
                  </tr>
                </thead>
                <tbody>
                  {quizStats.map((q, idx) => (
                    <tr key={q.quizId}>
                      <td>{idx + 1}</td>
                      <td>{q.title}</td>
                      <td>{q.bestScore !== null ? q.bestScore : "-"}</td>
                      <td>{q.latestScore !== null ? q.latestScore : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ViewQuizStatsModal;
