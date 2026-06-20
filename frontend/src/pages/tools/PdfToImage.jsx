import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Set worker src
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setImages([]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg('');
      setImages([]);
    }
  };

  const convertToImages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');
    setImages([]);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async function() {
        try {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const numPages = pdf.numPages;
          const extractedImages = [];

          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // High quality

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            await page.render(renderContext).promise;
            
            // Convert to JPG
            const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
            extractedImages.push({
              pageNumber: i,
              url: imageUrl
            });
          }

          setImages(extractedImages);
          setIsProcessing(false);
        } catch (err) {
          console.error(err);
          setErrorMsg("Failed to process the PDF file.");
          setIsProcessing(false);
        }
      };
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error reading the file.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>PDF to Image</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Convert every page of a PDF document into a high-quality JPG image instantly in your browser.
      </p>

      {!images.length ? (
        <div style={{ marginTop: '2rem' }}>
          <div 
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
            style={{ padding: '3rem 2rem', cursor: 'pointer' }}
          >
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{file ? file.name : 'Select PDF File'}</p>
            <span style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginTop: '1rem' }}>
              {file ? 'Click to change file' : 'or drop file here'}
            </span>
            <input 
              id="file-upload" 
              type="file" 
              accept="application/pdf"
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          {errorMsg && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{errorMsg}</div>}

          {file && (
            <button 
              className="btn btn-primary" 
              onClick={convertToImages}
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.2rem', backgroundColor: 'var(--primary)', color: 'white' }}
            >
              {isProcessing ? 'Converting Pages to Images...' : 'Convert to JPG'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ padding: '2rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Successfully Extracted {images.length} Images!</h2>
            <button 
              className="btn" 
              onClick={() => {
                setImages([]);
                setFile(null);
              }}
              style={{ backgroundColor: '#666' }}
            >
              Convert Another PDF
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {images.map((img) => (
              <div key={img.pageNumber} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', backgroundColor: 'white' }}>
                <img src={img.url} alt={`Page ${img.pageNumber}`} style={{ width: '100%', height: 'auto', border: '1px solid #eee', marginBottom: '1rem' }} />
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Page {img.pageNumber}</p>
                <a 
                  href={img.url} 
                  download={`page_${img.pageNumber}.jpg`} 
                  className="btn"
                  style={{ display: 'block', width: '100%', fontSize: '0.9rem' }}
                >
                  Download JPG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
