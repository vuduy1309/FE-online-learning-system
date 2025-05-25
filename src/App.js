import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import CreateCoursePage from "./pages/course/CreateCoursePage";
import UpdateCoursePage from "./pages/course/UpdateCoursePage";
import ListForManager from "./pages/course/ListForManager";
import CartPage from "./pages/cart/CartPage";
import ConfirmOrderPage from "./pages/order/ConfirmOrderPage";
import InstructorCourses from "./pages/course/InstructorCoursesPage";
import CourseLessons from "./pages/lesson/CourseLesson";
import LessonDetails from "./pages/lesson/LessonDetails";
import UpdateQuizPage from "./pages/quiz/UpdateQuizPage";
import OrderDetails from "./pages/order/OrderDetailsPage";
import AddQuizPage from "./pages/quiz/AddQuizPage";
import QuizDetailPage from "./pages/quiz/QuizDetailPage";
import OrderList from "./pages/order/OderList";
import EnrolledCourses from "./pages/course/EnrolledCourses";
import AvailableLessons from "./pages/lesson/AvailableLessons";
import LearnLessonPage from "./pages/lesson/LearnLessonPage";
import DoQuizPage from "./pages/quiz/DoQuizPage";
import About from "./pages/About";

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
        <Route
          path="/courses/instructorCourses"
          element={<InstructorCourses />}
        />
        <Route path="/courses/:courseId/lessons" element={<CourseLessons />} />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={<LessonDetails />}
        />
        <Route
          path="/courses/:courseId/lessons/quizzes/:lessonId"
          element={<QuizDetailPage />}
        />
        <Route path="/update-quiz/:quizId" element={<UpdateQuizPage />} />
        <Route path="/lesson/:lessonId/add-quiz" element={<AddQuizPage />} />
        <Route path="/orderList" element={<OrderList />} />
        <Route path="/orderDetails/:orderId" element={<OrderDetails />} />
        <Route path="/enrollments/my-courses" element={<EnrolledCourses />} />
        <Route
          path="/availableLessons/:CourseID"
          element={<AvailableLessons />}
        />
        <Route path="/learn/:lessonId" element={<LearnLessonPage />} />
        <Route path="/quizzes/:quizId" element={<DoQuizPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
