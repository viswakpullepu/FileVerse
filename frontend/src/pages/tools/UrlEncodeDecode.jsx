import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UrlEncodeDecode() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [errorMsg, setErrorMsg] = useState('');

  const processText = () => {
    setErrorMsg('');
    try {
      if (mode === 'encode') {
        setOutputText(encodeURIComponent(inputText));
      } else {
        setOutputText(decodeURIComponent(inputText));
      }
    } catch (err) {
      setErrorMsg(`Failed to ${mode}. The input might contain malformed URI sequences.`);
      setOutputText('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    alert('Copied to clipboard!');
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>URL Encoder/Decoder</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Safely encode URL parameters or decode complex URL strings directly in your browser.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>
        <button 
          className="btn" 
          style={{ flex: 1, backgroundColor: mode === 'encode' ? 'var(--primary)' : '#eee', color: mode === 'encode' ? 'white' : '#333' }}
          onClick={() => { setMode('encode'); setOutputText(''); setErrorMsg(''); }}
        >
          URL Encode
        </button>
        <button 
          className="btn" 
          style={{ flex: 1, backgroundColor: mode === 'decode' ? 'var(--primary)' : '#eee', color: mode === 'decode' ? 'white' : '#333' }}
          onClick={() => { setMode('decode'); setOutputText(''); setErrorMsg(''); }}
        >
          URL Decode
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Input Text / URL:
        </label>
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === 'encode' ? "Enter text or URL parameters to encode..." : "Enter encoded URL string to decode..."}
          style={{ width: '100%', height: '150px', padding: '1rem', fontFamily: 'monospace', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
        />
      </div>

      {errorMsg && <div style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</div>}

      <button 
        className="btn" 
        onClick={processText}
        style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}
        disabled={!inputText}
      >
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>
      
      {outputText && (
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>Result:</label>
            <button className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={copyToClipboard}>
              Copy Result
            </button>
          </div>
          <textarea 
            readOnly
            value={outputText}
            style={{ width: '100%', height: '150px', padding: '1rem', fontFamily: 'monospace', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', resize: 'vertical' }}
          />
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
