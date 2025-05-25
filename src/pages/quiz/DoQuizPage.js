import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DoQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/quizzes/${quizId}/view`);
        if (res.data.success) {
          setQuiz(res.data.data);
        } else {
          setError(res.data.message || 'Failed to load quiz.');
        }
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleSelect = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      // Prepare answers in the format: [{ questionId, selectedOptionId }]
      const answerArr = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: Number(questionId),
        selectedOptionId
      }));
      const res = await axiosInstance.post(`/quizzes/${quizId}/take`, { answers: answerArr });
      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setResult({ error: res.data.message || 'Failed to submit quiz.' });
      }
    } catch (err) {
      setResult({ error: 'Failed to submit quiz.' });
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return (
    <>
      <Header />
      <div className="container py-4">
        <div className="alert alert-warning text-center">
          <h4 className="mb-3">Quiz is not available</h4>
          <p>This quiz does not have any questions yet. Please contact your instructor for support.</p>
        </div>
        <div className="text-center">
          <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>&larr; Back</button>
        </div>
      </div>
      <Footer />
    </>
  );
  if (!quiz) return null;

  return (
    <>
      <Header />
      <div className="container py-4">
        <button className="btn btn-secondary mb-3" type="button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h2 className="mb-4">{quiz.title}</h2>
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((q, idx) => (
            <div key={q.questionId} className="mb-4 p-3 border rounded">
              <h5>
                <strong>Question {idx + 1}:</strong> {q.content}
              </h5>
              {q.imageUrl && (
                <div className="text-center my-3">
                  <img src={q.imageUrl} alt="Question" className="img-fluid" style={{ maxHeight: '200px' }} />
                </div>
              )}
              <ul className="list-group">
                {q.options.map((opt, oidx) => (
                  <li key={opt.optionId} className="list-group-item">
                    <label className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name={`question_${q.questionId}`}
                        value={opt.optionId}
                        checked={answers[q.questionId] === opt.optionId}
                        onChange={() => handleSelect(q.questionId, opt.optionId)}
                        disabled={submitted}
                      />
                      <span><strong>{String.fromCharCode(65 + oidx)}.</strong> {opt.content}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!submitted ? (
            <button type="submit" className="btn btn-primary">Submit</button>
          ) : (
            result && !result.error ? (
              <div className="alert alert-success mt-4">
                <h5>Quiz submitted!</h5>
                <div>Score: <strong>{result.score?.toFixed(2) ?? 0}%</strong></div>
                <div>Correct Answers: <strong>{result.correctAnswers} / {result.totalQuestions}</strong></div>
              </div>
            ) : (
              <div className="alert alert-danger mt-4">{result?.error || 'Quiz submitted! (You can implement grading logic here.)'}</div>
            )
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default DoQuizPage;
