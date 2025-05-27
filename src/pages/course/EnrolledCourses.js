import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BookOpen, MessageCircle, AlertTriangle, MessageSquare, Play, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../../components/feedback/FeedbackModal";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/courses/enrollments/my-courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((course) =>
        course.Title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, courses]);

  const navigate = useNavigate();

  const handleStudyNow = (courseId, title) => {
    navigate(`/availableLessons/${courseId}`);
  };

  const handleComplaint = (courseId, title) => {
    navigate(`/complaint/${courseId}`);
  };

  const handleChatInstructor = (courseId) => {
    navigate(`/messenger`);
  };
  const handleFeedback = (courseId, title) => {
    setSelectedCourse({ id: courseId, title });
    setShowFeedbackModal(true);
  };

  const handleFeedbackSuccess = () => {
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination logic
  const paginatedCourses = (searchTerm ? filteredCourses : courses).slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );
  const totalPages = Math.ceil((searchTerm ? filteredCourses.length : courses.length) / coursesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <p className="text-muted">Loading courses...</p>
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
          <button className="btn btn-secondary mb-3" type="button" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          {/* Page Header */}
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">
              Enrolled Courses
            </h2>
            <p className="lead text-muted">
              Continue your learning journey and develop your skills
            </p>
          </div>

          {/* Search Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-6 col-md-8">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses by title..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Courses Display */}
          {(searchTerm ? filteredCourses : courses).length === 0 ? (
            <div className="text-center py-5">
              <BookOpen className="text-muted mb-4" size={64} />
              <h3 className="h4 text-muted mb-3">
                {searchTerm ? "No courses found" : "You have not enrolled in any courses"}
              </h3>
              <p className="text-muted">
                {searchTerm
                  ? `No courses match the keyword "${searchTerm}". Try another keyword.`
                  : "You have not enrolled in any courses yet. Explore available courses!"}
              </p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {paginatedCourses.map((course) => (
                  <div key={course.CourseID} className="col-lg-4 col-md-6">
                    <div className="card h-100 shadow-sm border-0 overflow-hidden">
                      {/* Course Header */}
                      <div className="card-header bg-gradient text-white p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                        <div className="d-flex align-items-center mb-2">
                          <BookOpen size={20} className="me-2" />
                          <small className="opacity-75 fw-medium">Khóa học</small>
                        </div>
                        <h5 className="card-title text-white mb-0 fw-bold">
                          {course.Title}
                        </h5>
                      </div>

                      {/* Course Content */}
                      <div className="card-body p-4">
                        <p className="card-text text-muted mb-4" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {course.Description}
                        </p>

                        {/* Instructor Info */}
                        {course.Instructor && (
                          <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" 
                                 style={{
                                   width: '40px', 
                                   height: '40px',
                                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                 }}>
                              <User size={20} />
                            </div>
                            <div>
                              <small className="text-muted">Instructor</small>
                              <div className="fw-semibold text-dark">{course.Instructor}</div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="d-grid gap-2">
                          {/* Primary Action */}
                          <button
                            onClick={() => handleStudyNow(course.CourseID, course.Title)}
                            className="btn btn-primary btn-lg fw-semibold d-flex align-items-center justify-content-center gap-2"
                          >
                            <Play size={18} />
                            Study Now
                          </button>
                          
                          {/* Secondary Actions */}
                          <div className="row g-2">
                            <div className="col-4">
                              <button
                                onClick={() => handleChatInstructor(course.CourseID)}
                                className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center flex-column"
                                title="Chat with instructor"
                              >
                                <MessageCircle size={16} />
                                <small className="d-none d-sm-block mt-1">Chat</small>
                              </button>
                            </div>
                            
                            <div className="col-4">
                              <button
                                onClick={() => handleComplaint(course.CourseID, course.Title)}
                                className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center flex-column"
                                title="Send complaint"
                              >
                                <AlertTriangle size={16} />
                                <small className="d-none d-sm-block mt-1">Complaint</small>
                              </button>
                            </div>
                            
                            <div className="col-4">
                              <button
                                onClick={() => handleFeedback(course.CourseID, course.Title)}
                                className="btn btn-outline-warning btn-sm w-100 d-flex align-items-center justify-content-center flex-column"
                                title="Feedback"
                              >
                                <MessageSquare size={16} />
                                <small className="d-none d-sm-block mt-1">Feedback</small>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item${page === currentPage ? " active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
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
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .btn {
          transition: all 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        @media (max-width: 576px) {
          .display-4 {
            font-size: 2rem;
          }
        }
      `}</style>
      
      <Footer />

      {/* Feedback Modal */}
      <FeedbackModal
        show={showFeedbackModal}
        onHide={() => {
          setShowFeedbackModal(false);
          setSelectedCourse(null);
        }}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
        onSuccess={handleFeedbackSuccess}
      />
    </>
  );
};

export default EnrolledCourses;