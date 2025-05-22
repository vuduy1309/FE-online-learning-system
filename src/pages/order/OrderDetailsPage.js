import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/orders/orderDetails/${orderId}`
      );
      setDetails(response.data);
      
      // Tính tổng tiền từ Price của từng item
      const totalAmount = response.data.reduce(
        (sum, item) => sum + (parseFloat(item.Price) || 0),
        0
      );
      setTotal(totalAmount);
      setError(null);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'unpaid':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading order details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5">
        {/* Breadcrumb và Back Button */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/orders')}
              >
                <i className="bi bi-house me-1"></i>Orders
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Order #{orderId}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-gradient bg-primary text-white p-4 rounded-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-2 fw-bold">
                    <i className="bi bi-receipt me-2"></i>
                    Order Details
                  </h1>
                  <p className="mb-0 opacity-75">
                    Order ID: #{orderId}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-light btn-sm"
                    onClick={handleGoBack}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back
                  </button>
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={handlePrintInvoice}
                  >
                    <i className="bi bi-printer me-1"></i>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Order Statistics */}
        <div className="row mb-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-primary mb-2">
                  <i className="bi bi-bag fs-1"></i>
                </div>
                <h6 className="card-title text-muted">Total Items</h6>
                <p className="fw-bold text-dark mb-0 fs-4">{details.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-success mb-2">
                  <i className="bi bi-currency-dollar fs-1"></i>
                </div>
                <h6 className="card-title text-muted">Total Amount</h6>
                <p className="fw-bold text-success mb-0 fs-4">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-info mb-2">
                  <i className="bi bi-book fs-1"></i>
                </div>
                <h6 className="card-title text-muted">Order ID</h6>
                <p className="fw-bold text-dark mb-0 fs-4">#{orderId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-light border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark fw-semibold">
                <i className="bi bi-bag me-2"></i>
                Order Items ({details.length})
              </h5>
              <span className="badge bg-primary fs-6">
                Total: {formatCurrency(total)}
              </span>
            </div>
          </div>
          <div className="card-body p-0">
            {details.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-inbox fs-1"></i>
                </div>
                <h5 className="text-muted">No order details found</h5>
                <p className="text-muted">This order appears to be empty</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th className="px-4 py-3">
                          <i className="bi bi-hash me-1"></i>Course ID
                        </th>
                        <th className="px-4 py-3">
                          <i className="bi bi-book me-1"></i>Course Title
                        </th>
                        <th className="px-4 py-3">
                          <i className="bi bi-text-paragraph me-1"></i>Description
                        </th>
                        <th className="px-4 py-3 text-end">
                          <i className="bi bi-currency-dollar me-1"></i>Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((item, index) => (
                        <tr key={item.OrderDetailID} className="border-bottom">
                          <td className="px-4 py-3">
                            <span className="badge bg-light text-dark fs-6">
                              #{item.CourseID}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="fw-semibold text-dark">
                              {item.Title}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-muted" style={{ maxWidth: '400px' }}>
                              {item.Description && item.Description.length > 150 ? 
                                (
                                  <span>
                                    {item.Description.substring(0, 150)}...
                                    <button 
                                      className="btn btn-link btn-sm p-0 ms-1 text-decoration-none"
                                      onClick={(e) => {
                                        e.target.previousSibling.textContent = item.Description;
                                        e.target.style.display = 'none';
                                      }}
                                    >
                                      Read more
                                    </button>
                                  </span>
                                ) : 
                                item.Description || 'No description available'
                              }
                            </div>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="fw-bold text-success fs-6">
                              {formatCurrency(parseFloat(item.Price) || 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Total Section */}
                <div className="bg-light border-top">
                  <div className="p-4">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-info-circle text-primary me-2"></i>
                          <small className="text-muted">
                            All prices are in Vietnamese Dong (VND)
                          </small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-dark fs-5">Total Amount:</span>
                            <span className="fw-bold text-success fs-4">
                              {formatCurrency(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 d-flex gap-2 justify-content-center">
          <button 
            className="btn btn-outline-secondary"
            onClick={handleGoBack}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Orders
          </button>
          <button 
            className="btn btn-primary"
            onClick={handlePrintInvoice}
          >
            <i className="bi bi-download me-1"></i>
            Download Invoice
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;