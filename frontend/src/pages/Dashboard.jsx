import React from 'react';
import { Link } from 'react-router-dom';
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
  { path: '/word_to_pdf', title: 'Word to PDF', desc: 'Convert your DOC and DOCX files securely into PDF format.', icon: FileText, color: '#315ea5' },
  { path: '/pdf_to_word', title: 'PDF to Word', desc: 'Convert your PDF files to editable Word documents.', icon: FileText, color: '#315ea5' },
  { path: '/excel_to_pdf', title: 'Excel to PDF', desc: 'Convert your spreadsheets (.xls, .xlsx) securely into PDF format.', icon: FileText, color: '#2a7433' },
  { path: '/powerpoint_to_pdf', title: 'PowerPoint to PDF', desc: 'Convert your presentations (.ppt, .pptx) securely into PDF format.', icon: FileText, color: '#d32f2f' },
  { path: '/compress_pdf', title: 'Compress PDF', desc: 'Reduce the file size of your PDF document securely.', icon: Maximize, color: '#e5322d' },
  { path: '/unlock_pdf', title: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: ShieldOff, color: '#e5322d' },
  { path: '/protect_pdf', title: 'Protect PDF', desc: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', icon: Shield, color: '#e5322d' },
];

const imageTools = [
  { path: '/remove_background', title: 'Remove Background', desc: 'Use a local AI model to magically remove the background from images instantly.', icon: Wand2, color: '#9333ea' },
  { path: '/compress_image', title: 'Compress Image', desc: 'Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.', icon: Maximize, color: '#f7c324' },
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

export default function Dashboard() {
  return (
    <div>
      <div className="hero" style={{ padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Every tool you could need in one place</h1>
        <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem', color: '#555' }}>
          Fileverse is a powerhouse. All our tools are completely free and run natively in your browser.
          Select any tool below to begin.
        </p>
      </div>

      {/* PDF TOOLS SECTION */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>PDF Tools</h2>
      </div>
      <div className="tools-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        padding: '0 2rem 4rem 2rem', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {pdfTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.path} key={index} className="tool-card" style={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              padding: '1.5rem',
              height: '100%',
              display: 'flex',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                <div className="tool-icon" style={{ color: tool.color, marginRight: '1rem' }}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700', color: '#333' }}>{tool.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>{tool.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* IMAGE TOOLS SECTION */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Image Tools</h2>
      </div>
      <div className="tools-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        padding: '0 2rem 4rem 2rem', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {imageTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.path} key={index} className="tool-card" style={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              padding: '1.5rem',
              height: '100%',
              display: 'flex',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                <div className="tool-icon" style={{ color: tool.color, marginRight: '1rem' }}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700', color: '#333' }}>{tool.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>{tool.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* VIDEO TOOLS SECTION */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Video Tools</h2>
      </div>
      <div className="tools-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        padding: '0 2rem 4rem 2rem', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {videoTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.path} key={index} className="tool-card" style={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              padding: '1.5rem',
              height: '100%',
              display: 'flex',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                <div className="tool-icon" style={{ color: tool.color, marginRight: '1rem' }}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700', color: '#333' }}>{tool.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>{tool.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* DEV TOOLS SECTION */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Data & Dev Tools</h2>
      </div>
      <div className="tools-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        padding: '0 2rem 4rem 2rem', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {devTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.path} key={index} className="tool-card" style={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              padding: '1.5rem',
              height: '100%',
              display: 'flex',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                <div className="tool-icon" style={{ color: tool.color, marginRight: '1rem' }}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700', color: '#333' }}>{tool.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>{tool.desc}</p>
            </Link>
          );
        })}
      </div>
      
      {/* Footer / Coming Soon Section */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '4rem 2rem', marginTop: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>More tools coming soon!</h2>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          We're constantly adding new tools. Stay tuned for AI Generative Tools, 3D Object Conversion, Excel to PDF, and much more.
        </p>
      </div>
    </div>
  );
}
