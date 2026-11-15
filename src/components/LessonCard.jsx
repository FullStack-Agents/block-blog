import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// A single lesson card used by the Education page and the JavaScript lessons page.
export default function LessonCard({ lesson, index, variant = 'success' }) {
  return (
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
            <Button variant={variant} size="sm">
              Start lesson
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}
