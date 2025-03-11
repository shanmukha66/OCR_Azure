import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { FaRegLightbulb } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header">
      <Navbar expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <FaRegLightbulb className="me-2" size={24} />
            <span>Cognitive Services OCR Analytics</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 