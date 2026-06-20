import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite your **markdown** here!');
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      setHtml(marked.parse(markdown));
    } catch (e) {
      setHtml('<p style="color:red;">Error parsing markdown</p>');
    }
  }, [markdown]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    alert('HTML copied to clipboard!');
  };

  return (
    <div className="tool-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Markdown to HTML Converter</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Write Markdown on the left and see the HTML output instantly on the right.
      </p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>Markdown Input:</label>
            <button className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#dc3545' }} onClick={() => setMarkdown('')}>
              Clear
            </button>
          </div>
          <textarea 
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            style={{ width: '100%', height: '500px', padding: '1rem', fontFamily: 'monospace', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>HTML Output:</label>
            <button className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={copyHtml}>
              Copy HTML
            </button>
          </div>
          <textarea 
            readOnly
            value={html}
            style={{ width: '100%', height: '500px', padding: '1rem', fontFamily: 'monospace', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', resize: 'vertical' }}
          />
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Live Preview</h2>
        <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} style={{ padding: '1rem', border: '1px dashed #ccc', minHeight: '100px' }} />
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
