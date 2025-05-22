import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  CloseButton,
} from "react-bootstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AddQuizPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
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
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
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
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].AnswerOptions[oIndex][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/quizzes", {
        LessonID: lessonId,
        Title: title,
        Questions: questions,
      });
      alert("Quiz created successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  return (
    <>
    <Header/>
    <Container className="my-4">
      <h2 className="mb-4">Add Quiz</h2>

      <Form.Group className="mb-3">
        <Form.Label>Quiz Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      {questions.map((q, qIndex) => (
        <Card key={qIndex} className="mb-3 position-relative">
          <Card.Body>
            <CloseButton
              onClick={() => handleRemoveQuestion(qIndex)}
              className="position-absolute top-0 end-0 m-2"
              title="Remove question"
            />
            <Form.Group>
              <Form.Label>Question {qIndex + 1}</Form.Label>
              <Form.Control
                type="text"
                value={q.Content}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "Content", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Control
                type="text"
                placeholder="Image URL (optional)"
                value={q.ImageURL}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "ImageURL", e.target.value)
                }
              />
            </Form.Group>
            <Row className="mt-3">
              {q.AnswerOptions.map((opt, oIndex) => (
                <Col md={6} key={oIndex} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt.Content}
                    onChange={(e) =>
                      handleOptionChange(
                        qIndex,
                        oIndex,
                        "Content",
                        e.target.value
                      )
                    }
                  />
                  <Form.Check
                    type="checkbox"
                    label="Correct"
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
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      ))}

      <div className="mb-3">
        <Button variant="success" className="me-2" onClick={handleAddQuestion}>
          Add Question
        </Button>
        <Button variant="primary" className="me-2" onClick={handleSubmit}>
          Save Quiz
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </Container>
    <Footer/>
    </>
  );
};

export default AddQuizPage;
