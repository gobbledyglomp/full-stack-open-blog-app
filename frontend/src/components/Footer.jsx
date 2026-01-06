import { Container } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="py-3 mt-4 mb-1 border-top">
      <Container className="text-center">
        {/* License */}
        <p className="mb-0 small">
          Released under{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            Creative Commons BY-NC-SA 3.0 License
          </a>
        </p>

        {/* Attribution */}
        <p className="mb-0 small">
          Icons by{' '}
          <a
            href="https://icons8.com"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            Icons8
          </a>
        </p>
      </Container>
    </footer>
  )
}

export default Footer
