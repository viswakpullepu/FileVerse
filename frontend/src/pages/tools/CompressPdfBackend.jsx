import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Maximize, Download } from 'lucide-react';

export default function CompressPdfBackend() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [compressionResult, setCompressionResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setDownloadUrl(null);
      setCompressionResult(null);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');
    setDownloadUrl(null);
    setCompressionResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/convert/compress-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Compression failed on the server.');
      }

      // Get original and new sizes from custom headers if we implemented them
      // For now, we will just rely on the blob size
      const originalSize = file.size;

      const blob = await response.blob();
      const compressedSize = blob.size;
      
      setCompressionResult({
        original: originalSize,
        compressed: compressedSize,
        ratio: ((1 - (compressedSize / originalSize)) * 100).toFixed(2)
      });

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
      <h1>Compress PDF (Advanced)</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Reduce the file size of your PDF document securely using our server-side compression engine.
      </p>

      {!downloadUrl ? (
        <div style={{ marginTop: '2rem' }}>
          <div 
            className="dropzone"
            onClick={() => document.getElementById('file-upload').click()}
            style={{ padding: '4rem 2rem', cursor: 'pointer', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '12px', backgroundColor: '#f9f9f9' }}
          >
            <UploadCloud size={48} color="#f7c324" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{file ? file.name : 'Select PDF File'}</p>
            <span style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginTop: '0.5rem' }}>
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB - Click to change` : 'or drop file here'}
            </span>
            <input 
              id="file-upload" 
              type="file" 
              accept="application/pdf"
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          {errorMsg && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{errorMsg}</div>}

          {file && (
            <button 
              className="btn" 
              onClick={compressPdf}
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.2rem', backgroundColor: '#f7c324', color: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
            >
              <Maximize size={20} />
              {isProcessing ? 'Compressing PDF...' : 'Compress PDF Now'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ padding: '3rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', marginBottom: '2rem' }}>
            <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Compression Complete!</h2>
            
            {compressionResult && (
              <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', display: 'inline-block', textAlign: 'left' }}>
                <p><strong>Original Size:</strong> {(compressionResult.original / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>New Size:</strong> {(compressionResult.compressed / 1024 / 1024).toFixed(2)} MB</p>
                <p style={{ color: '#15803d', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  Saved {compressionResult.ratio}% !
                </p>
              </div>
            )}
            
            <br/>
            
            <a 
              href={downloadUrl} 
              download={`compressed_${file.name}`} 
              className="btn"
              style={{ padding: '1rem 2rem', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#16a34a' }}
            >
              <Download size={20} />
              Download Compressed PDF
            </a>
          </div>

          <button 
            className="btn" 
            onClick={() => {
              setDownloadUrl(null);
              setFile(null);
              setCompressionResult(null);
            }}
            style={{ backgroundColor: '#666' }}
          >
            Compress Another PDF
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
