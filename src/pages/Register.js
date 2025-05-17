import AuthForm from "../components/AuthForm";
import axiosInstance from "../api/axios";

export default function Register() {
  const handleRegister = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <AuthForm
      title="Register"
      fields={[
        { name: "fullName", type: "text", placeholder: "Full Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleRegister}
    />
  );
}
