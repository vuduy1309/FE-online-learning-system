import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Nav, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../../api/axios';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const LearnLessonPage = () => {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/${lessonId}`);
        setLessonData(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Không thể tải dữ liệu bài học.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="text-muted">Đang tải bài học...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!lessonData) return null;

  const { lesson, materials, quizzes, navigation, courseLessons } = lessonData;

  return (
    <>
    <Header/>
    <Container fluid className="py-4">
      <Row className="g-4">
        {/* Sidebar Navigation */}
        <Col lg={3}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Nội dung khóa học
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                {courseLessons.map((l) => (
                  <Nav.Item key={l.id}>
                    <Nav.Link
                      as={Link}
                      to={`/learn/${l.id}`}
                      className={`d-flex align-items-center px-3 py-2 border-bottom ${
                        l.isCurrent 
                          ? 'bg-primary text-white fw-bold' 
                          : 'text-dark'
                      }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Badge 
                        bg={l.isCurrent ? 'light' : 'secondary'} 
                        text={l.isCurrent ? 'dark' : 'white'}
                        className="me-2"
                      >
                        {l.orderNumber}
                      </Badge>
                      <span className="text-truncate">{l.title}</span>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Lesson Content */}
        <Col lg={9}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h1 className="h3 mb-1 text-primary">{lesson.title}</h1>
              <p className="text-muted mb-0">
                <i className="bi bi-book me-1"></i>
                Khóa học: {lesson.courseTitle}
              </p>
            </Card.Header>
            
            <Card.Body>
              {/* Introduction Section */}
              <div className="mb-4">
                <h4 className="text-secondary border-bottom pb-2 mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Giới thiệu
                </h4>
                <p className="lead">{lesson.introduction}</p>
              </div>

              {/* Content Section */}
              <div className="mb-4">
                <h4 className="text-secondary border-bottom pb-2 mb-3">
                  <i className="bi bi-file-text me-2"></i>
                  Nội dung
                </h4>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>

              {/* Example Section */}
              {lesson.example && (
                <div className="mb-4">
                  <h4 className="text-secondary border-bottom pb-2 mb-3">
                    <i className="bi bi-code-slash me-2"></i>
                    Ví dụ
                  </h4>
                  <Card className="bg-light">
                    <Card.Body>
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {lesson.example}
                      </pre>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Materials Section */}
              {materials.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-secondary border-bottom pb-2 mb-3">
                    <i className="bi bi-folder me-2"></i>
                    Tài liệu
                  </h4>
                  <Row>
                    {materials.map((m) => (
                      <Col md={6} key={m.id} className="mb-2">
                        <Card className="h-100 border-0 bg-light">
                          <Card.Body className="d-flex align-items-center">
                            <i className="bi bi-file-earmark-text text-primary me-2"></i>
                            <div className="flex-grow-1">
                              <Badge bg="info" className="me-2">{m.type}</Badge>
                              <a 
                                href={m.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-decoration-none stretched-link"
                              >
                                Material #{m.id}
                              </a>
                            </div>
                            <i className="bi bi-box-arrow-up-right text-muted"></i>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Quizzes Section */}
              {quizzes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-secondary border-bottom pb-2 mb-3">
                    <i className="bi bi-question-circle me-2"></i>
                    Câu hỏi kiểm tra
                  </h4>
                  <Row>
                    {quizzes.map((q) => (
                      <Col md={6} key={q.id} className="mb-2">
                        <Card className="h-100 border-0 bg-warning bg-opacity-10">
                          <Card.Body className="d-flex align-items-center">
                            <i className="bi bi-patch-question text-warning me-2"></i>
                            <div className="flex-grow-1">
                              <Link 
                                to={`/quizzes/${q.id}`} 
                                className="text-decoration-none stretched-link fw-medium"
                              >
                                {q.title}
                              </Link>
                            </div>
                            <i className="bi bi-arrow-right text-muted"></i>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>

            {/* Navigation Footer */}
            <Card.Footer className="bg-light">
              <Row className="align-items-center">
                <Col>
                  {navigation.previous ? (
                    <Button 
                      as={Link} 
                      to={`/learn/${navigation.previous.id}`} 
                      variant="outline-primary"
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      <span className="text-truncate">Bài trước: {navigation.previous.title}</span>
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </Col>
                <Col xs="auto" className="text-center">
                  <Badge bg="secondary" className="px-3 py-2">
                    Bài học {lesson.orderNumber || lessonId}
                  </Badge>
                </Col>
                <Col className="text-end">
                  {navigation.next ? (
                    <Button 
                      as={Link} 
                      to={`/learn/${navigation.next.id}`} 
                      variant="outline-primary"
                      className="d-flex align-items-center justify-content-end"
                    >
                      <span className="text-truncate">Bài tiếp: {navigation.next.title}</span>
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
    <Footer/>
    </>
  );
};

export default LearnLessonPage;