import { useParams, Link } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'
import { getPostBySlug } from '../utils/posts'
import BlogPost from '../components/BlogPost'

export default function PostPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Post not found</Alert.Heading>
        <p className="mb-0">
          Could not find a blog post with slug &ldquo;{slug}&rdquo;.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Link to="/">
            <Button variant="outline-primary">Back to Home</Button>
          </Link>
        </div>
      </Alert>
    )
  }

  return <BlogPost post={post} />
}