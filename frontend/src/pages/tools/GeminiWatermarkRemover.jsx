import React, { useState, useRef } from 'react';
import { removeWatermarkFromImage } from '@pilio/gemini-watermark-remover';
import { Link } from 'react-router-dom';

export default function GeminiWatermarkRemover() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultDataUrl, setResultDataUrl] = useState(null);
  const [metaInfo, setMetaInfo] = useState(null);
  const imageRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultDataUrl(null);
      setMetaInfo(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResultDataUrl(null);
      setMetaInfo(null);
    }
  };

  const processImage = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const { canvas, meta } = await removeWatermarkFromImage(imageRef.current);
      setResultDataUrl(canvas.toDataURL('image/png'));
      setMetaInfo(meta);
    } catch (error) {
      console.error('Error removing watermark:', error);
      alert('Failed to remove watermark. It might not be a supported Gemini image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>Gemini Watermark Remover</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Remove the visible Google Gemini watermark from generated images using precise reverse alpha blending without quality loss.
      </p>

      {!resultDataUrl ? (
        <>
          <div 
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
            style={{ 
              padding: '4rem 2rem', 
              marginTop: '2rem',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '1.5rem' }}>{file ? file.name : 'Select Gemini Image'}</p>
            <span style={{ fontSize: '1rem', color: '#888', display: 'block', marginTop: '1rem' }}>
              {file ? 'Click to change file' : 'or drop image here'}
            </span>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <img 
                  ref={imageRef}
                  src={URL.createObjectURL(file)} 
                  alt="Original" 
                  style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} 
                />
              </div>
              <button 
                className="btn" 
                onClick={processImage}
                disabled={isProcessing}
                style={{ width: '100%', maxWidth: '300px' }}
              >
                {isProcessing ? 'Removing Watermark...' : 'Remove Watermark'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '3rem', border: '1px solid #e0e0e0', borderRadius: '12px', marginTop: '2rem', textAlign: 'center' }}>
          <h2>Watermark Removed!</h2>
          
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img src={resultDataUrl} alt="Restored" style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </div>

          {metaInfo && (
            <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
              {metaInfo.applied ? (
                <span style={{ color: 'green' }}>✓ Watermark detected and removed ({metaInfo.decisionTier})</span>
              ) : (
                <span style={{ color: 'orange' }}>⚠ No watermark was found in this image.</span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={resultDataUrl} 
              download={`restored_${file.name}`} 
              className="btn"
            >
              Download Restored Image
            </a>
            <button 
              className="btn" 
              style={{ backgroundColor: '#666' }}
              onClick={() => {
                setResultDataUrl(null);
                setFile(null);
                setMetaInfo(null);
              }}
            >
              Process Another Image
            </button>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
