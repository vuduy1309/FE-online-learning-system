import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "react-bootstrap";

const QuizAttemptList = () => {
  const { lessonId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/quizzes/${lessonId}/quiz-attempts`
        );
        if (res.data.success) {
          setAttempts(res.data.attempts);
        } else {
          setError(res.data.message || "Failed to load quiz attempts");
        }
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setError(err.response?.data?.message || "Failed to load quiz attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [lessonId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="bi bi-people-fill me-2"></i>
            Quiz Attempts
          </h2>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {attempts.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Quiz</th>
                      <th>Highest Score</th>
                      <th>Attempt Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt) => (
                      <tr key={attempt.AttemptID}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2"></i>
                            {attempt.StudentName}
                          </div>
                        </td>
                        <td>{attempt.QuizTitle}</td>
                        <td>
                          <span className="badge bg-primary">
                            {attempt.Score}/{attempt.TotalQuestions}
                          </span>
                        </td>
                        <td>
                          {new Date(attempt.AttemptDate).toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              attempt.Score === attempt.TotalQuestions
                                ? "success"
                                : attempt.Score >=
                                  Math.ceil(attempt.TotalQuestions * 0.5)
                                ? "warning"
                                : "danger"
                            }`}
                          >
                            {attempt.Score === attempt.TotalQuestions
                              ? "Excellent"
                              : attempt.Score >=
                                Math.ceil(attempt.TotalQuestions * 0.5)
                              ? "Passed"
                              : "Failed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i
                  className="bi bi-clipboard-x text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <p className="text-muted mt-3">
                  No quiz attempts found for this lesson.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizAttemptList;
