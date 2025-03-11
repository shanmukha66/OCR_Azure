import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="mb-0">© {new Date().getFullYear()} OCR Analytics | Powered by Computer Vision API</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 