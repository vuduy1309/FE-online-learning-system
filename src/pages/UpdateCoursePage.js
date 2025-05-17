import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UpdateCoursePage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Price: "",
    ImageURL: "",
    Status: "",
  });
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/courses/getCourseById/${id}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/courses/update/${id}`, form);
      setUpdated(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <Header />
      <Container className="mt-5" style={{ maxWidth: "600px" }}>
        <h2>Update Course</h2>
        {updated && (
          <Alert variant="success">Course updated successfully!</Alert>
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
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              name="Status"
              value={form.Status}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
}
