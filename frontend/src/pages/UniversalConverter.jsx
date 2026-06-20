import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function UniversalConverter() {
  const { categoryId } = useParams();
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');

  // Map categories to some dummy target formats for UI scaffolding
  const formatMap = {
    documents: ['PDF', 'DOCX', 'TXT', 'ODT'],
    images: ['JPG', 'PNG', 'WEBP', 'SVG', 'AVIF'],
    video: ['MP4', 'WEBM', 'GIF', 'AVI'],
    audio: ['MP3', 'WAV', 'OGG', 'FLAC'],
    data: ['JSON', 'CSV', 'XML', 'YAML'],
    code: ['HTML', 'MD', 'JS', 'CSS'],
    archives: ['ZIP', 'TAR', '7Z'],
    '3d': ['GLTF', 'STL', 'OBJ'],
    ebooks: ['EPUB', 'MOBI', 'AZW3'],
    fonts: ['WOFF2', 'TTF', 'OTF'],
    subtitles: ['SRT', 'VTT', 'ASS'],
    gis: ['GEOJSON', 'KML', 'SHP'],
    manipulation: ['Trim Video', 'Compress Image', 'Resize Document'],
    developer: ['Base64 Encode', 'Base64 Decode', 'Minify JSON'],
    security: ['Encrypt (AES)', 'Decrypt (AES)', 'Generate SHA-256'],
    ai: ['Generate Image', 'Transcribe Audio', 'OCR Extract']
  };

  const availableFormats = formatMap[categoryId] || ['Unknown'];

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ padding: '3rem', backgroundColor: '#f8f9fa', borderRadius: '16px', border: '1px dashed #ccc' }}>
        <h1 style={{ textTransform: 'capitalize', marginBottom: '1rem', color: '#333' }}>{categoryId.replace('_', ' ')} Converter</h1>
        <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Coming Soon in Phase 2!</h2>
        <p style={{ marginTop: '1rem', color: '#555', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          We have built 39 completely native, fully-offline tools that run instantly in your browser!
          <br /><br />
          However, complex conversions like <strong>Word to PDF</strong>, <strong>AI Summarization</strong>, <strong>OCR</strong>, and <strong>Heavy 3D Rendering</strong> require dedicated backend processing servers. We are currently calibrating these backend engines and they will be unlocked in the next major update.
        </p>
        <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: '3rem', padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Explore the 39 Available Tools
        </Link>
      </div>
    </div>
  );
}
