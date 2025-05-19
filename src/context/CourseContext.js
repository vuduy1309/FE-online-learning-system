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
  
  // Filter states
  const [searchTitle, setSearchTitle] = useState(searchParams.get("title") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [coursesPerPage] = useState(6);
  
  // Fetch courses on initial load
  useEffect(() => {
    fetchCourses();
  }, []);
  
  // Apply filters when URL params change
  useEffect(() => {
    // Get parameters from URL if they exist
    const titleParam = searchParams.get("title") || "";
    const minPriceParam = searchParams.get("minPrice") || "";
    const maxPriceParam = searchParams.get("maxPrice") || "";
    const minRatingParam = searchParams.get("minRating") || "";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    
    // Set states from URL parameters
    setSearchTitle(titleParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setMinRating(minRatingParam);
    setCurrentPage(pageParam);
    
    // Apply filters to courses
    if (courses.length > 0) {
      applyFilters(courses, titleParam, minPriceParam, maxPriceParam, minRatingParam);
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
        searchParams.get("minRating") || ""
      );
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Apply all filters function
  const applyFilters = (coursesArray, title, min, max, rating) => {
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
  
  // Handle rating change (updated to work like price and search)
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
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTitle("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
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
    searchTitle,
    setSearchTitle,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    currentPage,
    coursesPerPage,
    currentCourses,
    totalPages,
    indexOfFirstCourse,
    indexOfLastCourse,
    handleSearchTitleChange,
    handlePriceChange,
    handleRatingChange, // Updated function name
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