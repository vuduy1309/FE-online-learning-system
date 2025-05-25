import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Table, Badge, Accordion } from 'react-bootstrap';
import axiosInstance from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function ViewQuizHistoryPage() {
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axiosInstance.get(`/quizzes/${quizId}/user-history`);
        if (res.data.success) {
          setAttempts(res.data.data);
        } else {
          setError('Unable to load attempt history.');
        }
      } catch (err) {
        setError('Unable to load attempt history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [quizId]);

  return (
    <>
      <Header />
      <Container className="py-4">
        <h2 className="mb-4 text-center">Quiz Attempt History</h2>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Loading data...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : attempts.length === 0 ? (
          <Alert variant="info">You have no attempt history for this quiz.</Alert>
        ) : (
          <Accordion defaultActiveKey="0">
            {attempts.map((attempt, idx) => (
              <Accordion.Item eventKey={String(idx)} key={attempt.AttemptID}>
                <Accordion.Header>
                  <span className="fw-bold me-3">Attempt {idx + 1}</span>
                  <Badge bg="success" className="me-2">Score: {attempt.Score}</Badge>
                  <span className="text-muted">{new Date(attempt.AttemptDate).toLocaleString('en-US')}</span>
                </Accordion.Header>
                <Accordion.Body>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Selected Answer</th>
                        <th>Correct/Incorrect</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempt.answers.map((ans, i) => (
                        <tr key={i}>
                          <td>{ans.questionContent}</td>
                          <td>{ans.selectedOptionContent}</td>
                          <td>
                            {ans.isCorrect ? (
                              <Badge bg="success">Correct</Badge>
                            ) : (
                              <Badge bg="danger">Incorrect</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default ViewQuizHistoryPage;