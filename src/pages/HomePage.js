// src/pages/HomePage.js
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SearchBar, SidebarFilters } from "../components/CourseFilters";
import CourseList from "../components/CourseList";
import CoursePagination from "../components/CoursePagination";
import { CourseProvider } from "../context/CourseContext";

export default function HomePage() {
  return (
    <CourseProvider>
      <Header />
      <Container className="mt-5 mb-5">
        <h2 className="mb-4 text-center">Available Courses</h2>
        
        <Row>
          {/* Left Sidebar with Filters */}
          <Col lg={3} md={4}>
            <SidebarFilters />
          </Col>

          {/* Main Content - Course List */}
          <Col lg={9} md={8}>
            {/* Search Bar aligned right */}
            <Row>
              <Col md={4}>
                          <div className="d-flex justify-content-end mb-3">
              <SearchBar />
            </div></Col>
            </Row>


            {/* Course List */}
            <CourseList />
            
            {/* Pagination */}
            <CoursePagination />
          </Col>
        </Row>
      </Container>
      <Footer />
    </CourseProvider>
  );
}
