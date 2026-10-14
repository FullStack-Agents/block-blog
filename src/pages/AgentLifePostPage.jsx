import { useParams, Link } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'
import { getAgentLifePostBySlug } from '../utils/agentLife'
import BlogPost from '../components/BlogPost'

export default function AgentLifePostPage() {
  const { slug } = useParams()
  const post = getAgentLifePostBySlug(slug)

  if (!post) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Post not found</Alert.Heading>
        <p className="mb-0">
          Could not find an Agent Life post with slug &ldquo;{slug}&rdquo;.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Link to="/agent-life">
            <Button variant="outline-primary">Back to Agent Life</Button>
          </Link>
        </div>
      </Alert>
    )
  }

  return <BlogPost post={post} />
}
