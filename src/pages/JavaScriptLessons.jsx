import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getAllLessons } from '../utils/lessons'
import LessonCard from '../components/LessonCard'

// Dedicated listing page for the JavaScript Development education track.
const SECTION_KEY = 'javascript-development'
const VARIANT = 'success'

export default function JavaScriptLessons() {
  const lessons = getAllLessons().filter((l) => l.section === SECTION_KEY)

  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-4 fw-bold">JavaScript Lessons</h1>
          <p className="lead mb-0">
            Hands-on lessons for new developers — use JavaScript to read the
            blockchain, build wallets, and interact with Bitcoin Cash.
          </p>
        </Container>
      </div>

      <Container>
        <section className="mb-5">
          <div className="education-section-header education-section-success mb-4">
            <div className="education-section-icon">💻</div>
            <div>
              <div className="education-section-tagline">Build with BCH</div>
              <h2 className="h3 mb-1">JavaScript Development</h2>
              <p className="education-section-desc mb-0">
                {lessons.length} lessons that take you from &ldquo;hello
                world&rdquo; to building real applications on Bitcoin Cash.
              </p>
            </div>
          </div>

          {lessons.length === 0 ? (
            <p className="text-center text-muted">
              Lessons coming soon — check back shortly!
            </p>
          ) : (
            <Row>
              {lessons.map((lesson, index) => (
                <Col key={lesson.slug} md={6} lg={4} className="mb-4">
                  <LessonCard
                    lesson={lesson}
                    index={index}
                    variant={VARIANT}
                  />
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-2">
            <Link to="/education" className="text-decoration-none">
              <Button variant="outline-primary">Back to BCH Education</Button>
            </Link>
          </div>
        </section>
      </Container>
    </>
  )
}
