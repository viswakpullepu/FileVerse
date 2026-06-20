import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, FileText, Download } from 'lucide-react';

export default function PowerpointToPdf() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setDownloadUrl(null);
    }
  };

  const convertToPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/convert/powerpoint-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed on the server.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>PowerPoint to PDF Converter</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Convert your presentations (.ppt, .pptx) securely into PDF format.
      </p>

      {!downloadUrl ? (
        <div style={{ marginTop: '2rem' }}>
          <div 
            className="dropzone"
            onClick={() => document.getElementById('file-upload').click()}
            style={{ padding: '4rem 2rem', cursor: 'pointer', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '12px', backgroundColor: '#f9f9f9' }}
          >
            <UploadCloud size={48} color="#d32f2f" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{file ? file.name : 'Select PowerPoint File'}</p>
            <span style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginTop: '0.5rem' }}>
              {file ? 'Click to change file' : 'or drop file here (.pptx, .ppt)'}
            </span>
            <input 
              id="file-upload" 
              type="file" 
              accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          {errorMsg && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{errorMsg}</div>}

          {file && (
            <button 
              className="btn" 
              onClick={convertToPdf}
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.2rem', backgroundColor: '#d32f2f', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              <FileText size={20} />
              {isProcessing ? 'Converting to PDF...' : 'Convert to PDF'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ padding: '3rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', marginBottom: '2rem' }}>
            <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Conversion Successful!</h2>
            <p style={{ color: '#15803d', marginBottom: '2rem' }}>Your PDF document is ready to download.</p>
            
            <a 
              href={downloadUrl} 
              download={`converted_${file.name.replace(/\.pptx?$/, '')}.pdf`} 
              className="btn"
              style={{ padding: '1rem 2rem', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#16a34a' }}
            >
              <Download size={20} />
              Download PDF File
            </a>
          </div>

          <button 
            className="btn" 
            onClick={() => {
              setDownloadUrl(null);
              setFile(null);
            }}
            style={{ backgroundColor: '#666' }}
          >
            Convert Another Presentation
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
