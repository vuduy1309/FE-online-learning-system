import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext"; // <-- sửa ở đây

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCartCount } = useCart(); // <-- dùng hook thay vì context trực tiếp

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/cart/view", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(res.data.items);
      setTotalPrice(res.data.totalPrice);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      await axiosInstance.delete(`/cart/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Item removed");
      fetchCart(); // load lại cart
      fetchCartCount(); // update số lượng giỏ hàng
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <h2>Your Cart</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Course Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.CartItemID}>
                    <td style={{ width: "120px" }}>
                      <Image
                        src={item.ImageURL}
                        alt={item.Title}
                        thumbnail
                        style={{ maxWidth: "100px", height: "auto" }}
                      />
                    </td>
                    <td>{item.Title}</td>
                    <td>{item.Description}</td>
                    <td>${parseFloat(item.Price).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(item.CartItemID)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h4>Total: ${parseFloat(totalPrice).toFixed(2)}</h4>
            <Button variant="success">Checkout</Button>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}
