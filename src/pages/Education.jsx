import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getAllLessons } from '../utils/lessons'

// Ordered list of education tracks. Each lesson's `section` frontmatter field
// maps to one of these keys. Order here controls the order on the page.
const SECTIONS = [
  {
    key: 'mastering-bitcoin-cash',
    title: 'Mastering Bitcoin Cash',
    icon: '📘',
    tagline: 'The fundamentals',
    description:
      'A guided tour of Bitcoin Cash — what it is, how it works, and how to use it. Adapted from the Mastering Bitcoin Cash series.',
    variant: 'primary',
  },
  {
    key: 'javascript-development',
    title: 'JavaScript Development',
    icon: '💻',
    tagline: 'Build with BCH',
    description:
      'Hands-on lessons for new developers — use JavaScript to read the blockchain, build wallets, and interact with Bitcoin Cash.',
    variant: 'success',
  },
]

export default function Education() {
  const lessons = getAllLessons()

  // Group lessons by section, preserving the SECTIONS order.
  const grouped = SECTIONS.map((section) => ({
    ...section,
    lessons: lessons.filter((l) => l.section === section.key),
  }))

  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-4 fw-bold">BCH Education</h1>
          <p className="lead mb-0">
            Learn about Bitcoin Cash — from the fundamentals to hands-on
            JavaScript development. Pick a track and start building.
          </p>
        </Container>
      </div>

      <Container>
        {grouped.map((section) => (
          <section key={section.key} className="mb-5">
            <div
              className={`education-section-header education-section-${section.variant} mb-4`}
            >
              <div className="education-section-icon">{section.icon}</div>
              <div>
                <div className="education-section-tagline">
                  {section.tagline}
                </div>
                <h2 className="h3 mb-1">{section.title}</h2>
                <p className="education-section-desc mb-0">
                  {section.description}
                </p>
              </div>
            </div>

            {section.lessons.length === 0 ? (
              <p className="text-center text-muted">
                Lessons coming soon — check back shortly!
              </p>
            ) : (
              <Row>
                {section.lessons.map((lesson, index) => (
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
                            <Button variant={section.variant} size="sm">
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
          </section>
        ))}
      </Container>
    </>
  )
}
