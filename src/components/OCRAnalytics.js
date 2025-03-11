import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { FaUpload, FaSearch, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { mockOCRAnalysis } from '../services/ocrService';
import { analyzeOCRResults } from '../services/ocrUtils';

const OCRAnalytics = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Move to next step
    setActiveStep(2);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use mock service for demo (replace with actual service in production)
      const ocrResults = await mockOCRAnalysis(selectedFile);
      const analyzedResults = analyzeOCRResults(ocrResults);
      setResults(analyzedResults);
      setActiveStep(3);
    } catch (err) {
      setError('Error analyzing image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItems = (items, title) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-3">
        <h6>{title}</h6>
        <ListGroup>
          {items.map((item, index) => (
            <ListGroup.Item key={index} className="d-flex align-items-center">
              <FaCheckCircle className="text-success me-2" />
              {item}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-center mb-4">OCR Analytics</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className={`step-container ${activeStep === 1 ? 'border-primary' : ''}`}>
            <div className="step-header">
              <h5 className="mb-0">Step 1</h5>
            </div>
            <Card.Body>
              <Card.Title>Select Image</Card.Title>
              <Card.Text>
                Upload an image containing text that you want to analyze.
              </Card.Text>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Choose an image file</Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
              <Button 
                variant="primary" 
                className="w-100 d-flex justify-content-center align-items-center"
                onClick={() => document.getElementById('formFile').click()}
              >
                <FaUpload className="me-2" /> Select Image
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className={`step-container ${activeStep === 2 ? 'border-primary' : ''}`}>
            <div className="step-header">
              <h5 className="mb-0">Step 2</h5>
            </div>
            <Card.Body>
              <Card.Title>Analyze Image</Card.Title>
              <Card.Text>
                Review your selected image and run OCR analysis.
              </Card.Text>
              
              {imagePreview && (
                <div className="text-center mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                  />
                </div>
              )}
              
              <Button 
                variant="primary" 
                className="w-100 d-flex justify-content-center align-items-center"
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" /> Analyze with OCR
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className={`step-container ${activeStep === 3 ? 'border-primary' : ''}`}>
            <div className="step-header">
              <h5 className="mb-0">Step 3</h5>
            </div>
            <Card.Body>
              <Card.Title>OCR Results</Card.Title>
              <Card.Text>
                View the extracted text and categorized information.
              </Card.Text>
              
              {results && (
                <div className="results-container">
                  <h6 className="d-flex align-items-center mb-3">
                    <FaFileAlt className="me-2" /> 
                    Extracted Text Categories
                  </h6>
                  
                  {renderCategoryItems(results.categories.dates, 'Dates')}
                  {renderCategoryItems(results.categories.amounts, 'Amounts')}
                  {renderCategoryItems(results.categories.invoiceNumbers, 'Invoice/Reference Numbers')}
                  {renderCategoryItems(results.categories.names, 'Names')}
                  {renderCategoryItems(results.categories.addresses, 'Addresses')}
                  {renderCategoryItems(results.categories.other, 'Other Information')}
                  
                  <div className="mt-3">
                    <h6>Raw Text</h6>
                    <pre className="bg-light p-3 rounded">
                      {results.rawText || 'No text extracted'}
                    </pre>
                  </div>
                </div>
              )}
              
              {!results && activeStep === 3 && (
                <div className="text-center text-muted">
                  <p>No results to display yet. Complete the previous steps.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default OCRAnalytics; 