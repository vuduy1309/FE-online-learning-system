import { useState } from "react";
import { Form, Button, Container} from "react-bootstrap";

export default function AuthForm({ fields, onSubmit, title }) {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-4 rounded shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">{title}</h2>
        <Form onSubmit={submit}>
          {fields.map(({ name, type, placeholder }) => (
            <Form.Group className="mb-3" controlId={name} key={name}>
              <Form.Label>{placeholder}</Form.Label>
              <Form.Control
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}
          <Button variant="primary" type="submit" className="w-100">
            {title}
          </Button>
        </Form>
      </div>
    </Container>
  );
}
