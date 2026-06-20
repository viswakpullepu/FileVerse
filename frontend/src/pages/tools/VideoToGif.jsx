import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Link } from 'react-router-dom';

export default function VideoToGif() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedGifUrl, setProcessedGifUrl] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('progress', ({ progress, time }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setIsLoaded(true);
    } catch (e) {
      console.error("Error loading FFmpeg:", e);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const convertToGif = async () => {
    if (!file || !isLoaded) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // Convert to GIF, scaling to width 480 (maintaining aspect ratio) and 10 FPS
      await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'fps=10,scale=480:-1:flags=lanczos', '-c:v', 'gif', 'output.gif']);
      
      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([data.buffer], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      
      setProcessedGifUrl(url);
    } catch (error) {
      console.error('Error converting video:', error);
      alert('Failed to convert video to GIF.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>Video to GIF</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Convert MP4 or WebM videos into lightweight, shareable GIFs completely offline using WebAssembly.
      </p>

      {!isLoaded && (
        <div style={{ padding: '2rem', background: '#fff3cd', color: '#856404', borderRadius: '8px', marginTop: '2rem' }}>
          Loading WebAssembly Core... Please wait.
        </div>
      )}

      {!processedGifUrl ? (
        <>
          <div 
            className={`dropzone ${!isLoaded ? 'disabled' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => isLoaded && document.getElementById('file-upload').click()}
            style={{ 
              padding: '4rem 2rem', 
              marginTop: '2rem',
              opacity: isLoaded ? 1 : 0.5,
              cursor: isLoaded ? 'pointer' : 'not-allowed'
            }}
          >
            <p style={{ fontSize: '1.5rem' }}>{file ? file.name : 'Select Video File'}</p>
            <span style={{ fontSize: '1rem', color: '#888', display: 'block', marginTop: '1rem' }}>
              {file ? 'Click to change file' : 'or drop Video here (MP4, WebM)'}
            </span>
            <input 
              id="file-upload" 
              type="file" 
              accept="video/mp4,video/webm" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              disabled={!isLoaded}
            />
          </div>

          {file && (
            <div style={{ marginTop: '2rem', textAlign: 'left', padding: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
              <button 
                className="btn" 
                onClick={convertToGif}
                disabled={isProcessing || !isLoaded}
                style={{ width: '100%', position: 'relative', overflow: 'hidden' }}
              >
                {isProcessing && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transition: 'width 0.2s'
                  }}></div>
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {isProcessing ? `Converting to GIF... ${progress}%` : 'Convert to GIF'}
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '3rem', border: '1px solid #e0e0e0', borderRadius: '12px', marginTop: '2rem', textAlign: 'center' }}>
          <h2>GIF Created Successfully!</h2>
          
          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <img 
              src={processedGifUrl} 
              alt="Generated GIF preview" 
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={processedGifUrl} 
              download={`converted_${file.name.split('.')[0]}.gif`} 
              className="btn"
            >
              Download GIF
            </a>
            <button 
              className="btn" 
              style={{ backgroundColor: '#666' }}
              onClick={() => {
                setProcessedGifUrl(null);
                setFile(null);
              }}
            >
              Convert Another Video
            </button>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>&larr; Back to Fileverse Dashboard</Link>
      </div>
    </div>
  );
}
