import axios from 'axios';

// Replace with your actual API key and endpoint
const API_KEY = 'YOUR_API_KEY';
const API_ENDPOINT = 'https://api.cognitive.microsoft.com/vision/v3.2/read/analyze';

/**
 * Submits an image to the Azure Computer Vision API for OCR analysis
 * @param {File|Blob|string} image - The image to analyze (File, Blob, or base64 string)
 * @returns {Promise} - Promise with the operation location for polling
 */
export const submitImageForOCR = async (image) => {
  // Prepare the image data
  let data;
  let headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/octet-stream',
  };

  if (typeof image === 'string' && image.startsWith('data:')) {
    // Handle base64 image
    data = Buffer.from(image.split(',')[1], 'base64');
  } else if (image instanceof File || image instanceof Blob) {
    // Handle File or Blob
    data = await image.arrayBuffer();
  } else {
    throw new Error('Unsupported image format');
  }

  try {
    const response = await axios.post(API_ENDPOINT, data, { headers });
    return response.headers['operation-location'];
  } catch (error) {
    console.error('Error submitting image for OCR:', error);
    throw error;
  }
};

/**
 * Polls the Azure Computer Vision API for OCR results
 * @param {string} operationLocation - The operation location URL to poll
 * @returns {Promise} - Promise with the OCR results
 */
export const getOCRResults = async (operationLocation) => {
  const headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
  };

  try {
    // Poll until the operation is complete
    let status = 'notStarted';
    let result;

    while (status !== 'succeeded' && status !== 'failed') {
      const response = await axios.get(operationLocation, { headers });
      result = response.data;
      status = result.status;

      if (status !== 'succeeded' && status !== 'failed') {
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (status === 'failed') {
      throw new Error('OCR operation failed');
    }

    return result;
  } catch (error) {
    console.error('Error getting OCR results:', error);
    throw error;
  }
};

/**
 * Mock function for demo purposes when you don't have an actual API key
 * @param {File|Blob|string} image - The image to analyze
 * @returns {Promise} - Promise with mock OCR results
 */
export const mockOCRAnalysis = async (image) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data
  return {
    status: 'succeeded',
    analyzeResult: {
      readResults: [
        {
          page: 1,
          lines: [
            {
              text: 'Sample Invoice',
              boundingBox: [100, 100, 300, 100, 300, 130, 100, 130]
            },
            {
              text: 'Date: 2023-03-15',
              boundingBox: [100, 150, 300, 150, 300, 180, 100, 180]
            },
            {
              text: 'Invoice #: INV-12345',
              boundingBox: [100, 200, 300, 200, 300, 230, 100, 230]
            },
            {
              text: 'Total Amount: $250.00',
              boundingBox: [100, 250, 300, 250, 300, 280, 100, 280]
            }
          ]
        }
      ]
    }
  };
}; 