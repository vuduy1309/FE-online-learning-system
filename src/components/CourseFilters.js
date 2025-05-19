// src/components/CourseFilters.js
import { Form, Button, InputGroup } from "react-bootstrap";
import { useCourseContext } from "../context/CourseContext";

export function SearchBar() {
  const { searchTitle, handleSearchTitleChange } = useCourseContext();

  return (
    <InputGroup className="mb-4">
      <Form.Control
        placeholder="Search courses by title..."
        value={searchTitle}
        onChange={(e) => handleSearchTitleChange(e.target.value)}
        className="py-2"
      />
    </InputGroup>
  );
}

export function SidebarFilters() {
  const {
    minPrice,
    maxPrice,
    minRating,
    handlePriceChange,
    handleRatingChange, // Updated function name
    handleResetFilters
  } = useCourseContext();

  return (
    <div className="mb-4">
      <h4 className="mb-3">Filters</h4>
      
      <div className="mb-4">
        <h5 className="mb-2">Price Range</h5>
        <Form.Group className="mb-3">
          <Form.Label>Min Price ($)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            min="0"
            step="0.01"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Max Price ($)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            min="0"
            step="0.01"
          />
        </Form.Group>
      </div>
      
      <div className="mb-4">
        <h5 className="mb-2">Rating</h5>
        <Form.Group className="mb-3">
          <Form.Select
            value={minRating}
            onChange={(e) => handleRatingChange(e.target.value)} // Auto-apply on change
          >
            <option value="">Any Rating</option>
            <option value="1">1+ Star</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </Form.Select>
        </Form.Group>
        {/* Removed the Apply Rating Filter button */}
      </div>
      
      <Button 
        variant="outline-secondary" 
        size="sm" 
        onClick={handleResetFilters} 
        className="w-100"
      >
        Reset All Filters
      </Button>
    </div>
  );
}