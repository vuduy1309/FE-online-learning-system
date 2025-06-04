import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.post(
          `/orders/viewOrderHistory/${user.userId || user.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5">
        <h2 className="mb-4">Order History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info">No orders found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.OrderID}>
                    <td>#{order.OrderID}</td>
                    <td>{new Date(order.OrderDate).toLocaleString()}</td>
                    <td>{order.TotalAmount?.toLocaleString()} VND</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order.PaymentStatus === "paid"
                            ? "success"
                            : "secondary"
                        }`}
                      >
                        {order.PaymentStatus}
                      </span>
                    </td>
                    <td>{order.PaymentMethod}</td>
                    <td>
                      <Link
                        to={`/orderDetails/${order.OrderID}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
