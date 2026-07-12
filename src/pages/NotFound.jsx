import { Link } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'

export default function NotFound() {
  return (
    <Alert variant="danger">
      <Alert.Heading>404 — Page Not Found</Alert.Heading>
      <p className="mb-0">
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Link to="/">
          <Button variant="outline-danger">Back to Home</Button>
        </Link>
      </div>
    </Alert>
  )
}