import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const UpdateQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axiosInstance.get(`/quizzes/id/${quizId}`);

        const parsedData = {
          ...data,
          Questions: data.Questions.map((q) => ({
            ...q,
            AnswerOptions: q.AnswerOptions.map((opt) => ({
              ...opt,
              IsCorrect:
                typeof opt.IsCorrect === "object" && opt.IsCorrect.data
                  ? opt.IsCorrect.data[0] === 1
                  : !!opt.IsCorrect,
            })),
          })),
        };

        setQuiz(parsedData);
      } catch (error) {
        console.error("Failed to load quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleTitleChange = (e) => {
    setQuiz({ ...quiz, Title: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.Questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, Questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...quiz.Questions];
    updatedQuestions[qIndex].AnswerOptions[oIndex][field] = value;
    setQuiz({ ...quiz, Questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      Questions: [
        ...quiz.Questions,
        {
          Content: "",
          ImageURL: "",
          AnswerOptions: [
            { Content: "", IsCorrect: false },
            { Content: "", IsCorrect: false },
            { Content: "", IsCorrect: false },
            { Content: "", IsCorrect: false },
          ],
        },
      ],
    });
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/quizzes/${quiz.QuizID}`, {
        Title: quiz.Title,
        Questions: quiz.Questions,
      });
      alert("Quiz updated successfully");
      navigate(-1);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update quiz");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!quiz) return <div className="container mt-4">Quiz not found</div>;

  return (
    <>
    <Header/>
    
    <div className="container mt-4">
      <h2 className="mb-4">Update Quiz</h2>

      <div className="mb-3">
        <label className="form-label fw-bold">Quiz Title</label>
        <input
          className="form-control"
          value={quiz.Title}
          onChange={handleTitleChange}
        />
      </div>

      {quiz.Questions.map((q, qIndex) => (
        <div key={qIndex} className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Question {qIndex + 1}</h5>

            <div className="mb-3">
              <label className="form-label">Content</label>
              <input
                className="form-control"
                value={q.Content}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "Content", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL (optional)</label>
              <input
                className="form-control"
                value={q.ImageURL || ""}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "ImageURL", e.target.value)
                }
              />
            </div>

            <div className="ms-3">
              {q.AnswerOptions.map((opt, oIndex) => (
                <div key={oIndex} className="mb-2 d-flex align-items-center">
                  <input
                    className="form-control me-2"
                    value={opt.Content}
                    placeholder={`Option ${oIndex + 1}`}
                    onChange={(e) =>
                      handleOptionChange(
                        qIndex,
                        oIndex,
                        "Content",
                        e.target.value
                      )
                    }
                  />
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={opt.IsCorrect}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "IsCorrect",
                          e.target.checked
                        )
                      }
                    />
                    <label className="form-check-label">Correct</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button onClick={addQuestion} className="btn btn-success me-2">
        Add Question
      </button>

      <button onClick={handleSubmit} className="btn btn-primary">
        Save Changes
      </button>
    </div>
    <Footer/>
    </>
  );
};

export default UpdateQuizPage;
