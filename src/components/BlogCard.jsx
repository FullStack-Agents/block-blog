import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <Card className="mb-4 shadow-sm">
      {post.image && (
        <Link to={`/post/${post.slug}`} className="d-block">
          <Card.Img
            variant="top"
            src={post.image}
            alt={post.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        </Link>
      )}
      <Card.Body>
        {dateStr && (
          <Card.Subtitle className="mb-2 text-muted small">
            {dateStr}
          </Card.Subtitle>
        )}
        <Card.Title>
          <Link to={`/post/${post.slug}`} className="text-decoration-none">
            {post.title}
          </Link>
        </Card.Title>
        {post.excerpt && (
          <Card.Text className="post-excerpt">{post.excerpt}</Card.Text>
        )}
        {post.tags && post.tags.length > 0 && (
          <div>
            {post.tags.map(tag => (
              <span key={tag} className="badge bg-secondary me-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}