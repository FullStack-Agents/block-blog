import { Container, Row, Col, Pagination } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import BlogCard from '../components/BlogCard'

const PER_PAGE = 9

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const allPosts = getAllPosts()

  const totalPages = Math.max(1, Math.ceil(allPosts.length / PER_PAGE))
  const rawPage = parseInt(searchParams.get('page') || '1', 10)
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1
  const safePage = Math.min(page, totalPages)

  const start = (safePage - 1) * PER_PAGE
  const posts = allPosts.slice(start, start + PER_PAGE)

  const goToPage = n => {
    if (n < 1 || n > totalPages) return
    setSearchParams(n === 1 ? {} : { page: String(n) })
  }

  // Pagination items: first, prev, numbered window, next, last.
  const pageNumbers = []
  const from = Math.max(1, safePage - 2)
  const to = Math.min(totalPages, safePage + 2)
  for (let i = from; i <= to; i++) pageNumbers.push(i)

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
        <>
          <Row>
            {posts.map(post => (
              <Col key={post.slug} md={6} lg={4}>
                <BlogCard post={post} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First disabled={safePage === 1} onClick={() => goToPage(1)} />
              <Pagination.Prev disabled={safePage === 1} onClick={() => goToPage(safePage - 1)} />
              {from > 1 && (
                <Pagination.Ellipsis disabled />
              )}
              {pageNumbers.map(n => (
                <Pagination.Item
                  key={n}
                  active={n === safePage}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </Pagination.Item>
              ))}
              {to < totalPages && (
                <Pagination.Ellipsis disabled />
              )}
              <Pagination.Next disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)} />
              <Pagination.Last disabled={safePage === totalPages} onClick={() => goToPage(totalPages)} />
            </Pagination>
          )}
        </>
      )}
    </>
  )
}
