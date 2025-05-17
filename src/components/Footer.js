import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <Container>
        <small>&copy; {new Date().getFullYear()} Course Online. All rights reserved.</small>
      </Container>
    </footer>
  );
}
