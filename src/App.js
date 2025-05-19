import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import UpdateCoursePage from "./pages/UpdateCoursePage";
import ListForManager from "./pages/ListForManager";
import CartPage from "./pages/CartPage";
import ConfirmOrderPage from "./pages/ConfirmOrderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/courses/create" element={<CreateCoursePage />} />
        <Route path="/courses/update/:id" element={<UpdateCoursePage />} />
        <Route path="/courses/listCourse" element={<ListForManager />} />
        <Route path="/cart/view" element={<CartPage />} />
        <Route path="/checkout" element={<ConfirmOrderPage />} />
        <Route path="/confirm-order" element={<ConfirmOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
