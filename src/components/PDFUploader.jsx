import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

function PDFUploader({ onTextExtracted, onError, onLoadingChange }) {
  const extractText = async (file) => {
    try {
      onLoadingChange(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `Page ${i}\n${pageText}\n\n`;
      }
      
      onTextExtracted(fullText);
    } catch (error) {
      onError('Error processing PDF: ' + error.message);
    } finally {
      onLoadingChange(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type === 'application/pdf') {
        extractText(file);
      } else {
        onError('Please upload a PDF file');
      }
    }
  }, [onTextExtracted, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the PDF file here...</p>
      ) : (
        <p>Drag and drop a PDF file here, or click to select one</p>
      )}
    </div>
  );
}

export default PDFUploader;