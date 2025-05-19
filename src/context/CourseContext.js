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
    // Get parameters from URL if they exist
    const titleParam = searchParams.get("title") || "";
    const minPriceParam = searchParams.get("minPrice") || "";
    const maxPriceParam = searchParams.get("maxPrice") || "";
    const minRatingParam = searchParams.get("minRating") || "";
    const instructorParam = searchParams.get("instructor") || "";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    
    // Set states from URL parameters
    setSearchTitle(titleParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setMinRating(minRatingParam);
    setSelectedInstructor(instructorParam);
    setCurrentPage(pageParam);
    
    // Apply filters to courses
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
  
  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/courses");
      setCourses(res.data);
      
      // Apply any existing filters
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
  
  // Fetch instructors for the filter dropdown
  const fetchInstructors = async () => {
    try {
      const res = await axiosInstance.get("/courses/instructors");
      setInstructors(res.data);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      // Don't set error state here to avoid blocking the main UI
    }
  };
  
  // Apply all filters function
  const applyFilters = (coursesArray, title, min, max, rating, instructor) => {
    let filtered = [...coursesArray];
    
    // Filter by title
    if (title) {
      filtered = filtered.filter(course => 
        course.Title.toLowerCase().includes(title.toLowerCase())
      );
    }
    
    // Filter by min price
    if (min) {
      filtered = filtered.filter(course => parseFloat(course.Price) >= parseFloat(min));
    }
    
    // Filter by max price
    if (max) {
      filtered = filtered.filter(course => parseFloat(course.Price) <= parseFloat(max));
    }
    
    // Filter by rating
    if (rating) {
      filtered = filtered.filter(course => 
        course.AverageRating && parseFloat(course.AverageRating) >= parseFloat(rating)
      );
    }
    
    // Filter by instructor
    if (instructor) {
      filtered = filtered.filter(course => 
        course.InstructorName && course.InstructorName === instructor
      );
    }
    
    setFilteredCourses(filtered);
  };
  
  // Handle search title change
  const handleSearchTitleChange = (value) => {
    setSearchTitle(value);
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("title", value);
    } else {
      params.delete("title");
    }
    params.set("page", "1"); // Reset to first page on new search
    setSearchParams(params);
  };
  
  // Handle price change
  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value);
      
      // Update URL parameters
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
      
      // Update URL parameters
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
  
  // Handle rating change
  const handleRatingChange = (value) => {
    setMinRating(value);
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("minRating", value);
    } else {
      params.delete("minRating");
    }
    params.set("page", "1"); // Reset to first page on new filter
    setSearchParams(params);
  };
  
  // Handle instructor change
  const handleInstructorChange = (value) => {
    setSelectedInstructor(value);
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("instructor", value);
    } else {
      params.delete("instructor");
    }
    params.set("page", "1"); // Reset to first page on new filter
    setSearchParams(params);
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTitle("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSelectedInstructor("");
    setSearchParams({});
    setCurrentPage(1);
  };
  
  // Change page handler
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
  
  // Values to provide in context
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