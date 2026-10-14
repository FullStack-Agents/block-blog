import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link, NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function BlockBlogLayout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Link to="/" className="navbar-brand">
            Block Blog
          </Link>
          <div className="d-flex align-items-center order-lg-last">
            <ThemeToggle />
            <Navbar.Toggle aria-controls="main-navbar" className="ms-2" />
          </div>
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
              <NavLink to="/education" className="nav-link">
                BCH Education
              </NavLink>
              <NavLink to="/slp-tokens" className="nav-link">
                SLP Tokens
              </NavLink>
              <NavLink to="/agent-life" className="nav-link">
                Agent Life
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