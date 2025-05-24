import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BookOpen, Eye, FileText, Users, Clock, Search, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const AvailableLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLessons, setFilteredLessons] = useState([]);
  const { CourseID } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!CourseID) return;

    axiosInstance
      .get(`/courses/${CourseID}/lessons`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const { course, lessons } = res.data;
        setCourse(course);
        setLessons(lessons);
        setFilteredLessons(lessons);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [CourseID]);

  // Filter lessons based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLessons(lessons);
    } else {
      const filtered = lessons.filter(
        (lesson) =>
          lesson.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lesson.Introduction &&
            lesson.Introduction.toLowerCase().includes(
              searchTerm.toLowerCase()
            ))
      );
      setFilteredLessons(filtered);
    }
  }, [searchTerm, lessons]);

  const handleViewDetails = (lessonId, title) => {
    navigate(`/learn/${lessonId}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your lessons...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          {/* Page Header */}
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">
              {course?.Title || "Lesson List"}
            </h2>
            <p className="lead text-muted">{course?.Description}</p>

            {/* Stats Cards */}
            <div className="row g-3 mt-4 justify-content-center">
              <div className="col-md-3 col-sm-6">
                <div className="card border-0 bg-primary text-white">
                  <div className="card-body text-center py-3">
                    <BookOpen size={24} className="mb-2" />
                    <h5 className="mb-1">{lessons.length}</h5>
                    <small>Total Lessons</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="card border-0 bg-success text-white">
                  <div className="card-body text-center py-3">
                    <Users size={24} className="mb-2" />
                    <h5 className="mb-1">1</h5>
                    <small>Course</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6 col-md-8">
              <div className="position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search lessons by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={clearSearch}
                      style={{ borderLeft: "none" }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="text-center mb-4">
              <p className="text-muted">
                Found {filteredLessons.length} lessons
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* Lessons Display */}
          {filteredLessons.length === 0 ? (
            <div className="text-center py-5">
              <BookOpen className="text-muted mb-4" size={64} />
              <h3 className="h4 text-muted mb-3">
                {searchTerm ? "No lessons found" : "No lessons available"}
              </h3>
              <p className="text-muted">
                {searchTerm
                  ? `No lessons match the keyword "${searchTerm}". Try another keyword.`
                  : "You do not have access to any lessons yet. Please purchase a course to get started!"}
              </p>
              {searchTerm ? (
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={clearSearch}
                >
                  Clear search
                </button>
              ) : (
                <button className="btn btn-primary mt-3">View Courses</button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {filteredLessons.map((lesson, index) => (
                <div key={lesson.LessonID} className="col-lg-6 col-md-6">
                  <div className="card h-100 shadow-sm border-0 lesson-card">
                    <div className="card-body p-4">
                      {/* Lesson Number Badge */}
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="lesson-number-badge">
                          <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                            Lesson {lessons.findIndex(
                              (l) => l.LessonID === lesson.LessonID
                            ) + 1}
                          </span>
                        </div>
                      </div>

                      {/* Lesson Title */}
                      <h5 className="card-title fw-bold text-dark mb-3">
                        {lesson.Title}
                      </h5>

                      {/* Lesson Content Preview */}
                      <div className="lesson-content mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FileText size={16} className="text-muted me-2" />
                          <small className="text-muted fw-medium">
                            Introduction
                          </small>
                        </div>
                        <p
                          className="text-muted small"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: "1.4",
                          }}
                        >
                          {truncateContent(lesson.Introduction)}
                        </p>
                      </div>

                      {/* Lesson Meta Info */}
                      <div className="lesson-meta mb-4">
                        <div className="row g-2 text-center">
                          <div className="col-12">
                            <div className="p-2 bg-light rounded">
                              <Clock size={16} className="text-primary mb-1" />
                              <div className="small text-muted">
                                Estimated Duration
                              </div>
                              <div className="fw-semibold">15-30 minutes</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="d-grid">
                        <button
                          onClick={() =>
                            handleViewDetails(lesson.LessonID, lesson.Title)
                          }
                          className="btn btn-outline-primary btn-lg fw-semibold d-flex align-items-center justify-content-center gap-2"
                        >
                          <Eye size={18} />
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="card-footer bg-transparent border-0 p-0">
                      <div className="progress" style={{ height: "4px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "0%" }}
                          aria-valuenow="0"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bootstrap CSS CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {/* Custom Styles */}
      <style jsx>{`
        .lesson-card {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        .lesson-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          border-left-color: #0d6efd;
        }
        .btn {
          transition: all 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .lesson-number-badge .badge {
          font-size: 0.875rem;
          font-weight: 600;
        }
        .lesson-content {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
        }
        .lesson-meta .bg-light {
          border: 1px solid #e9ecef;
        }
        .progress {
          border-radius: 0;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .input-group-text {
          border-right: none;
        }
        .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        .form-control:focus + .btn {
          border-color: #86b7fe;
        }
        @media (max-width: 576px) {
          .display-4 {
            font-size: 2rem;
          }
          .lesson-number-badge .badge {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <Footer />
    </>
  );
};

export default AvailableLessons;
