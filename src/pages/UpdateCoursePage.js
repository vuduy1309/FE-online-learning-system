import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { Form, Button, Container, Alert, Spinner, Image } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UpdateCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Price: "",
    ImageURL: "",
    Status: "",
    InstructorID: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [currentInstructorID, setCurrentInstructorID] = useState("");

  // Lấy base URL từ axios instance hoặc environment variable
  const API_BASE_URL =
    axiosInstance.defaults.baseURL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load course data
        const courseRes = await axiosInstance.get(`/courses/getCourseById/${id}`);
        setForm(courseRes.data);
        
        // If there's an existing image, set the preview
        if (courseRes.data.ImageURL) {
          setImagePreview(`${API_BASE_URL}${courseRes.data.ImageURL}`);
        }
        
        // Load instructors
        const instructorsRes = await axiosInstance.get("/courses/instructors");
        setInstructors(instructorsRes.data);
        
        // Get current instructor for this course
        const courseDetailsRes = await axiosInstance.get(`/courses/${id}`);
        if (courseDetailsRes.data) {
          const instructorName = courseDetailsRes.data.InstructorName;
          const instructor = instructorsRes.data.find(
            instructor => instructor.FullName === instructorName
          );
          if (instructor) {
            setCurrentInstructorID(instructor.UserID);
            setForm(prev => ({
              ...prev,
              InstructorID: instructor.UserID
            }));
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load course data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, API_BASE_URL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB");
        return;
      }

      setImageFile(file);

      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    // If we're removing a newly selected image but had an original image,
    // revert to the original
    if (form.ImageURL && !imageFile) {
      setImagePreview(`${API_BASE_URL}${form.ImageURL}`);
    } else {
      setImagePreview(null);
      setForm({ ...form, ImageURL: "" });
    }
    
    const fileInput = document.getElementById("imageFile");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdating(true);

    try {
      // Create FormData to send both form data and file
      const formData = new FormData();
      formData.append("Title", form.Title);
      formData.append("Description", form.Description);
      formData.append("Price", form.Price);
      formData.append("Status", form.Status || "active");
      formData.append("InstructorID", form.InstructorID);
      
      // Only append ImageURL if not uploading a new file
      if (!imageFile && form.ImageURL) {
        formData.append("ImageURL", form.ImageURL);
      }

      // Append the new image file if one was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Debug: Log form data
      console.log("Submitting form data:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axiosInstance.put(`/courses/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUpdated(true);
      setUpdating(false);
      
      // Set timeout to redirect after showing success message
      setTimeout(() => {
        navigate("/courses/listCourse");
      }, 2000);
      
    } catch (err) {
      console.error("Error updating course:", err);
      setError(err.response?.data?.error || "Failed to update course");
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="text-center mt-5">
          <Spinner animation="border" className="m-5" />
          <p>Loading course data...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-5" style={{ maxWidth: "600px" }}>
        <h2>Update Course</h2>
        
        {updated && (
          <Alert variant="success" dismissible onClose={() => setUpdated(false)}>
            Course updated successfully! Redirecting...
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="Title"
              value={form.Title}
              onChange={handleChange}
              required
              placeholder="Enter course title"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="Description"
              value={form.Description}
              onChange={handleChange}
              required
              placeholder="Enter course description"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Price (USD)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              name="Price"
              value={form.Price}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Course Image</Form.Label>
            <Form.Control
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            <Form.Text className="text-muted">
              Select an image file (JPG, PNG, GIF). Max size: 5MB
            </Form.Text>

            {imagePreview && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Current image:</small>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={removeImage}
                  >
                    Remove Image
                  </Button>
                </div>
                <Image
                  src={imagePreview}
                  alt="Course image"
                  thumbnail
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Select Instructor</Form.Label>
            <Form.Select
              name="InstructorID"
              value={form.InstructorID || currentInstructorID}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose an instructor --</option>
              {instructors.map((instructor) => (
                <option key={instructor.UserID} value={instructor.UserID}>
                  {instructor.FullName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="Status"
              value={form.Status || "active"}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="secondary" 
              onClick={() => navigate("/courses/listCourse")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Course"}
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
}