import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { 
  FileText, Image as ImageIcon, Video, Music, 
  Database, Code, Archive, Box, BookOpen, 
  Type, MessageSquare, Map, Scissors, Terminal, 
  Lock, Sparkles, FilePlus, FileMinus, FileUp, 
  RotateCw, Hash, Droplets, ImagePlus, Shield, 
  ShieldOff, Maximize, Replace, Settings2, 
  MonitorPlay, FastForward, Film, Wand2, Key,
  Braces, Link as LinkIcon, FileJson, 
  CaseSensitive, Type as TypeIcon, ShieldCheck,
  QrCode, Palette, AlignLeft, Unlock, FileCode,
  Regex, FileDiff
} from 'lucide-react';

const pdfTools = [
  { path: '/merge_pdf', title: 'Merge PDF', desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: FilePlus, color: '#e5322d' },
  { path: '/split_pdf', title: 'Split PDF', desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: Scissors, color: '#e5322d' },
  { path: '/remove_pages', title: 'Remove pages', desc: 'Remove pages from a PDF document in a flash.', icon: FileMinus, color: '#e5322d' },
  { path: '/extract_pages', title: 'Extract pages', desc: 'Get a new document containing only the desired pages.', icon: FileUp, color: '#e5322d' },
  { path: '/rotate_pdf', title: 'Rotate PDF', desc: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', icon: RotateCw, color: '#e5322d' },
  { path: '/add_page_numbers', title: 'Add page numbers', desc: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.', icon: Hash, color: '#e5322d' },
  { path: '/add_watermark', title: 'Add watermark', desc: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.', icon: Droplets, color: '#e5322d' },
  { path: '/image_to_pdf', title: 'Image to PDF', desc: 'Convert JPG, PNG, and more to PDF in seconds. Easily adjust orientation and margins.', icon: ImagePlus, color: '#f7c324' },
  { path: '/pdf_to_image', title: 'PDF to Image', desc: 'Convert every page of a PDF document into a high-quality JPG image instantly.', icon: ImageIcon, color: '#f7c324' },
  { path: '/unlock_pdf', title: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: ShieldOff, color: '#e5322d' },
  { path: '/protect_pdf', title: 'Protect PDF', desc: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', icon: Shield, color: '#e5322d' },
];

const imageTools = [
  { path: '/compress_image', title: 'Compress Image', desc: 'Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.', icon: Maximize, color: '#f7c324' },
  { path: '/gemini_watermark_remover', title: 'Gemini Watermark Remover', desc: 'Remove the visible Google Gemini watermark from images natively.', icon: Sparkles, color: '#f7c324' },
  { path: '/resize_image', title: 'Resize Image', desc: 'Define your dimensions, by percent or pixel, and resize your JPG, PNG, and GIF images.', icon: Maximize, color: '#f7c324' },
  { path: '/convert_image', title: 'Convert Image', desc: 'Convert PNG to JPG, JPG to PNG, or to WEBP for the web.', icon: Replace, color: '#f7c324' },
  { path: '/rotate_image', title: 'Rotate Image', desc: 'Rotate many images at once. Choose to rotate only landscape or portrait images.', icon: RotateCw, color: '#f7c324' },
  { path: '/grayscale_image', title: 'Grayscale Image', desc: 'Apply a black-and-white filter to your images instantly.', icon: ImageIcon, color: '#f7c324' },
  { path: '/image_blur', title: 'Image Blur', desc: 'Obscure private information or create a background blur effect.', icon: Droplets, color: '#f7c324' },
  { path: '/bmp_to_png', title: 'BMP to PNG', desc: 'Modernize old, uncompressed formats into optimized PNGs.', icon: Replace, color: '#f7c324' },
  { path: '/svg_to_png', title: 'SVG to PNG', desc: 'Convert vector SVG graphics into raster PNG images.', icon: Replace, color: '#f7c324' },
  { path: '/image_to_ico', title: 'Image to ICO', desc: 'Generate favicons for your websites instantly.', icon: ImageIcon, color: '#f7c324' },
];

const videoTools = [
  { path: '/video_to_gif', title: 'Video to GIF', desc: 'Convert MP4, MOV, or WEBM videos into animated GIFs.', icon: Film, color: '#315ea5' },
  { path: '/gif_to_mp4', title: 'GIF to MP4', desc: 'Convert animated GIFs into MP4 videos for better compression.', icon: Film, color: '#315ea5' },
  { path: '/webm_to_mp4', title: 'WEBM to MP4', desc: 'Make web videos compatible with all players by converting to MP4.', icon: Replace, color: '#315ea5' },
  { path: '/trim_video', title: 'Trim Video', desc: 'Cut out unwanted parts of a video locally in your browser.', icon: Scissors, color: '#315ea5' },
  { path: '/video_to_audio', title: 'Extract Audio', desc: 'Extract the MP3/WAV audio track from any video file.', icon: Music, color: '#315ea5' },
  { path: '/mute_video', title: 'Mute Video', desc: 'Strip audio tracks from any video natively.', icon: Music, color: '#315ea5' },
  { path: '/change_video_speed', title: 'Change Video Speed', desc: 'Speed up or slow down videos locally without losing quality.', icon: FastForward, color: '#315ea5' },
  { path: '/extract_video_frames', title: 'Extract Video Frames', desc: 'Turn video files into a sequence of JPG images.', icon: ImageIcon, color: '#315ea5' },
  { path: '/reverse_video', title: 'Reverse Video', desc: 'Play videos completely backwards!', icon: RotateCw, color: '#315ea5' },
];

const devTools = [
  { path: '/csv_to_json', title: 'CSV to JSON', desc: 'Parse and convert spreadsheet data into JSON arrays.', icon: FileJson, color: '#2a7433' },
  { path: '/json_to_csv', title: 'JSON to CSV', desc: 'Convert JSON arrays back into spreadsheet CSV format.', icon: Database, color: '#2a7433' },
  { path: '/xml_to_json', title: 'XML to JSON', desc: 'Convert XML data to formatted JSON instantly.', icon: FileCode, color: '#2a7433' },
  { path: '/json_formatter', title: 'JSON Formatter & Minifier', desc: 'Validate, format, and minify JSON strings securely.', icon: Braces, color: '#2a7433' },
  { path: '/markdown_to_html', title: 'Markdown to HTML', desc: 'Write Markdown and see the HTML output instantly.', icon: FileDiff, color: '#333333' },
  { path: '/html_to_markdown', title: 'HTML to Markdown', desc: 'Convert HTML documents into clean Markdown syntax.', icon: FileDiff, color: '#333333' },
  { path: '/regex_tester', title: 'Regex Tester', desc: 'Test and debug your Regular Expressions instantly.', icon: Regex, color: '#e5322d' },
  { path: '/base64_encode_decode', title: 'Base64 Encoder/Decoder', desc: 'Securely translate text into encoded bytes.', icon: Braces, color: '#333333' },
  { path: '/url_encode_decode', title: 'URL Encoder/Decoder', desc: 'Safely parse complicated or broken URLs.', icon: LinkIcon, color: '#333333' },
  { path: '/hash_generator', title: 'Hash Generator', desc: 'Calculate SHA-256, SHA-1, and MD5 hashes locally.', icon: Key, color: '#315ea5' },
  { path: '/bcrypt_generator', title: 'Bcrypt Generator', desc: 'Generate and verify Bcrypt hashes securely.', icon: Key, color: '#315ea5' },
  { path: '/jwt_decoder', title: 'JWT Decoder', desc: 'Decode JSON Web Tokens instantly to view their header and payload.', icon: Unlock, color: '#315ea5' },
  { path: '/qrcode_generator', title: 'QR Code Generator', desc: 'Instantly turn links or text into scannable QR codes.', icon: QrCode, color: '#333333' },
  { path: '/color_converter', title: 'Color Converter', desc: 'Pick a color to instantly convert it between HEX, RGB, and HSL.', icon: Palette, color: '#f7c324' },
  { path: '/lorem_ipsum', title: 'Lorem Ipsum Generator', desc: 'Generate placeholder text instantly for your designs.', icon: AlignLeft, color: '#333333' },
  { path: '/text_case_converter', title: 'Text Case Converter', desc: 'Instantly switch between camelCase, PascalCase, snake_case, UPPERCASE, and more.', icon: CaseSensitive, color: '#333333' },
  { path: '/word_character_counter', title: 'Word & Character Counter', desc: 'Count words, characters, sentences, paragraphs, and reading time.', icon: TypeIcon, color: '#333333' },
  { path: '/uuid_generator', title: 'UUID v4 Generator', desc: 'Quickly create cryptographically secure UUIDs.', icon: ShieldCheck, color: '#315ea5' },
  { path: '/html_formatter', title: 'HTML Formatter & Minifier', desc: 'Beautify messy HTML or compress it to save space.', icon: Code, color: '#333333' },
  { path: '/css_formatter', title: 'CSS Formatter & Minifier', desc: 'Organize CSS stylesheets or crunch them down for production.', icon: Code, color: '#333333' }
];

const allTools = [...pdfTools, ...imageTools, ...videoTools, ...devTools];

const SkeletonCard = () => (
  <div className="tool-card skeleton" style={{
    padding: '1.5rem', height: '140px', border: '1px solid #eaeaea', borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <div className="skeleton-icon" style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#e0e0e0', marginRight: '1rem' }}></div>
      <div className="skeleton-title" style={{ height: '20px', width: '60%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
    </div>
    <div className="skeleton-text" style={{ height: '14px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-text" style={{ height: '14px', width: '80%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
  </div>
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentTools, setRecentTools] = useState([]);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Check local storage for user history
    try {
      const history = JSON.parse(localStorage.getItem('recentTools') || '[]');
      if (history.length > 0) {
        setIsReturningUser(true);
        // Map paths back to full tool objects
        const resolvedTools = history.map(path => {
          return allTools.find(t => t.path === path);
        }).filter(Boolean).slice(0, 4); // Show top 4
        setRecentTools(resolvedTools);
      }
    } catch (e) {
      console.error('Failed to load recent tools', e);
    }

    // Simulate short network fetch for skeletal loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="hero dashboard-hero">
        <h1 className="hero-title">
          {isReturningUser ? 'Welcome back to fileverze' : 'Every tool you could need in one place'}
        </h1>
        <p className="hero-subtitle">
          {isReturningUser 
            ? 'Jump right back into your favorite tools or discover something new. All processing stays securely in your browser.'
            : 'fileverze is a powerhouse. All our tools are completely free and run natively in your browser. Select any tool below to begin.'}
        </p>
      </div>

      {/* RECENTLY USED SECTION */}
      {!isLoading && recentTools.length > 0 && (
        <>
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={24} className="section-icon" /> Recently Used
            </h2>
          </div>
          <div className="tools-grid">
            {recentTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link to={tool.path} key={`recent-${index}`} className="tool-card fade-in">
                  <div className="tool-card-header">
                    <div className="tool-icon-wrapper" style={{ color: tool.color }}>
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="tool-title">{tool.title}</h3>
                  </div>
                  <p className="tool-desc">{tool.desc}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* PDF TOOLS SECTION */}
      <div className="section-header">
        <h2 className="section-title">PDF Tools</h2>
      </div>
      <div className="tools-grid">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          pdfTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link to={tool.path} key={index} className="tool-card fade-in">
                <div className="tool-card-header">
                  <div className="tool-icon-wrapper" style={{ color: tool.color }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="tool-title">{tool.title}</h3>
                </div>
                <p className="tool-desc">{tool.desc}</p>
              </Link>
            );
          })
        )}
      </div>

      {/* IMAGE TOOLS SECTION */}
      <div className="section-header">
        <h2 className="section-title">Image Tools</h2>
      </div>
      <div className="tools-grid">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          imageTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link to={tool.path} key={index} className="tool-card fade-in">
                <div className="tool-card-header">
                  <div className="tool-icon-wrapper" style={{ color: tool.color }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="tool-title">{tool.title}</h3>
                </div>
                <p className="tool-desc">{tool.desc}</p>
              </Link>
            );
          })
        )}
      </div>

      {/* VIDEO TOOLS SECTION */}
      <div className="section-header">
        <h2 className="section-title">Video Tools</h2>
      </div>
      <div className="tools-grid">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          videoTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link to={tool.path} key={index} className="tool-card fade-in">
                <div className="tool-card-header">
                  <div className="tool-icon-wrapper" style={{ color: tool.color }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="tool-title">{tool.title}</h3>
                </div>
                <p className="tool-desc">{tool.desc}</p>
              </Link>
            );
          })
        )}
      </div>

      {/* DEV TOOLS SECTION */}
      <div className="section-header">
        <h2 className="section-title">Data & Dev Tools</h2>
      </div>
      <div className="tools-grid">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          devTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link to={tool.path} key={index} className="tool-card fade-in">
                <div className="tool-card-header">
                  <div className="tool-icon-wrapper" style={{ color: tool.color }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="tool-title">{tool.title}</h3>
                </div>
                <p className="tool-desc">{tool.desc}</p>
              </Link>
            );
          })
        )}
      </div>
      
      {/* Footer / Coming Soon Section */}
      <div className="coming-soon-section">
        <h2 className="coming-soon-title">Backend Desktop Tools (Coming Soon to Web)</h2>
        <p className="coming-soon-desc">
          The following heavy-duty AI and conversion tools are currently only available when running fileverze locally on your computer via Python, and will be ported to the web soon:
        </p>
        <div className="coming-soon-tags">
          <span className="coming-soon-tag">Word to PDF</span>
          <span className="coming-soon-tag">PDF to Word</span>
          <span className="coming-soon-tag">Excel to PDF</span>
          <span className="coming-soon-tag">PowerPoint to PDF</span>
          <span className="coming-soon-tag">Compress PDF</span>
          <span className="coming-soon-tag">AI Background Removal</span>
        </div>
      </div>
    </div>
  );
}
