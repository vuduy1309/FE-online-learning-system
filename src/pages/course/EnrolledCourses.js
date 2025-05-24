import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BookOpen, MessageCircle, AlertTriangle, MessageSquare, Play, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const navigate = useNavigate();

  const handleStudyNow = (courseId, title) => {
    navigate(`/availableLessons/${courseId}`);
  };

  const handleComplaint = (courseId, title) => {
    // Implement complaint functionality
    console.log(`Filing complaint for: ${title}`);
  };

  const handleChatInstructor = (courseId) => {
    // Implement chat functionality
    console.log(`Opening chat for course: ${courseId}`);
  };

  const handleFeedback = (courseId, title) => {
    // Implement feedback functionality
    console.log(`Opening feedback for: ${title}`);
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
          {/* Page Header */}
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">
              Các khóa học đã đăng ký
            </h2>
            <p className="lead text-muted">
              Tiếp tục hành trình học tập và phát triển kỹ năng của bạn
            </p>
          </div>

          {/* Courses Display */}
          {courses.length === 0 ? (
            <div className="text-center py-5">
              <BookOpen className="text-muted mb-4" size={64} />
              <h3 className="h4 text-muted mb-3">
                Bạn chưa đăng ký khóa học nào
              </h3>
              <p className="text-muted">
                Bạn chưa đăng ký bất kỳ khóa học nào. Khám phá các khóa học có sẵn!
              </p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {courses.map((course) => (
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
                              <small className="text-muted">Giảng viên</small>
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
                            Học ngay
                          </button>
                          
                          {/* Secondary Actions */}
                          <div className="row g-2">
                            <div className="col-4">
                              <button
                                onClick={() => handleChatInstructor(course.CourseID)}
                                className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center flex-column"
                                title="Chat với giảng viên"
                              >
                                <MessageCircle size={16} />
                                <small className="d-none d-sm-block mt-1">Chat</small>
                              </button>
                            </div>
                            
                            <div className="col-4">
                              <button
                                onClick={() => handleComplaint(course.CourseID, course.Title)}
                                className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center flex-column"
                                title="Gửi khiếu nại"
                              >
                                <AlertTriangle size={16} />
                                <small className="d-none d-sm-block mt-1">Khiếu nại</small>
                              </button>
                            </div>
                            
                            <div className="col-4">
                              <button
                                onClick={() => handleFeedback(course.CourseID, course.Title)}
                                className="btn btn-outline-warning btn-sm w-100 d-flex align-items-center justify-content-center flex-column"
                                title="Góp ý"
                              >
                                <MessageSquare size={16} />
                                <small className="d-none d-sm-block mt-1">Góp ý</small>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Count Info */}
              <div className="text-center mt-5">
                <div className="badge bg-primary fs-6 p-3 rounded-pill">
                  <BookOpen size={16} className="me-2" />
                  Tổng cộng {courses.length} khóa học đã đăng ký
                </div>
              </div>
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
    </>
  );
};

export default EnrolledCourses;