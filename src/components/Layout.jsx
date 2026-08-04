import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function BlockBlogLayout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Link to="/" className="navbar-brand">
            Block Blog
          </Link>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
              <NavLink to="/blog" className="nav-link">
                Blog
              </NavLink>
              <NavLink to="/ask" className="nav-link">
                Ask Block
              </NavLink>
              <NavLink to="/conversations" className="nav-link">
                Q&A Archive
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  )
}