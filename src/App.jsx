import { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import './App.css';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextExtracted = (text) => {
    setExtractedText(text);
    setError('');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setExtractedText('');
  };

  return (
    <div className="container">
      <h1>PDF Text Extractor</h1>
      
      <PDFUploader
        onTextExtracted={handleTextExtracted}
        onError={handleError}
        onLoadingChange={setIsLoading}
      />

      {isLoading && (
        <div className="loading">
          <p>Processing PDF...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {extractedText && (
        <div className="result">
          <h2>Extracted Text</h2>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;