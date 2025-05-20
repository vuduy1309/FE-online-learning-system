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
import InstructorCourses from "./pages/InstructorCoursesPage";
import CourseLessons from "./pages/CourseLesson";
import LessonDetails from "./pages/LessonDetails";
import QuizDetailPage from "./pages/QuizDetailPage";
import UpdateQuizPage from "./pages/UpdateQuizPage";
import AddQuizPage from "./pages/AddQuizPage";


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
        <Route path="/courses/instructorCourses" element={<InstructorCourses />} />
        <Route path="/courses/:courseId/lessons" element={<CourseLessons />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonDetails />} />
        <Route path="/courses/:courseId/lessons/quizzes/:lessonId" element={<QuizDetailPage />} />
        <Route path="/update-quiz/:quizId" element={<UpdateQuizPage />} />
        <Route path="/lesson/:lessonId/add-quiz" element={<AddQuizPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
