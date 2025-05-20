import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LessonDetails = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMaterials, setEditingMaterials] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    MaterialType: "",
    URL: "",
  });

  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editedLesson, setEditedLesson] = useState({
    Title: "",
    Introduction: "",
    Content: "",
    Example: "",
    OrderNumber: 1,
  });
  
  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(
          `/courses/${courseId}/lessons/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setLesson(res.data.lesson);
          setEditedLesson({
            Title: res.data.lesson.Title || "",
            Introduction: res.data.lesson.Introduction || "",
            Content: res.data.lesson.Content || "",
            Example: res.data.lesson.Example || "",
            OrderNumber: res.data.lesson.OrderNumber || 1,
          });
          setMaterials(res.data.materials);
          setQuizzes(res.data.quizzes);
        } else {
          setError("Failed to load lesson details.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [courseId, lessonId]);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        `/courses/${courseId}/lessons/${lessonId}/materials`,
        newMaterial,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setMaterials([...materials, res.data.material]);
        setNewMaterial({ MaterialType: "", URL: "", Description: "" });
        setEditingMaterials(false);
      }
    } catch (err) {
      console.error("Error adding material:", err);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(
        `/courses/${courseId}/lessons/${lessonId}/materials/${materialId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMaterials(materials.filter((mat) => mat.MaterialID !== materialId));
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/courses/${courseId}/lessons/quizzes/${lessonId}`);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(
        `/courses/${courseId}/lessons/${lessonId}`,
        editedLesson,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setLesson(res.data.updatedLesson);
        setIsEditingLesson(false);
      } else {
        alert("Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Error updating lesson:", err);
      alert("An error occurred while updating lesson.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5 d-flex justify-content-center">
          <div className="text-center">
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading lesson details...</p>
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
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle me-2"></i>
                <div>{error}</div>
              </div>
              <div className="text-center">
                <Link
                  to={`/instructor/courses/${courseId}`}
                  className="btn btn-primary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Course
                </Link>
              </div>
            </div>
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
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link
                to="/courses/instructorCourses"
                className="text-decoration-none"
              >
                <i className="bi bi-house me-1"></i>Courses
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link
                to={`/courses/${courseId}/lessons`}
                className="text-decoration-none"
              >
                Course Details
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {lesson?.Title}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <div className="mb-4">
          <Link
            to={`/courses/${courseId}/lessons`}
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-left me-2"></i>Back to Lessons
          </Link>
        </div>

        {/* Lesson Content Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 className="card-title mb-0">
              <i className="bi bi-book me-2"></i>
              {lesson.Title}
            </h2>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setIsEditingLesson(!isEditingLesson)}
            >
              <i
                className={`bi ${isEditingLesson ? "bi-x" : "bi-pencil"} me-1`}
              ></i>
              {isEditingLesson ? "Cancel" : "Edit Lesson"}
            </button>
          </div>

          <div className="card-body">
            {isEditingLesson && (
              <form
                onSubmit={handleUpdateLesson}
                className="card card-body shadow-sm mb-4 border border-primary"
              >
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedLesson.Title}
                    onChange={(e) =>
                      setEditedLesson({
                        ...editedLesson,
                        Title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Introduction</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={editedLesson.Introduction}
                    onChange={(e) =>
                      setEditedLesson({
                        ...editedLesson,
                        Introduction: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content (HTML allowed)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={editedLesson.Content}
                    onChange={(e) =>
                      setEditedLesson({
                        ...editedLesson,
                        Content: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Example</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={editedLesson.Example}
                    onChange={(e) =>
                      setEditedLesson({
                        ...editedLesson,
                        Example: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Order Number</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editedLesson.OrderNumber}
                    onChange={(e) =>
                      setEditedLesson({
                        ...editedLesson,
                        OrderNumber: parseInt(e.target.value),
                      })
                    }
                    required
                    min="1"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-save me-2"></i>Save Changes
                </button>
              </form>
            )}
          </div>
          <div className="card-body">
            {lesson.Introduction && (
              <div className="mb-4">
                <h5 className="text-primary">
                  <i className="bi bi-info-circle me-2"></i>Introduction
                </h5>
                <p className="text-muted">{lesson.Introduction}</p>
              </div>
            )}

            <div className="mb-4">
              <h5 className="text-primary">
                <i className="bi bi-file-text me-2"></i>Content
              </h5>
              <div
                className="lesson-content border rounded p-3 bg-light"
                dangerouslySetInnerHTML={{ __html: lesson.Content }}
              />
            </div>

            {lesson.Example && (
              <div className="mb-4">
                <h5 className="text-primary">
                  <i className="bi bi-lightbulb me-2"></i>Example
                </h5>
                <div className="alert alert-info">
                  <p className="mb-0">{lesson.Example}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Materials Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className="bi bi-collection me-2"></i>Learning Materials
            </h4>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setEditingMaterials(!editingMaterials)}
            >
              <i
                className={`bi ${editingMaterials ? "bi-x" : "bi-plus"} me-1`}
              ></i>
              {editingMaterials ? "Cancel" : "Add Material"}
            </button>
          </div>
          <div className="card-body">
            {editingMaterials && (
              <form
                onSubmit={handleAddMaterial}
                className="mb-4 p-3 bg-light rounded"
              >
                <h6 className="mb-3">Add New Material</h6>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Material Type</label>
                    <select
                      className="form-select"
                      value={newMaterial.MaterialType}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          MaterialType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="PDF">PDF Document</option>
                      <option value="Video">Video</option>
                      <option value="Link">External Link</option>
                      <option value="Audio">Audio File</option>
                      <option value="Document">Document</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={newMaterial.URL}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, URL: e.target.value })
                      }
                      placeholder="https://example.com/resource"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-plus-circle me-2"></i>Add Material
                </button>
              </form>
            )}

            {materials.length > 0 ? (
              <div className="row">
                {materials.map((mat) => (
                  <div key={mat.MaterialID} className="col-lg-6 mb-3">
                    <div className="card h-100 border-start border-success border-4">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <i
                                className={`bi ${
                                  mat.MaterialType === "PDF"
                                    ? "bi-file-pdf"
                                    : mat.MaterialType === "Video"
                                    ? "bi-camera-video"
                                    : mat.MaterialType === "Audio"
                                    ? "bi-music-note"
                                    : "bi-link-45deg"
                                } text-success me-2`}
                              ></i>
                              <span className="badge bg-success-subtle text-success">
                                {mat.MaterialType}
                              </span>
                            </div>
                            {mat.Description && (
                              <p className="card-text text-muted mb-2">
                                {mat.Description}
                              </p>
                            )}
                            <a
                              href={mat.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-success btn-sm"
                            >
                              <i className="bi bi-box-arrow-up-right me-1"></i>
                              Open Resource
                            </a>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm ms-2"
                            onClick={() => handleDeleteMaterial(mat.MaterialID)}
                            title="Delete material"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i
                  className="bi bi-collection text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <p className="text-muted mt-2">No materials available yet.</p>
                <button
                  className="btn btn-success"
                  onClick={() => setEditingMaterials(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add First Material
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="card shadow-sm">
          <div className="card-header bg-warning text-dark">
            <h4 className="mb-0">
              <i className="bi bi-question-circle me-2"></i>Quizzes &
              Assessments
            </h4>
          </div>
          <div className="card-body">
            {quizzes.length > 0 ? (
              <div className="row">
                {quizzes.map((quiz) => (
                  <div key={quiz.QuizID} className="col-lg-6 mb-3">
                    <div className="card h-100 border-start border-warning border-4">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="bi bi-patch-question me-2 text-warning"></i>
                          {quiz.Title}
                        </h6>
                        {quiz.Description && (
                          <p className="card-text text-muted mb-3">
                            {quiz.Description}
                          </p>
                        )}
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleViewQuiz(quiz.QuizID)}
                          >
                            <i className="bi bi-eye me-2"></i>View Quiz
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() =>
                              navigate(
                                `/courses/${courseId}/lessons/${lessonId}/quizzes/${quiz.QuizID}/edit`
                              )
                            }
                          >
                            <i className="bi bi-pencil me-2"></i>Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i
                  className="bi bi-question-circle text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <p className="text-muted mt-2">No quizzes available yet.</p>
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    navigate(
                      `/instructor/courses/${courseId}/lessons/${lessonId}/quizzes/create`
                    )
                  }
                >
                  <i className="bi bi-plus-circle me-2"></i>Create First Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Custom Styles */}
      <style jsx>{`
        .lesson-content {
          max-height: 400px;
          overflow-y: auto;
        }

        .card {
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .border-4 {
          border-width: 4px !important;
        }

        .bg-success-subtle {
          background-color: rgba(25, 135, 84, 0.1);
        }

        .text-success {
          color: #198754 !important;
        }
      `}</style>
    </>
  );
};

export default LessonDetails;
