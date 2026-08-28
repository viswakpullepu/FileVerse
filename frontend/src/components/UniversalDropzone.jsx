import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, FileText, Image as ImageIcon, Video, Music,
  Database, Code, Box, BookOpen, Type, MessageSquare, Map,
  Sparkles, ArrowRight, CheckCircle, RefreshCw, Layers, Shield
} from 'lucide-react';

// Format bytes into readable format
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Map file types to category, icon, and all possible conversion actions
function getFileIntelligence(file) {
  if (!file) return null;

  const fileName = file.name;
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const sizeStr = formatBytes(file.size);
  const mime = file.type || 'application/octet-stream';

  // 1. PDF
  if (ext === 'pdf' || mime.includes('pdf')) {
    return {
      category: 'PDF Document',
      ext: 'PDF',
      color: '#e5322d',
      icon: FileText,
      size: sizeStr,
      actions: [
        { title: 'PDF to Image (JPG)', desc: 'Convert all pages to high-res JPGs', path: '/pdf_to_image', badge: 'Convert' },
        { title: 'PDF to Word (.docx)', desc: 'Convert to editable Word document', path: '/pdf_to_word', badge: 'Convert' },
        { title: 'Compress PDF', desc: 'Reduce PDF file size', path: '/compress_pdf', badge: 'Optimize' },
        { title: 'Merge with other PDFs', desc: 'Combine multiple documents into one', path: '/merge_pdf', badge: 'Edit' },
        { title: 'Split PDF', desc: 'Separate pages or extract page ranges', path: '/split_pdf', badge: 'Edit' },
        { title: 'Extract Pages', desc: 'Extract specific pages into a new PDF', path: '/extract_pages', badge: 'Edit' },
        { title: 'Remove Pages', desc: 'Delete unwanted pages from PDF', path: '/remove_pages', badge: 'Edit' },
        { title: 'Rotate PDF', desc: 'Rotate portrait / landscape pages', path: '/rotate_pdf', badge: 'Edit' },
        { title: 'Add Watermark', desc: 'Stamp image or text watermark', path: '/add_watermark', badge: 'Security' },
        { title: 'Add Page Numbers', desc: 'Insert custom numbered headers/footers', path: '/add_page_numbers', badge: 'Edit' },
        { title: 'Protect PDF (Password)', desc: 'Encrypt document with password', path: '/protect_pdf', badge: 'Security' },
        { title: 'Unlock PDF', desc: 'Remove password restriction', path: '/unlock_pdf', badge: 'Security' },
      ]
    };
  }

  // 2. Images
  if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'bmp', 'ico', 'gif', 'avif'].includes(ext) || mime.startsWith('image/')) {
    const isSvg = ext === 'svg';
    const isBmp = ext === 'bmp';
    const isIco = ext === 'ico';

    return {
      category: 'Image File',
      ext: ext.toUpperCase(),
      color: '#f59e0b',
      icon: ImageIcon,
      size: sizeStr,
      actions: [
        { title: 'Convert Image Format', desc: 'Convert to PNG, JPG, or WEBP', path: '/convert_image', badge: 'Convert' },
        { title: 'Compress Image', desc: 'Reduce file size while keeping visual quality', path: '/compress_image', badge: 'Optimize' },
        { title: 'OCR Text Extractor', desc: 'Extract editable text using Neural AI', path: '/ocr_extractor', badge: 'AI Tool' },
        { title: 'Gemini Watermark Remover', desc: 'Cleanly remove AI watermarks', path: '/gemini_watermark_remover', badge: 'AI Tool' },
        { title: 'Resize Image', desc: 'Scale dimensions by pixels or percentage', path: '/resize_image', badge: 'Edit' },
        { title: 'Image to PDF', desc: 'Embed image into a clean PDF document', path: '/image_to_pdf', badge: 'Convert' },
        { title: 'Convert to Favicon (.ico)', desc: 'Generate web favicons', path: '/image_to_ico', badge: 'Convert' },
        { title: 'Apply Grayscale', desc: 'Convert image to black & white', path: '/grayscale_image', badge: 'Filter' },
        { title: 'Blur Image', desc: 'Obscure private areas or add blur', path: '/image_blur', badge: 'Filter' },
        { title: 'Rotate Image', desc: 'Rotate 90°, 180°, or custom angle', path: '/rotate_image', badge: 'Edit' },
        { title: 'Remove Background', desc: 'Cut out subject with transparent background', path: '/remove_background', badge: 'AI Tool' },
        ...(isSvg ? [{ title: 'SVG to Raster PNG', desc: 'Rasterize vector SVG to crisp PNG', path: '/svg_to_png', badge: 'Convert' }] : []),
        ...(isBmp ? [{ title: 'BMP to Optimized PNG', desc: 'Convert uncompressed BMP to PNG', path: '/bmp_to_png', badge: 'Convert' }] : []),
      ]
    };
  }

  // 3. Videos
  if (['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'hevc', 'flv'].includes(ext) || mime.startsWith('video/')) {
    return {
      category: 'Video File',
      ext: ext.toUpperCase(),
      color: '#3b82f6',
      icon: Video,
      size: sizeStr,
      actions: [
        { title: 'Video to Animated GIF', desc: 'Convert video clips into high-quality GIFs', path: '/video_to_gif', badge: 'Convert' },
        { title: 'Extract Audio Track', desc: 'Extract MP3 or WAV audio track', path: '/video_to_audio', badge: 'Convert' },
        { title: 'Trim & Cut Video', desc: 'Cut out unwanted video segments locally', path: '/trim_video', badge: 'Edit' },
        { title: 'Mute Audio Track', desc: 'Strip sound track from video', path: '/mute_video', badge: 'Edit' },
        { title: 'Change Video Speed', desc: 'Speed up or slow down video playback', path: '/change_video_speed', badge: 'Edit' },
        { title: 'Extract Video Frames', desc: 'Export full sequence of frames as JPGs', path: '/extract_video_frames', badge: 'Extract' },
        { title: 'Reverse Video', desc: 'Play video completely backwards', path: '/reverse_video', badge: 'Effect' },
        { title: 'Convert to MP4', desc: 'Standardize WEBM/HEVC/MOV to MP4', path: ext === 'webm' ? '/webm_to_mp4' : (ext === 'hevc' ? '/hevc_to_mp4' : '/video_to_gif'), badge: 'Convert' },
      ]
    };
  }

  // 4. Subtitles
  if (['srt', 'vtt', 'ass', 'sub', 'sbv'].includes(ext)) {
    return {
      category: 'Subtitle File',
      ext: ext.toUpperCase(),
      color: '#0ea5e9',
      icon: MessageSquare,
      size: sizeStr,
      actions: [
        { title: 'Convert to WebVTT (.vtt)', desc: 'Standard format for HTML5 and web video', path: '/subtitle_converter', badge: 'Convert' },
        { title: 'Convert to SubRip (.srt)', desc: 'Universal media player subtitle format', path: '/subtitle_converter', badge: 'Convert' },
        { title: 'Convert to Advanced SSA (.ass)', desc: 'Styled subtitle format', path: '/subtitle_converter', badge: 'Convert' },
        { title: 'Shift Timestamps (Sync Offset)', desc: 'Adjust audio/video timing sync in ms', path: '/subtitle_converter', badge: 'Edit' },
        { title: 'Extract Plain Text (.txt)', desc: 'Strip all cue timestamps into clean script', path: '/subtitle_converter', badge: 'Extract' },
      ]
    };
  }

  // 5. Data & Spreadsheets
  if (['csv', 'tsv', 'json', 'xml', 'yaml', 'yml'].includes(ext)) {
    const isCsv = ext === 'csv' || ext === 'tsv';
    const isJson = ext === 'json';
    const isXml = ext === 'xml';

    return {
      category: 'Data & Structured File',
      ext: ext.toUpperCase(),
      color: '#10b981',
      icon: Database,
      size: sizeStr,
      actions: [
        ...(isCsv ? [
          { title: 'CSV to JSON Array', desc: 'Parse tabular rows into JSON structure', path: '/csv_to_json', badge: 'Convert' },
          { title: 'CSV Coordinates to GeoJSON', desc: 'Convert Lat/Lon rows to spatial map data', path: '/gis_converter', badge: 'GIS' },
        ] : []),
        ...(isJson ? [
          { title: 'JSON to Spreadsheet CSV', desc: 'Convert JSON arrays into downloadable CSV', path: '/json_to_csv', badge: 'Convert' },
          { title: 'JSON Formatter & Minifier', desc: 'Beautify or minify JSON string', path: '/json_formatter', badge: 'Format' },
          { title: 'JSON to XML', desc: 'Convert JSON trees into XML tags', path: '/xml_to_json', badge: 'Convert' },
        ] : []),
        ...(isXml ? [
          { title: 'XML to JSON', desc: 'Parse XML tags into formatted JSON objects', path: '/xml_to_json', badge: 'Convert' },
        ] : []),
        { title: 'Base64 Encode/Decode', desc: 'Translate raw payload to/from base64', path: '/base64_encode_decode', badge: 'Dev Tool' },
        { title: 'Word & Character Metrics', desc: 'Analyze length, character count, and size', path: '/word_character_counter', badge: 'Analytics' },
      ]
    };
  }

  // 6. GIS / Spatial
  if (['geojson', 'kml', 'gpx'].includes(ext)) {
    return {
      category: 'Geospatial & Map Data',
      ext: ext.toUpperCase(),
      color: '#059669',
      icon: Map,
      size: sizeStr,
      actions: [
        { title: 'GeoJSON to Google Earth KML', desc: 'Convert GeoJSON features to .kml placemarks', path: '/gis_converter', badge: 'GIS' },
        { title: 'KML to GeoJSON', desc: 'Convert Placemarks and LinearRings to GeoJSON', path: '/gis_converter', badge: 'GIS' },
        { title: 'Validate Spatial Coordinates', desc: 'Inspect point/line/polygon geometries', path: '/gis_converter', badge: 'Inspect' },
      ]
    };
  }

  // 7. 3D & CAD
  if (['stl', 'obj', 'gltf', 'glb', '3ds', 'dae'].includes(ext)) {
    return {
      category: '3D Mesh & CAD',
      ext: ext.toUpperCase(),
      color: '#d97706',
      icon: Box,
      size: sizeStr,
      actions: [
        { title: 'Interactive 3D Viewport', desc: 'Inspect model in WebGL with wireframe & rotate', path: '/threed_converter', badge: 'Viewer' },
        { title: 'Polycount & Vertex Inspector', desc: 'Calculate triangles, face normals, and bounds', path: '/threed_converter', badge: 'Inspect' },
        { title: 'Export Clean STL Mesh', desc: 'Download standardized binary STL geometry', path: '/threed_converter', badge: 'Export' },
      ]
    };
  }

  // 8. Fonts
  if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
    return {
      category: 'Typography & Font',
      ext: ext.toUpperCase(),
      color: '#6366f1',
      icon: Type,
      size: sizeStr,
      actions: [
        { title: 'Inspect Glyph Vectors', desc: 'Inspect glyph count, units per EM, and tables', path: '/font_converter', badge: 'Inspect' },
        { title: 'Interactive Typography Tester', desc: 'Type custom strings in your font with size slider', path: '/font_converter', badge: 'Test' },
        { title: 'Generate @font-face CSS', desc: 'Get copy-ready web font CSS snippets', path: '/font_converter', badge: 'Dev Tool' },
        { title: 'Export TTF Font', desc: 'Export standardized TrueType font binary', path: '/font_converter', badge: 'Export' },
      ]
    };
  }

  // 9. E-Books
  if (['epub', 'mobi', 'azw3'].includes(ext)) {
    return {
      category: 'Digital E-Book',
      ext: ext.toUpperCase(),
      color: '#ec4899',
      icon: BookOpen,
      size: sizeStr,
      actions: [
        { title: 'Extract Chapters & Full Text', desc: 'Unpack EPUB chapters into readable text', path: '/ebook_converter', badge: 'Extract' },
        { title: 'EPUB Reader & Inspector', desc: 'View book metadata, table of contents, and OPF', path: '/ebook_converter', badge: 'Reader' },
        { title: 'Create / Rebuild EPUB', desc: 'Build new EPUB 3 digital books', path: '/ebook_converter', badge: 'Build' },
      ]
    };
  }

  // 10. Documents & Office
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'html', 'htm', 'css', 'js'].includes(ext)) {
    const isWord = ['doc', 'docx'].includes(ext);
    const isExcel = ['xls', 'xlsx'].includes(ext);
    const isPpt = ['ppt', 'pptx'].includes(ext);
    const isMd = ext === 'md';
    const isHtml = ['html', 'htm'].includes(ext);
    const isCss = ext === 'css';

    return {
      category: 'Document & Code File',
      ext: ext.toUpperCase(),
      color: '#475569',
      icon: Code,
      size: sizeStr,
      actions: [
        ...(isWord ? [{ title: 'Word to PDF', desc: 'Convert Word document to PDF', path: '/word_to_pdf', badge: 'Convert' }] : []),
        ...(isExcel ? [{ title: 'Excel to PDF', desc: 'Convert spreadsheets to PDF tables', path: '/excel_to_pdf', badge: 'Convert' }] : []),
        ...(isPpt ? [{ title: 'PowerPoint to PDF', desc: 'Convert slide presentations to PDF', path: '/powerpoint_to_pdf', badge: 'Convert' }] : []),
        ...(isMd ? [
          { title: 'Markdown to Clean HTML', desc: 'Compile markdown to formatted HTML', path: '/markdown_to_html', badge: 'Convert' },
          { title: 'Build EPUB from Markdown', desc: 'Compile chapters into digital book', path: '/ebook_converter', badge: 'E-Book' }
        ] : []),
        ...(isHtml ? [
          { title: 'HTML to Markdown', desc: 'Convert HTML webpage elements to clean Markdown', path: '/html_to_markdown', badge: 'Convert' },
          { title: 'HTML Formatter & Minifier', desc: 'Beautify or minify HTML markup', path: '/html_formatter', badge: 'Format' }
        ] : []),
        ...(isCss ? [{ title: 'CSS Formatter & Minifier', desc: 'Organize stylesheets or compress for prod', path: '/css_formatter', badge: 'Format' }] : []),
        { title: 'Word & Character Counter', desc: 'Calculate sentences, paragraphs, and reading duration', path: '/word_character_counter', badge: 'Analyze' },
        { title: 'Hash Generator (SHA-256)', desc: 'Calculate cryptographic integrity checksum', path: '/hash_generator', badge: 'Security' },
      ]
    };
  }

  // 11. Generic / Fallback
  return {
    category: 'Universal File',
    ext: ext ? ext.toUpperCase() : 'UNKNOWN',
    color: '#64748b',
    icon: FileText,
    size: sizeStr,
    actions: [
      { title: 'Cryptographic Hash (SHA-256/MD5)', desc: 'Generate file integrity checksum hashes', path: '/hash_generator', badge: 'Security' },
      { title: 'Base64 Encoder/Decoder', desc: 'Translate raw bytes into safe base64 strings', path: '/base64_encode_decode', badge: 'Dev Tool' },
      { title: 'Bcrypt Hash Generator', desc: 'Generate secure salted password hashes', path: '/bcrypt_generator', badge: 'Security' },
      { title: 'Word & Character Counter', desc: 'Count words and string metrics', path: '/word_character_counter', badge: 'Analyze' },
    ]
  };
}

