import React, { useState, useRef, useEffect } from 'react';
import { removeWatermarkFromImage } from '@pilio/gemini-watermark-remover';
import { Link } from 'react-router-dom';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function GeminiWatermarkRemover() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultDataUrl, setResultDataUrl] = useState(null);
  const [metaInfo, setMetaInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [engineDownloadProgress, setEngineDownloadProgress] = useState(0);
  const [loadError, setLoadError] = useState(null);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const ffmpegRef = useRef(new FFmpeg());
  const fpsRef = useRef(30); // Default to 30fps

  // Load FFmpeg for video processing
  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    // Capture FFmpeg logs to find framerate
    ffmpeg.on('log', ({ message }) => {
      // Look for e.g. "30 fps" or "29.97 fps"
      const fpsMatch = message.match(/([\d.]+) fps/);
      if (fpsMatch && fpsMatch[1]) {
        fpsRef.current = parseFloat(fpsMatch[1]);
      }
    });

    const downloadWithProgress = async (url, setProgressCallback) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      
      const contentLength = response.headers.get('content-length');
      if (!contentLength) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      
      const reader = response.body.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.byteLength;
        setProgressCallback(Math.round((loaded / total) * 100));
      }
      
      const blob = new Blob(chunks, { type: response.headers.get('content-type') });
      return URL.createObjectURL(blob);
    };

    try {
      const coreURL = await downloadWithProgress(`${baseURL}/ffmpeg-core.js`, () => {});
      const wasmURL = await downloadWithProgress(`${baseURL}/ffmpeg-core.wasm`, (p) => setEngineDownloadProgress(p));
      
      await ffmpeg.load({
        coreURL,
        wasmURL,
      });
      setIsLoaded(true);
    } catch (e) {
      console.error("Error loading FFmpeg:", e);
      setLoadError("Failed to load the video processing engine.");
    }
  };

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

  // Convert a Uint8Array (PNG file from FFmpeg) to an HTMLImageElement
  const bufferToImage = async (buffer) => {
    const blob = new Blob([buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Convert a Canvas to a Uint8Array (PNG format)
  const canvasToBuffer = async (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        resolve(new Uint8Array(arrayBuffer));
      }, 'image/png');
    });
  };

  const pad = (num) => num.toString().padStart(4, '0');

  const processVideo = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!isLoaded || !ffmpeg) {
      alert("Video engine not loaded yet.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    fpsRef.current = 30; // Reset
    
    try {
      setStatusMessage('Extracting frames from video...');
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // Extract frames
      await ffmpeg.exec(['-i', 'input.mp4', 'frame_%04d.png']);

      // Count frames by reading until failure
      let totalFrames = 0;
      while (true) {
        try {
          await ffmpeg.readFile(`frame_${pad(totalFrames + 1)}.png`);
          totalFrames++;
        } catch {
          break;
        }
      }

      if (totalFrames === 0) throw new Error("No frames extracted.");

      setStatusMessage('Removing watermark...');
      let foundWatermark = false;

      // Process each frame
      for (let i = 1; i <= totalFrames; i++) {
        const frameName = `frame_${pad(i)}.png`;
        const frameData = await ffmpeg.readFile(frameName);
        
        // Draw to image
        const img = await bufferToImage(frameData);
        
        // Use gemini watermark remover logic
        const { canvas, meta } = await removeWatermarkFromImage(img);
        if (meta && meta.applied) {
          foundWatermark = true;
          if (!metaInfo) setMetaInfo(meta); // Save the first meta info we get
        }

        // Save back to FFmpeg file system
        const newFrameData = await canvasToBuffer(canvas);
        await ffmpeg.writeFile(frameName, newFrameData);

        setProgress(Math.round((i / totalFrames) * 100));
      }

      if (!metaInfo && !foundWatermark) {
        setMetaInfo({ applied: false }); // Fake meta to show it wasn't applied
      }

      setStatusMessage('Re-encoding video with audio...');
      setProgress(0);
      
      // Listen to encode progress
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      // Re-encode
      await ffmpeg.exec([
        '-framerate', `${fpsRef.current}`, 
        '-i', 'frame_%04d.png', 
        '-i', 'input.mp4', 
        '-map', '0:v:0', 
        '-map', '1:a?', 
        '-c:v', 'libx264', 
        '-pix_fmt', 'yuv420p', 
        '-c:a', 'copy', 
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      setResultDataUrl(URL.createObjectURL(blob));

      // Cleanup frames to free memory
      for (let i = 1; i <= totalFrames; i++) {
        await ffmpeg.deleteFile(`frame_${pad(i)}.png`);
      }
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.mp4');

    } catch (error) {
      console.error('Error processing video:', error);
      alert('Failed to process video. It might be too large or not supported.');
    } finally {
      setIsProcessing(false);
      ffmpeg.off('progress'); // Remove listener
    }
  };

  const processImage = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);
    setStatusMessage('Removing watermark...');

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

  const handleProcess = () => {
    if (!file) return;
    if (file.type.startsWith('video/')) {
      processVideo();
    } else {
      processImage();
    }
  };

  return (
    <div className="tool-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>Gemini Watermark Remover</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Remove the visible Google Gemini watermark from generated images and videos natively in your browser.
      </p>

      {!isLoaded && !loadError && (
        <div style={{ padding: '2rem', background: '#e2f0fb', color: '#0056b3', borderRadius: '8px', marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            Loading Video Processing Engine ({engineDownloadProgress}%)... Please wait, this is a one-time 30MB download.
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 86, 179, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${engineDownloadProgress}%`, height: '100%', backgroundColor: '#0056b3', transition: 'width 0.2s ease-out' }}></div>
          </div>
        </div>
      )}

      {loadError && (
        <div style={{ padding: '2rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginTop: '2rem' }}>
          <strong>Error:</strong> {loadError}
        </div>
      )}

      <div style={{ padding: '1rem', background: '#fff3cd', color: '#856404', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' }}>
        <strong>Note on Videos:</strong> Video processing requires extracting and analyzing every single frame. This is extremely memory-intensive. Videos longer than 15-20 seconds may cause your browser tab to crash.
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

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
            <p style={{ fontSize: '1.5rem' }}>{file ? file.name : 'Select Gemini Image or Video'}</p>
            <span style={{ fontSize: '1rem', color: '#888', display: 'block', marginTop: '1rem' }}>
              {file ? 'Click to change file' : 'or drop file here'}
            </span>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*,video/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
              <div style={{ marginBottom: '2rem' }}>
                {file.type.startsWith('video/') ? (
                  <video 
                    src={URL.createObjectURL(file)} 
                    controls 
                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} 
                  />
                ) : (
                  <img 
                    ref={imageRef}
                    src={URL.createObjectURL(file)} 
                    alt="Original" 
                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} 
                  />
                )}
              </div>
              <button 
                className="btn" 
                onClick={handleProcess}
                disabled={isProcessing || (file.type.startsWith('video/') && !isLoaded)}
                style={{ width: '100%', maxWidth: '300px', position: 'relative', overflow: 'hidden' }}
              >
                {isProcessing && file.type.startsWith('video/') && (
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
                  {isProcessing ? (file.type.startsWith('video/') ? `${statusMessage} (${progress}%)` : 'Removing Watermark...') : 'Remove Watermark'}
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '3rem', border: '1px solid #e0e0e0', borderRadius: '12px', marginTop: '2rem', textAlign: 'center' }}>
          <h2>Watermark Removed!</h2>
          
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            {file.type.startsWith('video/') ? (
              <video src={resultDataUrl} controls style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}></video>
            ) : (
              <img src={resultDataUrl} alt="Restored" style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            )}
          </div>

          {metaInfo && (
            <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
              {metaInfo.applied ? (
                <span style={{ color: 'green' }}>✓ Watermark detected and removed ({metaInfo.decisionTier})</span>
              ) : (
                <span style={{ color: 'orange' }}>⚠ No watermark was found in this media.</span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={resultDataUrl} 
              download={`restored_${file.name}`} 
              className="btn"
            >
              Download Restored File
            </a>
            <button 
              className="btn" 
              style={{ backgroundColor: '#666' }}
              onClick={() => {
                setResultDataUrl(null);
                setFile(null);
                setMetaInfo(null);
                setProgress(0);
              }}
            >
              Process Another File
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
