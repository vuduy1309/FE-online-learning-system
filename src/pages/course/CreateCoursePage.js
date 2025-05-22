import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Form, Button, Container, Alert, Image } from "react-bootstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Price: "",
    InstructorID: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy base URL từ axios instance hoặc environment variable
  const API_BASE_URL =
    axiosInstance.defaults.baseURL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axiosInstance.get("/courses/instructors");
        setInstructors(response.data);
      } catch (err) {
        console.error("Error fetching instructors:", err);
        setError("Failed to load instructors");
      }
    };

    fetchInstructors();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tạo FormData để gửi cả form data và file
      const formData = new FormData();
      formData.append("Title", form.Title);
      formData.append("Description", form.Description);
      formData.append("Price", form.Price);
      formData.append("InstructorID", form.InstructorID);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Debug: Log form data
      console.log("Submitting form data:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axiosInstance.post("/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setForm({
        Title: "",
        Description: "",
        Price: "",
        InstructorID: "",
      });
      setImageFile(null);
      setImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById("imageFile");
      if (fileInput) fileInput.value = "";

      // Có thể hiển thị ảnh đã upload thành công
      if (response.data.imageUrl) {
        console.log(
          "Image uploaded successfully:",
          `${API_BASE_URL}${response.data.imageUrl}`
        );
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err.response?.data?.error || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("imageFile");
    if (fileInput) fileInput.value = "";
  };

  return (
    <>
      <Header />
      <Container className="mt-5" style={{ maxWidth: "600px" }}>
        <h2>Create New Course</h2>

        {success && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSuccess(false)}
          >
            Course created successfully!
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
                  <small className="text-muted">Preview:</small>
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
                  alt="Preview"
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
              value={form.InstructorID}
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

          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!instructors.length || loading}
            >
              {loading
                ? "Creating Course..."
                : !instructors.length
                ? "Loading instructors..."
                : "Create Course"}
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
}
