import AuthForm from "../../components/auth/AuthForm";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      login(res.data.user, res.data.token);
      navigate("/"); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <AuthForm
        title="Login"
        fields={[
          { name: "email", type: "email", placeholder: "Email" },
          { name: "password", type: "password", placeholder: "Password" },
        ]}
        onSubmit={handleLogin}
      />
      <Footer />
    </>
  );
}

