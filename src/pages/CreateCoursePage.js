import { useState } from "react";
import axiosInstance from "../api/axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Price: "",
    ImageURL: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/courses/create", form);
      setSuccess(true);
      setForm({ Title: "", Description: "", Price: "", ImageURL: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5" style={{ maxWidth: "600px" }}>
        <h2>Create New Course</h2>
        {success && (
          <Alert variant="success">Course created successfully!</Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="Title"
              value={form.Title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="Description"
              value={form.Description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="Price"
              value={form.Price}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              name="ImageURL"
              value={form.ImageURL}
              onChange={handleChange}
            />
          </Form.Group>
          
          <Button type="submit">Create</Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
}
