import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getAllLessons } from '../utils/lessons'

export default function Education() {
  const lessons = getAllLessons()

  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-4 fw-bold">BCH Education</h1>
          <p className="lead mb-0">
            A series of lessons to learn about Bitcoin Cash — what it is, how it
            works, and how to use it.
          </p>
        </Container>
      </div>

      <Container>
        {lessons.length === 0 ? (
          <p className="text-center text-muted">
            No lessons yet. Check back soon!
          </p>
        ) : (
          <Row>
            {lessons.map((lesson, index) => (
              <Col key={lesson.slug} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Subtitle className="mb-2 text-muted text-uppercase small">
                      Lesson {index + 1}
                    </Card.Subtitle>
                    <Card.Title>
                      <Link
                        to={`/education/${lesson.slug}`}
                        className="text-decoration-none"
                      >
                        {lesson.title}
                      </Link>
                    </Card.Title>
                    {lesson.description && (
                      <Card.Text className="text-muted flex-grow-1">
                        {lesson.description}
                      </Card.Text>
                    )}
                    <div className="mt-3">
                      <Link
                        to={`/education/${lesson.slug}`}
                        className="text-decoration-none"
                      >
                        <Button variant="primary" size="sm">
                          Start lesson
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  )
}
