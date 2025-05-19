import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spinner,
  Image,
  Container,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Badge
} from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function ListForManager() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  
  // Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("");
  const [instructorsList, setInstructorsList] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses/listCourse");
      setCourses(res.data);
      setFilteredCourses(res.data);
      
      // Extract unique instructors from courses
      const uniqueInstructors = [...new Set(
        res.data
          .filter(course => course.InstructorName)
          .map(course => course.InstructorName)
      )].sort();
      
      setInstructorsList(uniqueInstructors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = async (courseId, courseTitle) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/feedback`);
      setSelectedFeedback(res.data);
      setSelectedCourseTitle(courseTitle);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading feedback:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTitle, priceRange, selectedInstructors, ratingFilter, courses]);

  const applyFilters = () => {
    let filtered = [...courses];
    let activeFilterCount = 0;

    // Filter by title search
    if (searchTitle.trim()) {
      filtered = filtered.filter(course => 
        course.Title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      activeFilterCount++;
    }

    // Filter by price range
    if (priceRange.min !== "") {
      filtered = filtered.filter(course => parseFloat(course.Price) >= parseFloat(priceRange.min));
      activeFilterCount++;
    }
    
    if (priceRange.max !== "") {
      filtered = filtered.filter(course => parseFloat(course.Price) <= parseFloat(priceRange.max));
      activeFilterCount++;
    }

    // Filter by selected instructors
    if (selectedInstructors.length > 0) {
      filtered = filtered.filter(course => 
        selectedInstructors.includes(course.InstructorName)
      );
      activeFilterCount++;
    }

    // Filter by rating
    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(course => 
        course.Rating && parseFloat(course.Rating) >= minRating
      );
      activeFilterCount++;
    }

    setFilteredCourses(filtered);
    setActiveFilters(activeFilterCount);
  };

  const handleInstructorToggle = (instructor) => {
    if (selectedInstructors.includes(instructor)) {
      setSelectedInstructors(selectedInstructors.filter(i => i !== instructor));
    } else {
      setSelectedInstructors([...selectedInstructors, instructor]);
    }
  };

  const clearFilters = () => {
    setSearchTitle("");
    setPriceRange({ min: "", max: "" });
    setSelectedInstructors([]);
    setRatingFilter("");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-warning"></i>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-warning"></i>
      );
    }
    return stars;
  };

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Course Management</h2>
                <p className="text-muted mb-0">
                  Manage all courses in the system ({courses.length} total
                  {filteredCourses.length !== courses.length && 
                    `, ${filteredCourses.length} filtered`})
                </p>
              </div>
              <Button
                as={Link}
                to="/courses/create"
                variant="primary"
                className="fw-semibold"
              >
                Create New Course
              </Button>
            </div>
          </Col>
        </Row>

        {/* Search and Filter Bar */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by course title..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                  {searchTitle && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSearchTitle("")}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col md={6} className="d-flex gap-2 justify-content-md-end mt-3 mt-md-0">
                <Button 
                  variant={showFilters ? "primary" : "outline-primary"}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fas fa-filter me-2"></i>
                  Filters
                  {activeFilters > 0 && (
                    <Badge bg="danger" pill className="ms-2">
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
                
                {activeFilters > 0 && (
                  <Button 
                    variant="outline-secondary"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                )}
              </Col>
            </Row>

            {showFilters && (
              <Row className="mt-3">
                {/* Price Range Filter */}
                <Col md={4} className="mb-3">
                  <Form.Label>Price Range (USD)</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </Col>

                {/* Instructor Filter */}
                <Col md={4} className="mb-3">
                  <Form.Label>Instructor</Form.Label>
                  <DropdownButton 
                    id="instructor-dropdown" 
                    title={selectedInstructors.length > 0 
                      ? `${selectedInstructors.length} Selected` 
                      : "Select Instructor"}
                    variant="outline-secondary"
                    className="w-100"
                  >
                    {instructorsList.map((instructor, idx) => (
                      <Dropdown.Item key={idx} as="button" onClick={() => handleInstructorToggle(instructor)}>
                        <Form.Check
                          type="checkbox"
                          id={`instructor-${idx}`}
                          label={instructor}
                          checked={selectedInstructors.includes(instructor)}
                          onChange={() => {}}
                        />
                      </Dropdown.Item>
                    ))}
                    {instructorsList.length === 0 && (
                      <Dropdown.Item disabled>No instructors found</Dropdown.Item>
                    )}
                  </DropdownButton>
                </Col>

                {/* Rating Filter */}
                <Col md={4} className="mb-3">
                  <Form.Label>Minimum Rating</Form.Label>
                  <Form.Select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ ⭐⭐⭐⭐½</option>
                    <option value="4">4.0+ ⭐⭐⭐⭐</option>
                    <option value="3.5">3.5+ ⭐⭐⭐½</option>
                    <option value="3">3.0+ ⭐⭐⭐</option>
                  </Form.Select>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        {loading ? (
          <Card className="text-center py-5">
            <Card.Body>
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading courses...</p>
            </Card.Body>
          </Card>
        ) : filteredCourses.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="fas fa-search fa-4x text-muted mb-3"></i>
              <h4 className="text-muted">No courses found</h4>
              <p className="text-muted mb-4">
                {courses.length > 0 
                  ? "Try adjusting your filters or search criteria"
                  : "Start by creating your first course"}
              </p>
              {courses.length > 0 ? (
                <Button variant="primary" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              ) : (
                <Button as={Link} to="/courses/create" variant="primary">
                  Create Course
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0" hover>
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3 ps-4">Course</th>
                      <th className="border-0 py-3">Instructor</th>
                      <th className="border-0 py-3 text-center">Statistics</th>
                      <th className="border-0 py-3 text-center">Performance</th>
                      <th className="border-0 py-3 text-center pe-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course, index) => (
                      <tr
                        key={course.CourseID}
                        className={
                          index !== filteredCourses.length - 1 ? "border-bottom" : ""
                        }
                      >
                        <td className="py-3 ps-4">
                          <div>
                            <h6 className="mb-1 fw-semibold">{course.Title}</h6>
                            <p
                              className="text-muted mb-2 small"
                              style={{ maxWidth: "300px" }}
                            >
                              {course.Description.length > 100
                                ? `${course.Description.substring(0, 100)}...`
                                : course.Description}
                            </p>
                            <span className="badge bg-primary">
                              ${course.Price}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="fw-semibold">
                            {course.InstructorName || "Not assigned"}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="d-flex flex-column align-items-center gap-1">
                            <div>
                              <i className="fas fa-users me-1 text-muted"></i>
                              <span className="fw-semibold">
                                {course.EnrollmentCount}
                              </span>
                              <small className="text-muted ms-1">
                                enrollments
                              </small>
                            </div>
                            <div>
                              <i className="fas fa-play me-1 text-muted"></i>
                              <span className="fw-semibold">
                                {course.LessonCount}
                              </span>
                              <small className="text-muted ms-1">lessons</small>
                            </div>
                            <div>
                              <i className="fas fa-file-alt me-1 text-muted"></i>
                              <span className="fw-semibold">
                                {course.MaterialCount}
                              </span>
                              <small className="text-muted ms-1">
                                materials
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {course.Rating ? (
                            <div>
                              <div className="mb-1">
                                {renderStars(course.Rating)}
                              </div>
                              <span className="fw-semibold">
                                {course.Rating}
                              </span>
                              <small className="text-muted">/5</small>
                            </div>
                          ) : (
                            <span className="text-muted">No ratings yet</span>
                          )}
                        </td>
                        <td className="py-3 text-center pe-4">
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() =>
                                handleViewFeedback(
                                  course.CourseID,
                                  course.Title
                                )
                              }
                              title="View feedback"
                            >
                              View Feedback
                            </Button>
                            <Button
                              as={Link}
                              to={`/courses/update/${course.CourseID}`}
                              variant="outline-primary"
                              size="sm"
                              title="Edit course"
                            >
                              Update
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Feedback Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <i className="fas fa-comments me-2"></i>
              Feedback for "{selectedCourseTitle}"
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            {selectedFeedback.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No feedback yet</h5>
                <p className="text-muted">
                  This course hasn't received any reviews.
                </p>
              </div>
            ) : (
              <div className="p-3">
                {selectedFeedback.map((fb, index) => (
                  <div
                    key={index}
                    className={`d-flex p-3 ${
                      index !== selectedFeedback.length - 1
                        ? "border-bottom"
                        : ""
                    }`}
                  >
                    <Image
                      src={fb.AvatarURL || "/api/placeholder/48/48"}
                      roundedCircle
                      width={48}
                      height={48}
                      className="me-3 flex-shrink-0"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong className="d-block">{fb.FullName}</strong>
                          <small className="text-muted">
                            {new Date(fb.ReviewDate).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          {renderStars(fb.Rating)}
                          <span className="ms-2 fw-semibold">
                            {fb.Rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="mb-0">{fb.Comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Footer />
    </>
  );
}