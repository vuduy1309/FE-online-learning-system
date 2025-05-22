import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/orders/viewOrderList", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid";

    try {
      await axiosInstance.put(`/orders/updateStatus/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.OrderID.toString().includes(searchTerm) ||
      order.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.UserID.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.PaymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    return status === "paid" ? "bg-success" : "bg-warning text-dark";
  };

  const formatCurrency = (amount) => {
    // Đảm bảo amount là số hợp lệ
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
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
              <p className="text-muted">Loading orders...</p>
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
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-primary text-white p-4 rounded-3 shadow-sm">
              <h1 className="mb-2 fw-bold">
                <i className="bi bi-bag-check me-2"></i>
                Order Management
              </h1>
              <p className="mb-0 opacity-75">
                Manage and track all customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-primary mb-2">
                  <i className="bi bi-bag fs-1"></i>
                </div>
                <h5 className="card-title text-muted">Total Orders</h5>
                <h3 className="text-primary fw-bold">{orders.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-success mb-2">
                  <i className="bi bi-check-circle fs-1"></i>
                </div>
                <h5 className="card-title text-muted">Paid Orders</h5>
                <h3 className="text-success fw-bold">
                  {orders.filter(order => order.PaymentStatus === "paid").length}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-warning mb-2">
                  <i className="bi bi-clock fs-1"></i>
                </div>
                <h5 className="card-title text-muted">Unpaid Orders</h5>
                <h3 className="text-warning fw-bold">
                  {orders.filter(order => order.PaymentStatus === "unpaid").length}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-info mb-2">
                  <i className="bi bi-currency-dollar fs-1"></i>
                </div>
                <h5 className="card-title text-muted">Total Revenue</h5>
                <h3 className="text-info fw-bold">
                  {formatCurrency(orders.reduce((sum, order) => {
                    const amount = parseFloat(order.TotalAmount) || 0;
                    return sum + amount;
                  }, 0))}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by Order ID, Customer Name, or User ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid Only</option>
                  <option value="unpaid">Unpaid Only</option>
                </select>
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

        {/* Orders Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-light border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark fw-semibold">
                Orders List ({filteredOrders.length})
              </h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={fetchOrders}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-inbox fs-1"></i>
                </div>
                <h5 className="text-muted">No orders found</h5>
                <p className="text-muted">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th className="px-3 py-3">
                        <i className="bi bi-hash me-1"></i>Order ID
                      </th>
                      <th className="px-3 py-3">
                        <i className="bi bi-person me-1"></i>Customer
                      </th>
                      <th className="px-3 py-3">
                        <i className="bi bi-calendar me-1"></i>Order Date
                      </th>
                      <th className="px-3 py-3">
                        <i className="bi bi-currency-dollar me-1"></i>Amount
                      </th>
                      <th className="px-3 py-3">
                        <i className="bi bi-credit-card me-1"></i>Payment
                      </th>
                      <th className="px-3 py-3">
                        <i className="bi bi-gear me-1"></i>Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.OrderID} className="border-bottom">
                        <td className="px-3 py-3">
                          <span className="badge bg-light text-dark fs-6">
                            #{order.OrderID}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div>
                            <div className="fw-semibold text-dark">
                              {order.FullName}
                            </div>
                            <small className="text-muted">
                              User ID: {order.UserID}
                            </small>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-dark">
                            {new Date(order.OrderDate).toLocaleDateString('vi-VN')}
                          </div>
                          <small className="text-muted">
                            {new Date(order.OrderDate).toLocaleTimeString('vi-VN')}
                          </small>
                        </td>
                        <td className="px-3 py-3">
                          <span className="fw-bold text-success">
                            {formatCurrency(parseFloat(order.TotalAmount) || 0)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="d-flex flex-column gap-2">
                            <div>
                              <span className={`badge ${getStatusBadgeClass(order.PaymentStatus)} me-2`}>
                                <i className={`bi ${order.PaymentStatus === 'paid' ? 'bi-check-circle' : 'bi-clock'} me-1`}></i>
                                {order.PaymentStatus.toUpperCase()}
                              </span>
                              <small className="text-muted d-block mt-1">
                                via {order.PaymentMethod.toUpperCase()}
                              </small>
                            </div>
                            <button
                              className={`btn btn-sm ${
                                order.PaymentStatus === 'paid' 
                                  ? 'btn-outline-warning' 
                                  : 'btn-outline-success'
                              }`}
                              onClick={() => handleChangeStatus(order.OrderID, order.PaymentStatus)}
                              title={`Mark as ${order.PaymentStatus === 'paid' ? 'unpaid' : 'paid'}`}
                            >
                              <i className={`bi ${
                                order.PaymentStatus === 'paid' 
                                  ? 'bi-x-circle' 
                                  : 'bi-check-circle'
                              } me-1`}></i>
                              {order.PaymentStatus === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/orderDetails/${order.OrderID}`)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderList;