import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import OCRAnalytics from './components/OCRAnalytics';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Container>
          <OCRAnalytics />
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App; 