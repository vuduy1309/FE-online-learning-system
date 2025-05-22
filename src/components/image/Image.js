import { useState } from "react";

/**
 * CourseImage Component
 *
 * A reusable component for displaying images with proper URL formatting and fallback support
 *
 * @param {Object} props
 * @param {string} props.src - The source URL of the image
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.fallbackSrc - URL to display if the image fails to load
 * @param {Object} props.style - CSS styles to apply to the image
 * @param {string} props.className - CSS classes to apply to the image
 * @param {Object} props.imgProps - Any additional props to pass to the img element
 */
const Image = ({
  src,
  alt,
  fallbackSrc = "https://via.placeholder.com/300x200?text=No+Image",
  style = {},
  className = "",
  ...imgProps
}) => {
  const [error, setError] = useState(false);

  // Define base URL for images
  const API_BASE_URL = "http://localhost:8080";

  // Function to format image URL correctly
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return fallbackSrc;

    // If the URL already starts with http or https, return it as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Otherwise, prepend the base API URL
    return `${API_BASE_URL}${imageUrl}`;
  };

  // Display fallback if src is null/undefined or if there was an error loading the image
  const imageSrc = error || !src ? fallbackSrc : getImageUrl(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      style={style}
      className={className}
      onError={() => setError(true)}
      {...imgProps}
    />
  );
};

export default Image;
