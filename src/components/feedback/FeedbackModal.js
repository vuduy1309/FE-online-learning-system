import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Star } from 'lucide-react';
import axiosInstance from '../../api/axios';

const FeedbackModal = ({ show, onHide, courseId, courseTitle, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingFeedback, setExistingFeedback] = useState(null);

  useEffect(() => {
    if (show && courseId) {
      checkExistingFeedback();
    } else {
      setExistingFeedback(null);
      setRating(0);
      setComment('');
      setError('');
    }
  }, [show, courseId]);

  const checkExistingFeedback = async () => {
    try {
      const response = await axiosInstance.get(`/courses/feedback/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success && response.data.feedback) {
        const feedback = response.data.feedback;
        setExistingFeedback(feedback);
        setRating(feedback.Rating);
        setComment(feedback.Comment);
      } else {
        setExistingFeedback(null);
        setRating(0);
        setComment('');
      }
    } catch (error) {
      setExistingFeedback(null);
      setRating(0);
      setComment('');
      console.error('Error checking existing feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let response;
      if (existingFeedback) {
        response = await axiosInstance.put(`/courses/feedback/${existingFeedback.FeedbackID}`, {
          rating,
          comment
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        response = await axiosInstance.post('/courses/feedback/create', {
          courseId,
          rating,
          comment
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      if (response.data.success) {
        onSuccess();
        onHide();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingFeedback) return;
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/courses/feedback/${existingFeedback.FeedbackID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        onSuccess();
        onHide();
        alert('Feedback deleted successfully');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        className={`btn btn-link p-0 mx-1 ${index < rating ? 'text-warning' : 'text-muted'}`}
        onClick={() => setRating(index + 1)}
      >
        <Star size={24} fill={index < rating ? 'currentColor' : 'none'} />
      </button>
    ));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {existingFeedback ? 'Update Feedback' : 'Leave Feedback'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="mb-3">Course: {courseTitle}</h6>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Rating</label>
            <div className="text-center mb-2">
              {renderStars()}
            </div>
            <small className="text-muted d-block text-center">
              {rating ? `You rated this course ${rating} out of 5 stars` : 'Click to rate'}
            </small>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Your Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course..."
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            {existingFeedback && (
              <Button
                variant="outline-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Feedback
              </Button>
            )}
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || !rating}
            >
              {loading ? 'Saving...' : existingFeedback ? 'Update' : 'Submit'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackModal;
