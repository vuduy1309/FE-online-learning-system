import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="container mt-5 mb-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <i
              className="bi bi-x-circle-fill text-danger"
              style={{ fontSize: 64 }}
            ></i>
          </div>
          <h2 className="fw-bold mb-3">Payment Failed!</h2>
          <p className="text-muted mb-4">
            An error occurred or you cancelled the payment. Please try again or
            contact support.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            <i className="bi bi-house-door me-2"></i>
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
