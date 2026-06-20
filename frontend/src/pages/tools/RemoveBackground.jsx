import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Download, Wand2 } from 'lucide-react';

export default function RemoveBackground() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setErrorMsg('');
      setDownloadUrl(null);
      
      // Create a preview of the original image
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeBg = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/convert/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Background removal failed on the server.');
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
    <div className="tool-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>AI Background Remover</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Use a local AI model to magically remove the background from your images instantly.
      </p>

      {!downloadUrl ? (
        <div style={{ marginTop: '2rem' }}>
          {!originalPreview ? (
            <div 
              className="dropzone"
              onClick={() => document.getElementById('file-upload').click()}
              style={{ padding: '4rem 2rem', cursor: 'pointer', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '12px', backgroundColor: '#f9f9f9' }}
            >
              <UploadCloud size={48} color="#9333ea" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{file ? file.name : 'Select Image'}</p>
              <span style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginTop: '0.5rem' }}>
                {file ? 'Click to change image' : 'or drop image here (JPG, PNG)'}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-block', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #eaeaea', backgroundColor: '#f0f0f0' }}>
                <img src={originalPreview} alt="Original" style={{ maxWidth: '100%', maxHeight: '400px', display: 'block' }} />
                <button 
                  onClick={() => {
                    setFile(null);
                    setOriginalPreview(null);
                  }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Change Image
                </button>
              </div>
            </div>
          )}

          <input 
            id="file-upload" 
            type="file" 
            accept="image/*"
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />

          {errorMsg && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{errorMsg}</div>}

          {file && (
            <button 
              className="btn" 
              onClick={removeBg}
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.2rem', backgroundColor: '#9333ea', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {isProcessing ? (
                <>
                  <Wand2 size={20} className="spin" /> Processing AI Model... (May take a few seconds on first run)
                </>
              ) : (
                <>
                  <Wand2 size={20} /> Remove Background Now
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <h3 style={{ marginBottom: '1rem', color: '#666' }}>Original</h3>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #ccc' }}>
                <img src={originalPreview} alt="Original" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <h3 style={{ marginBottom: '1rem', color: '#9333ea', fontWeight: 'bold' }}>Background Removed</h3>
              {/* Checkerboard background to show transparency */}
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '1px solid #ccc',
                background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgfRMxg/H+A2QjTQIwGYcQOINkYYBhNMjBqyEFDjiwNYjQIQ2Y9zAAA1JtCwbH+T9AAAAAASUVORK5CYII=") repeat'
              }}>
                <img src={downloadUrl} alt="Transparent Result" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '2rem', backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', borderRadius: '12px', marginBottom: '2rem' }}>
            <a 
              href={downloadUrl} 
              download={`nobg_${file.name.replace(/\.[^/.]+$/, "")}.png`} 
              className="btn"
              style={{ padding: '1rem 2rem', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#9333ea' }}
            >
              <Download size={20} />
              Download Transparent PNG
            </a>
          </div>

          <button 
            className="btn" 
            onClick={() => {
              setDownloadUrl(null);
              setFile(null);
              setOriginalPreview(null);
            }}
            style={{ backgroundColor: '#666' }}
          >
            Process Another Image
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
