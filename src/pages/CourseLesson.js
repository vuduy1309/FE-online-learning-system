import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CourseLessons = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseWithLessons = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/courses/${courseId}/lessons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setCourse(res.data.course);
          setLessons(res.data.lessons);
        } else {
          setError("Failed to load course data");
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setError("Error loading course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseWithLessons();
  }, [courseId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-4 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
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
        <div className="container mt-4">
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
      <div className="container mt-4">
        {course && (
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">{course.Title}</h2>
              <p className="card-text text-muted">{course.Description}</p>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header bg-light">
            <h5 className="mb-0">Course Lessons</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Introduction</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <tr key={lesson.LessonID}>
                        <td>{lesson.Title}</td>
                        <td>
                          {lesson.Introduction?.length > 50
                            ? `${lesson.Introduction.substring(0, 50)}...`
                            : lesson.Introduction}
                        </td>
                        <td>
                          <Link
                            to={`/courses/${courseId}/lessons/${lesson.LessonID}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-3">
                        No lessons found. Start creating your first lesson!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseLessons;
