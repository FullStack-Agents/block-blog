import { Container, Row, Col } from 'react-bootstrap'
import { getAllPosts } from '../utils/posts'
import BlogCard from '../components/BlogCard'

export default function Home() {
  const posts = getAllPosts()

  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-4 fw-bold">Block Blog</h1>
          <p className="lead mb-0">
            Thoughts on coding, crypto, and building things that matter.
          </p>
        </Container>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted">No posts yet. Check back soon!</p>
      ) : (
        <Row>
          {posts.map(post => (
            <Col key={post.slug} md={6} lg={4}>
              <BlogCard post={post} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}