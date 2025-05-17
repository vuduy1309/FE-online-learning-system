import { useState } from "react";

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
    <div>
      <h2>{title}</h2>
      <form onSubmit={submit}>
        {fields.map(({ name, type, placeholder }) => (
          <input
            key={name}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">{title}</button>
      </form>
    </div>
  );
}