export default function UniversalDropzone() {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const intelligence = getFileIntelligence(file);

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto 2.5rem auto' }}>
      {/* Drop Zone Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && fileInputRef.current?.click()}
        style={{
          border: isDragOver ? '2px dashed #0284c7' : '2px dashed #cbd5e1',
          background: isDragOver ? '#f0f9ff' : (file ? '#ffffff' : '#f8fafc'),
          borderRadius: '16px',
          padding: file ? '1.5rem' : '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: file ? 'default' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: file ? '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)' : 'none',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!file ? (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <UploadCloud size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
              Drop any file here to detect & convert
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.25rem auto' }}>
              Drop PDF, Image, Video, Audio, Data, Subtitle, 3D, Font, or Document files. The local engine will instantly detect supported actions.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              Choose Any File from Computer
            </button>
          </div>
        ) : (
          /* File Detected State */
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: `${intelligence?.color}15`,
                  color: intelligence?.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  {React.createElement(intelligence?.icon || FileText, { size: 28 })}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                      {file.name}
                    </span>
                    <span style={{
                      background: `${intelligence?.color}20`,
                      color: intelligence?.color,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {intelligence?.category} ({intelligence?.ext})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    File Size: <strong>{intelligence?.size}</strong> • <strong>{intelligence?.actions.length} Available Conversion & Tool Actions</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setFile(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} /> Drop Another File
              </button>
            </div>

            {/* Supported Conversion Options Grid */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ How would you like to convert or process this {intelligence?.ext} file?
                </h4>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '0.85rem'
              }}>
                {intelligence?.actions.map((act, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(act.path)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0284c7';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(2, 132, 199, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        {act.title}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}>
                        {act.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                      {act.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, marginTop: '0.6rem' }}>
                      <span>Open Tool</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
