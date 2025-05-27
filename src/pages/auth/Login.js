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
      <div className="container">
        <div
          className="row justify-content-center"
          style={{ marginTop: "2rem" }}
        >
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <AuthForm
                  title="Login"
                  fields={[
                    { name: "email", type: "email", placeholder: "Email" },
                    {
                      name: "password",
                      type: "password",
                      placeholder: "Password",
                    },
                  ]}
                  onSubmit={handleLogin}
                />
                <div className="text-center mt-2">
                  <small className="text-muted">Quick Login With:</small>
                  <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
                    <button
                      className="btn btn-outline-danger "
                      onClick={() =>
                        handleLogin({
                          email: "admin@gmail.com",
                          password: "123456",
                        })
                      }
                      title="Email: admin@gmail.com&#10;Password: 123456"
                    >
                      Admin
                    </button>
                    <button
                      className="btn btn-outline-warning "
                      onClick={() =>
                        handleLogin({
                          email: "manager@gmail.com",
                          password: "123123",
                        })
                      }
                      title="Email: manager@gmail.com&#10;Password: duyha123"
                    >
                      Manager
                    </button>
                    <button
                      className="btn btn-outline-success "
                      onClick={() =>
                        handleLogin({
                          email: "Duyhvhe176251@fpt.edu",
                          password: "duyha123",
                        })
                      }
                      title="Email: Duyhvhe176251@fpt.edu&#10;Password: duyha123"
                    >
                      Instructor
                    </button>
                    <button
                      className="btn btn-outline-primary "
                      onClick={() =>
                        handleLogin({
                          email: "duyakali12@gmail.com",
                          password: "duyha123",
                        })
                      }
                      title="Email: duyakali12@gmail.com&#10;Password: duyha123"
                    >
                      Student
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
