import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const QuizDetailPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/quizzes/${lessonId}`);
        setQuiz(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Unable to load quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!quiz) return null;

  return (
    <>
    <Header/>
    
    <div className="container mt-4">
      <h2>{quiz.Title}</h2>
      <p>Total questions: {quiz.Questions.length}</p>

      {quiz.Questions.length === 0 ? (
        <div className="alert alert-warning">No questions found.</div>
      ) : (
        <div className="mt-4">
          {quiz.Questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 p-3 border rounded">
              <h5>
                <strong>Câu {qIndex + 1}:</strong> {question.Content}
              </h5>

              {question.ImageURL && (
                <div className="text-center my-3">
                  <img
                    src={question.ImageURL}
                    alt="Question Illustration"
                    className="img-fluid"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}

              <ul className="list-group">
                {question.AnswerOptions.map((option, idx) => (
                  <li
                    key={idx}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      option.IsCorrect ? 'list-group-item-success' : ''
                    }`}
                  >
                    <span>
                      <strong>{String.fromCharCode(65 + idx)}.</strong> {option.Content}
                    </span>
                    {option.IsCorrect && (
                      <span role="img" aria-label="correct">
                        ✅
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="btn btn-secondary me-2">
          Back
        </button>
        <button onClick={() => navigate(`/update-quiz/${lessonId}`)} className="btn btn-primary">
          Edit Quiz
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default QuizDetailPage;
