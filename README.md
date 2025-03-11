# OCR Analytics Application

This application demonstrates the integration of Optical Character Recognition (OCR) technology with a modern web UI. It allows users to upload images containing text and analyzes them to extract and categorize textual information.

## Features

- **Image Upload**: Easy-to-use interface for uploading images
- **OCR Processing**: Extracts text from images using Computer Vision API
- **Text Categorization**: Automatically categorizes extracted text into meaningful groups (dates, amounts, invoice numbers, etc.)
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React**: Frontend library for building the user interface
- **Bootstrap**: CSS framework for responsive design
- **Azure Computer Vision API**: For OCR processing (mock implementation included for demo)
- **Axios**: For making HTTP requests to the API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```

1. Install dependencies
```
npm install
```

2. Configure API Key (for production use)
   - Open `src/services/ocrService.js`
   - Replace `YOUR_API_KEY` with your actual Azure Computer Vision API key

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click "Select Image" to upload an image containing text
2. Review the image preview
3. Click "Analyze with OCR" to process the image
4. View the extracted text and categorized information in the results section

## Demo Mode

The application includes a mock OCR service for demonstration purposes. To use the actual Azure Computer Vision API:

1. Obtain an API key from the [Azure Portal](https://portal.azure.com)
2. Update the `API_KEY` constant in `src/services/ocrService.js`
3. Comment out the mock service call and uncomment the actual service call in the `handleAnalyze` function in `src/components/OCRAnalytics.js`

```

##Sample Working

[!alt text](sample.png)
