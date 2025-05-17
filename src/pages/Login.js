import AuthForm from "../components/AuthForm";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      login(res.data.user, res.data.token);
      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthForm
      title="Login"
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleLogin}
    />
  );
}
