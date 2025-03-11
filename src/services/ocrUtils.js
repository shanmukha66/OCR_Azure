/**
 * Extracts text from OCR results
 * @param {Object} ocrResults - The OCR results from Azure Computer Vision API
 * @returns {string} - The extracted text
 */
export const extractText = (ocrResults) => {
  if (!ocrResults || !ocrResults.analyzeResult || !ocrResults.analyzeResult.readResults) {
    return '';
  }

  const readResults = ocrResults.analyzeResult.readResults;
  let extractedText = '';

  readResults.forEach(page => {
    if (page.lines) {
      page.lines.forEach(line => {
        extractedText += line.text + '\n';
      });
    }
  });

  return extractedText;
};

/**
 * Categorizes OCR text based on patterns
 * @param {string} text - The extracted text from OCR
 * @returns {Object} - Object with categorized information
 */
export const categorizeText = (text) => {
  const categories = {
    dates: [],
    amounts: [],
    invoiceNumbers: [],
    names: [],
    addresses: [],
    other: []
  };

  if (!text) return categories;

  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim() !== '');

  // Process each line
  lines.forEach(line => {
    // Date patterns (various formats)
    if (/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/.test(line) || 
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/i.test(line) ||
        /\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b/.test(line)) {
      categories.dates.push(line);
    }
    // Money amounts
    else if (/\$\s*\d+([.,]\d+)*/.test(line) || /\b\d+([.,]\d+)*\s*(USD|EUR|GBP)\b/.test(line)) {
      categories.amounts.push(line);
    }
    // Invoice numbers
    else if (/\b(invoice|inv|order|receipt)[\s\-\:#]*\d+\b/i.test(line) || /\b[A-Z]{2,}\-\d+\b/.test(line)) {
      categories.invoiceNumbers.push(line);
    }
    // Names (simplified detection)
    else if (/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line.trim())) {
      categories.names.push(line);
    }
    // Addresses (simplified detection)
    else if ((/\d+\s+[A-Za-z\s,]+\b(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/i.test(line)) ||
             (/\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/.test(line))) {
      categories.addresses.push(line);
    }
    // Other text
    else {
      categories.other.push(line);
    }
  });

  return categories;
};

/**
 * Analyzes OCR results to extract structured information
 * @param {Object} ocrResults - The OCR results from Azure Computer Vision API
 * @returns {Object} - Object with extracted and categorized information
 */
export const analyzeOCRResults = (ocrResults) => {
  const extractedText = extractText(ocrResults);
  const categories = categorizeText(extractedText);
  
  return {
    rawText: extractedText,
    categories: categories
  };
}; 