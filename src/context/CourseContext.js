// src/context/CourseContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

// Create Context
const CourseContext = createContext();

// Custom hook to use the context
export const useCourseContext = () => {
  return useContext(CourseContext);
};

// Provider Component
export const CourseProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructors, setInstructors] = useState([]);
  
  // Filter states
  const [searchTitle, setSearchTitle] = useState(searchParams.get("title") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [selectedInstructor, setSelectedInstructor] = useState(searchParams.get("instructor") || "");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [coursesPerPage] = useState(6);
  
  // Fetch courses and instructors on initial load
  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);
  
  // Apply filters when URL params change
  useEffect(() => {
    const titleParam = searchParams.get("title") || "";
    const minPriceParam = searchParams.get("minPrice") || "";
    const maxPriceParam = searchParams.get("maxPrice") || "";
    const minRatingParam = searchParams.get("minRating") || "";
    const instructorParam = searchParams.get("instructor") || "";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    
    setSearchTitle(titleParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setMinRating(minRatingParam);
    setSelectedInstructor(instructorParam);
    setCurrentPage(pageParam);
    
    if (courses.length > 0) {
      applyFilters(
        courses, 
        titleParam, 
        minPriceParam, 
        maxPriceParam, 
        minRatingParam, 
        instructorParam
      );
    }
  }, [searchParams, courses]);
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/courses");
      setCourses(res.data);
      
      applyFilters(
        res.data,
        searchParams.get("title") || "",
        searchParams.get("minPrice") || "",
        searchParams.get("maxPrice") || "",
        searchParams.get("minRating") || "",
        searchParams.get("instructor") || ""
      );
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInstructors = async () => {
    try {
      const res = await axiosInstance.get("/courses/instructors");
      setInstructors(res.data);
    } catch (err) {
      console.error("Error fetching instructors:", err);
    }
  };
  
  const applyFilters = (coursesArray, title, min, max, rating, instructor) => {
    let filtered = [...coursesArray];
    
    if (title) {
      filtered = filtered.filter(course => 
        course.Title.toLowerCase().includes(title.toLowerCase())
      );
    }
    
    if (min) {
      filtered = filtered.filter(course => parseFloat(course.Price) >= parseFloat(min));
    }
    
    if (max) {
      filtered = filtered.filter(course => parseFloat(course.Price) <= parseFloat(max));
    }
    
    if (rating) {
      filtered = filtered.filter(course => 
        course.AverageRating && parseFloat(course.AverageRating) >= parseFloat(rating)
      );
    }
    
    if (instructor) {
      filtered = filtered.filter(course => 
        course.InstructorName && course.InstructorName === instructor
      );
    }
    
    setFilteredCourses(filtered);
  };
  
  const handleSearchTitleChange = (value) => {
    setSearchTitle(value);
    
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("title", value);
    } else {
      params.delete("title");
    }
    params.set("page", "1"); // Reset to first page on new search
    setSearchParams(params);
  };
  
  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value);
      
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("minPrice", value);
      } else {
        params.delete("minPrice");
      }
      params.set("page", "1");
      setSearchParams(params);
    } else {
      setMaxPrice(value);
      
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("maxPrice", value);
      } else {
        params.delete("maxPrice");
      }
      params.set("page", "1");
      setSearchParams(params);
    }
  };
  
  const handleRatingChange = (value) => {
    setMinRating(value);
    
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("minRating", value);
    } else {
      params.delete("minRating");
    }
    params.set("page", "1"); 
    setSearchParams(params);
  };
  
  const handleInstructorChange = (value) => {
    setSelectedInstructor(value);
    
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("instructor", value);
    } else {
      params.delete("instructor");
    }
    params.set("page", "1"); 
    setSearchParams(params);
  };
  
  const handleResetFilters = () => {
    setSearchTitle("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSelectedInstructor("");
    setSearchParams({});
    setCurrentPage(1);
  };
  
  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber);
    setSearchParams(params);
  };
  
  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  
  const value = {
    courses,
    filteredCourses,
    loading,
    error,
    instructors,
    searchTitle,
    setSearchTitle,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    selectedInstructor,
    setSelectedInstructor,
    currentPage,
    coursesPerPage,
    currentCourses,
    totalPages,
    indexOfFirstCourse,
    indexOfLastCourse,
    handleSearchTitleChange,
    handlePriceChange,
    handleRatingChange,
    handleInstructorChange,
    handleResetFilters,
    handlePageChange,
    refreshCourses: fetchCourses
  };
  
  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContext;