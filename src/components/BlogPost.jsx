import ReactMarkdown from 'react-markdown'

// Post markdown bodies begin with a `# Title` heading, but the title is already
// rendered as the <h1> below. Strip that leading heading so it doesn't appear twice.
function stripLeadingHeading(md) {
  return md.replace(/^\s*#\s+.*\n/, '')
}

export default function BlogPost({ post }) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="img-fluid rounded mb-4 w-100"
          style={{ maxHeight: '420px', objectFit: 'cover' }}
        />
      )}
      <h1 className="mb-2">{post.title}</h1>
      {dateStr && (
        <p className="text-muted mb-4">{dateStr}</p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="badge bg-secondary me-1">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="blog-content">
        <ReactMarkdown>{stripLeadingHeading(post.body)}</ReactMarkdown>
      </div>
    </article>
  )
}