import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    rating: "",
    enrollment: "",
    noLessons: false,
    noMaterials: false,
  });

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/courses/instructorCourses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (error) {
        console.error("Error fetching my courses:", error);
      }
    };

    fetchMyCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTitle, filterOptions, courses]);

  const applyFilters = () => {
    let filtered = [...courses];

    // Search by title
    if (searchTitle) {
      filtered = filtered.filter((course) =>
        course.Title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by rating
    if (filterOptions.rating) {
      switch (filterOptions.rating) {
        case "highest":
          filtered = filtered.sort((a, b) => (b.Rating || 0) - (a.Rating || 0));
          break;
        case "lowest":
          filtered = filtered.sort((a, b) => (a.Rating || 0) - (b.Rating || 0));
          break;
        default:
          break;
      }
    }

    // Filter by enrollment count
    if (filterOptions.enrollment) {
      switch (filterOptions.enrollment) {
        case "highest":
          filtered = filtered.sort(
            (a, b) => b.EnrollmentCount - a.EnrollmentCount
          );
          break;
        case "lowest":
          filtered = filtered.sort(
            (a, b) => a.EnrollmentCount - b.EnrollmentCount
          );
          break;
        default:
          break;
      }
    }

    // Filter courses without lessons
    if (filterOptions.noLessons) {
      filtered = filtered.filter((course) => course.LessonCount === 0);
    }

    // Filter courses without materials
    if (filterOptions.noMaterials) {
      filtered = filtered.filter((course) => course.MaterialCount === 0);
    }

    setFilteredCourses(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleClearFilters = () => {
    setSearchTitle("");
    setFilterOptions({
      rating: "",
      enrollment: "",
      noLessons: false,
      noMaterials: false,
    });
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Courses</h2>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Search and Filter</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title..."
                    value={searchTitle}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  name="rating"
                  value={filterOptions.rating}
                  onChange={handleFilterChange}
                >
                  <option value="">Rating</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  name="enrollment"
                  value={filterOptions.enrollment}
                  onChange={handleFilterChange}
                >
                  <option value="">Enrollment</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </select>
              </div>
              <div className="col-md-4">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="noLessons"
                    name="noLessons"
                    checked={filterOptions.noLessons}
                    onChange={handleFilterChange}
                  />
                  <label className="form-check-label" htmlFor="noLessons">
                    No Lessons
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="noMaterials"
                    name="noMaterials"
                    checked={filterOptions.noMaterials}
                    onChange={handleFilterChange}
                  />
                  <label className="form-check-label" htmlFor="noMaterials">
                    No Materials
                  </label>
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm ms-2"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Enrollments</th>
                    <th>Lessons</th>
                    <th>Materials</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course.CourseID}>
                        <td>
                          <Link
                            to={`/instructor/courses/${course.CourseID}`}
                            className="text-decoration-none fw-bold"
                          >
                            {course.Title}
                          </Link>
                        </td>
                        <td>
                          {course.Description.length > 50
                            ? `${course.Description.substring(0, 50)}...`
                            : course.Description}
                        </td>
                        <td>${course.Price.toLocaleString()}</td>
                        <td>
                          {course.Rating !== null &&
                          course.Rating !== undefined ? (
                            <div>
                              <span className="text-warning me-1">
                                <i className="bi bi-star-fill"></i>
                              </span>
                              {Number(course.Rating).toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-muted">None</span>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {course.EnrollmentCount}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {course.LessonCount}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {course.MaterialCount}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">

                              <Link
                                to={`/courses/${course.CourseID}/lessons`}
                                className="btn btn-sm btn-outline-primary"
                                title="View Lessons"
                              >
                                <i className="bi bi-collection"></i> View
                                Lessons
                              </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <i className="bi bi-search me-2 fs-4"></i>
                          <p>No courses found matching your filters</p>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleClearFilters}
                          >
                            Clear Filters
                          </button>
                        </div>
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

export default InstructorCourses;
