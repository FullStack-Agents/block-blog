import { useParams, Link } from 'react-router-dom'
import { Alert, Button, Container } from 'react-bootstrap'
import { getLessonBySlug } from '../utils/lessons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import VideoEmbed from '../components/VideoEmbed'
import SourceAttribution from '../components/SourceAttribution'

export default function EducationLesson() {
  const { slug } = useParams()
  const lesson = getLessonBySlug(slug)

  if (!lesson) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Lesson not found</Alert.Heading>
        <p className="mb-0">
          Could not find a lesson with slug &ldquo;{slug}&rdquo;.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Link to="/education">
            <Button variant="outline-primary">Back to BCH Education</Button>
          </Link>
        </div>
      </Alert>
    )
  }

  return (
    <Container className="py-4">
      <nav className="mb-3">
        <Link to="/education" className="text-decoration-none">
          &larr; BCH Education
        </Link>
      </nav>

      <article>
        <h1 className="mb-2">{lesson.title}</h1>
        {lesson.date && (
          <p className="text-muted mb-4">
            {new Date(lesson.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* Optional video embed at the top of the lesson */}
        {lesson.video && (
          <VideoEmbed url={lesson.video} title={lesson.title} />
        )}

        {lesson.tags && lesson.tags.length > 0 && (
          <div className="mb-4">
            {lesson.tags.map((tag) => (
              <span key={tag} className="badge bg-secondary me-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="blog-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.body}
          </ReactMarkdown>
        </div>
      </article>

      {/* Source attribution footer (when lesson is adapted from a source) */}
      <SourceAttribution source={lesson.source} />
    </Container>
  )
}
