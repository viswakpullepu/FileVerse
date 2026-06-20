import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Grid, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import UniversalConverter from './pages/UniversalConverter';
import MergePDF from './pages/tools/MergePDF';
import SplitPDF from './pages/tools/SplitPDF';
import ExtractPages from './pages/tools/ExtractPages';
import RemovePages from './pages/tools/RemovePages';
import RotatePDF from './pages/tools/RotatePDF';
import AddPageNumbers from './pages/tools/AddPageNumbers';
import ConvertImage from './pages/tools/ConvertImage';
import CompressImage from './pages/tools/CompressImage';
import VideoToGif from './pages/tools/VideoToGif';
import VideoToAudio from './pages/tools/VideoToAudio';
import ImageToPDF from './pages/tools/ImageToPDF';
import PdfToImage from './pages/tools/PdfToImage';
import PdfToWord from './pages/tools/PdfToWord';
import WordToPdf from './pages/tools/WordToPdf';
import ExcelToPdf from './pages/tools/ExcelToPdf';
import PowerpointToPdf from './pages/tools/PowerpointToPdf';
import CompressPdfBackend from './pages/tools/CompressPdfBackend';
import ProtectPDF from './pages/tools/ProtectPDF';
import UnlockPDF from './pages/tools/UnlockPDF';
import TrimVideo from './pages/tools/TrimVideo';
import AddWatermark from './pages/tools/AddWatermark';
import HashGenerator from './pages/tools/HashGenerator';
import JsonToCsv from './pages/tools/JsonToCsv';
import GifToMp4 from './pages/tools/GifToMp4';
import SvgToPng from './pages/tools/SvgToPng';
import ImageToIco from './pages/tools/ImageToIco';
import ResizeImage from './pages/tools/ResizeImage';
import RotateImage from './pages/tools/RotateImage';
import GrayscaleImage from './pages/tools/GrayscaleImage';
import ImageBlur from './pages/tools/ImageBlur';
import BmpToPng from './pages/tools/BmpToPng';
import WebmToMp4 from './pages/tools/WebmToMp4';
import MuteVideo from './pages/tools/MuteVideo';
import ChangeVideoSpeed from './pages/tools/ChangeVideoSpeed';
import ExtractVideoFrames from './pages/tools/ExtractVideoFrames';
import ReverseVideo from './pages/tools/ReverseVideo';
import RemoveBackground from './pages/tools/RemoveBackground';
import CsvToJson from './pages/tools/CsvToJson';
import Base64EncodeDecode from './pages/tools/Base64EncodeDecode';
import UrlEncodeDecode from './pages/tools/UrlEncodeDecode';
import TextCaseConverter from './pages/tools/TextCaseConverter';
import WordCharacterCounter from './pages/tools/WordCharacterCounter';
import UuidGenerator from './pages/tools/UuidGenerator';
import HtmlFormatter from './pages/tools/HtmlFormatter';
import CssFormatter from './pages/tools/CssFormatter';
import JsonFormatter from './pages/tools/JsonFormatter';
import QrCodeGenerator from './pages/tools/QrCodeGenerator';
import ColorConverter from './pages/tools/ColorConverter';
import LoremIpsumGenerator from './pages/tools/LoremIpsumGenerator';
import JwtDecoder from './pages/tools/JwtDecoder';
import MarkdownToHtml from './pages/tools/MarkdownToHtml';
import HtmlToMarkdown from './pages/tools/HtmlToMarkdown';
import RegexTester from './pages/tools/RegexTester';
import BcryptGenerator from './pages/tools/BcryptGenerator';
import XmlToJson from './pages/tools/XmlToJson';

function App() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    
    // Track recently visited tools
    if (location.pathname !== '/' && !location.pathname.startsWith('/convert/')) {
      try {
        const recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
        // Add new path, remove duplicates, keep top 4
        const updated = [location.pathname, ...recent.filter(p => p !== location.pathname)].slice(0, 4);
        localStorage.setItem('recentTools', JSON.stringify(updated));
        localStorage.setItem('hasVisited', 'true');
      } catch (e) {
        console.error('Local storage error:', e);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeDropdown = () => setActiveDropdown(null);

  return (
    <div className="app-container">
      <header className="header" ref={headerRef}>
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} color="#111" /> : <Menu size={24} color="#111" />}
          </button>
          
          <Link to="/" className="logo" onClick={closeDropdown} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#f8fafc" />
                  <stop offset="75%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="glass" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Back folder tab */}
              <path d="M4 12 C 4 6, 8 6, 10 8 L 13 11 L 26 11 C 28 11, 28 13, 28 15" 
                    stroke="url(#chrome)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              {/* Infinity loop front */}
              <path d="M 4 20 C 4 12, 14 12, 16 20 C 18 28, 28 28, 28 20 C 28 12, 18 12, 16 20 C 14 28, 4 28, 4 20 Z" 
                    fill="url(#glass)" stroke="url(#chrome)" strokeWidth="2" filter="url(#glow)"/>
            </svg>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.4rem',
              letterSpacing: '-0.5px', 
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Inter', sans-serif"
            }}>
              FileVerze
            </span>
          </Link>
          
          <nav className={`nav-main ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* DOCUMENT TOOLS */}
            <div className="nav-item dropdown" onClick={() => toggleDropdown('docs')}>
              DOCUMENT TOOLS <ChevronDown size={14} />
              {activeDropdown === 'docs' && (
                <div className="dropdown-menu">
                  <Link to="/merge_pdf" className="dropdown-item" onClick={closeDropdown}>Merge PDF</Link>
                  <Link to="/split_pdf" className="dropdown-item" onClick={closeDropdown}>Split PDF</Link>
                  <Link to="/image_to_pdf" className="dropdown-item" onClick={closeDropdown}>Image to PDF</Link>
                </div>
              )}
            </div>

            {/* IMAGE TOOLS MEGA MENU */}
            <div className="nav-item dropdown mega" onClick={() => toggleDropdown('images')}>
              IMAGE TOOLS <ChevronDown size={14} />
              {activeDropdown === 'images' && (
                <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="mega-column">
                    <div className="mega-column-title">WEB & OPTIMIZATION</div>
                    <Link to="/compress_image" className="mega-item" onClick={closeDropdown}>Compress Image</Link>
                    <Link to="/resize_image" className="mega-item" onClick={closeDropdown}>Resize Image</Link>
                    <Link to="/convert_image" className="mega-item" onClick={closeDropdown}>PNG to JPG</Link>
                    <Link to="/convert_image" className="mega-item" onClick={closeDropdown}>JPG to PNG</Link>
                    <Link to="/convert_image" className="mega-item" onClick={closeDropdown}>Image to WebP</Link>
                    <Link to="/rotate_image" className="mega-item" onClick={closeDropdown}>Rotate Image</Link>
                    <Link to="/grayscale_image" className="mega-item" onClick={closeDropdown}>Grayscale Image</Link>
                    <Link to="/image_blur" className="mega-item" onClick={closeDropdown}>Blur Image</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">MOBILE & CAMERA</div>
                    <Link to="/convert/images" className="mega-item" onClick={closeDropdown}>HEIC to JPG</Link>
                    <Link to="/convert/images" className="mega-item" onClick={closeDropdown}>RAW to JPG</Link>
                    <Link to="/convert/images" className="mega-item" onClick={closeDropdown}>TIFF to JPG</Link>
                    <Link to="/bmp_to_png" className="mega-item" onClick={closeDropdown}>BMP/TGA to PNG</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">UI & ICON DESIGN</div>
                    <Link to="/svg_to_png" className="mega-item" onClick={closeDropdown}>SVG to PNG</Link>
                    <Link to="/convert/images" className="mega-item" onClick={closeDropdown}>PNG to SVG</Link>
                    <Link to="/image_to_ico" className="mega-item" onClick={closeDropdown}>Image to ICO</Link>
                    <Link to="/convert/images" className="mega-item" onClick={closeDropdown}>Image to ICNS</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">ANIMATION</div>
                    <Link to="/gif_to_mp4" className="mega-item" onClick={closeDropdown}>GIF to MP4</Link>
                    <Link to="/video_to_gif" className="mega-item" onClick={closeDropdown}>MP4 to GIF</Link>
                    <Link to="/convert/images" className="mega-item" onClick={closeDropdown}>GIF to APNG</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">DOCUMENT BRIDGING</div>
                    <Link to="/image_to_pdf" className="mega-item" onClick={closeDropdown}>Image to PDF</Link>
                    <Link to="/pdf_to_image" className="mega-item" onClick={closeDropdown}>PDF to Image</Link>
                  </div>
                </div>
              )}
            </div>

            {/* PDF TOOLS MEGA MENU */}
            <div className="nav-item dropdown mega" onClick={() => toggleDropdown('pdf')}>
              PDF TOOLS <ChevronDown size={14} />
              {activeDropdown === 'pdf' && (
                <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="mega-column">
                    <div className="mega-column-title">ORGANIZE PDF</div>
                    <Link to="/merge_pdf" className="mega-item" onClick={closeDropdown}>Merge PDF</Link>
                    <Link to="/split_pdf" className="mega-item" onClick={closeDropdown}>Split PDF</Link>
                    <Link to="/remove_pages" className="mega-item" onClick={closeDropdown}>Remove pages</Link>
                    <Link to="/extract_pages" className="mega-item" onClick={closeDropdown}>Extract pages</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Organize PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Scan to PDF</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">OPTIMIZE PDF</div>
                    <Link to="/compress_pdf" className="mega-item" onClick={closeDropdown}>Compress PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Repair PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>OCR PDF</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">CONVERT TO PDF</div>
                    <Link to="/image_to_pdf" className="mega-item" onClick={closeDropdown}>JPG to PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>HTML to PDF</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">CONVERT FROM PDF</div>
                    <Link to="/pdf_to_image" className="mega-item" onClick={closeDropdown}>PDF to JPG</Link>
                    <Link to="/pdf_to_word" className="mega-item" onClick={closeDropdown}>PDF to WORD</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>PDF to POWERPOINT</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>PDF to EXCEL</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>PDF to PDF/A</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">EDIT IMAGE</div>
                    <Link to="/rotate_image" className="mega-item" onClick={closeDropdown}>Rotate Image</Link>
                    <Link to="/image_blur" className="mega-item" onClick={closeDropdown}>Image Blur</Link>
                    <Link to="/grayscale_image" className="mega-item" onClick={closeDropdown}>Grayscale Image</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">EDIT PDF</div>
                    <Link to="/rotate_pdf" className="mega-item" onClick={closeDropdown}>Rotate PDF</Link>
                    <Link to="/add_page_numbers" className="mega-item" onClick={closeDropdown}>Add page numbers</Link>
                    <Link to="/add_watermark" className="mega-item" onClick={closeDropdown}>Add watermark</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Crop PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Edit PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>PDF Forms</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">PDF SECURITY</div>
                    <Link to="/unlock_pdf" className="mega-item" onClick={closeDropdown}>Unlock PDF</Link>
                    <Link to="/protect_pdf" className="mega-item" onClick={closeDropdown}>Protect PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Sign PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Redact PDF</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Compare PDF</Link>
                  </div>
                  <div className="mega-column">
                    <div className="mega-column-title">PDF INTELLIGENCE</div>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>AI Summarizer</Link>
                    <Link to="/convert/pdf" className="mega-item" onClick={closeDropdown}>Translate PDF</Link>
                  </div>
                </div>
              )}
            </div>

            {/* VIDEO TOOLS */}
            <div className="nav-item dropdown" onClick={() => toggleDropdown('video')}>
              VIDEO TOOLS <ChevronDown size={14} />
              {activeDropdown === 'video' && (
                <div className="dropdown-menu">
                  <Link to="/video_to_gif" className="dropdown-item" onClick={closeDropdown}>MP4 to GIF</Link>
                  <Link to="/webm_to_mp4" className="dropdown-item" onClick={closeDropdown}>WEBM to MP4</Link>
                  <Link to="/mute_video" className="dropdown-item" onClick={closeDropdown}>Mute Video</Link>
                  <Link to="/change_video_speed" className="dropdown-item" onClick={closeDropdown}>Change Speed</Link>
                  <Link to="/extract_video_frames" className="dropdown-item" onClick={closeDropdown}>Extract Frames</Link>
                  <Link to="/reverse_video" className="dropdown-item" onClick={closeDropdown}>Reverse Video</Link>
                  <Link to="/trim_video" className="dropdown-item" onClick={closeDropdown}>Trim Video</Link>
                  <Link to="/video_to_audio" className="dropdown-item" onClick={closeDropdown}>Extract Audio</Link>
                </div>
              )}
            </div>

            {/* DATA & DEV */}
            <div className="nav-item dropdown" onClick={() => toggleDropdown('data')}>
              DATA & DEV <ChevronDown size={14} />
              {activeDropdown === 'data' && (
                <div className="dropdown-menu dropdown-menu-right">
                  <Link to="/json_to_csv" className="dropdown-item" onClick={closeDropdown}>JSON to CSV</Link>
                  <Link to="/csv_to_json" className="dropdown-item" onClick={closeDropdown}>CSV to JSON</Link>
                  <Link to="/json_formatter" className="dropdown-item" onClick={closeDropdown}>JSON Formatter</Link>
                  <Link to="/xml_to_json" className="dropdown-item" onClick={closeDropdown}>XML to JSON</Link>
                  <Link to="/base64_encode_decode" className="dropdown-item" onClick={closeDropdown}>Base64 Encoder/Decoder</Link>
                  <Link to="/url_encode_decode" className="dropdown-item" onClick={closeDropdown}>URL Encoder/Decoder</Link>
                  <Link to="/text_case_converter" className="dropdown-item" onClick={closeDropdown}>Text Case Converter</Link>
                  <Link to="/word_character_counter" className="dropdown-item" onClick={closeDropdown}>Word/Char Counter</Link>
                  <Link to="/uuid_generator" className="dropdown-item" onClick={closeDropdown}>UUID Generator</Link>
                  <Link to="/html_formatter" className="dropdown-item" onClick={closeDropdown}>HTML Formatter</Link>
                  <Link to="/css_formatter" className="dropdown-item" onClick={closeDropdown}>CSS Formatter</Link>
                  <Link to="/markdown_to_html" className="dropdown-item" onClick={closeDropdown}>Markdown to HTML</Link>
                  <Link to="/html_to_markdown" className="dropdown-item" onClick={closeDropdown}>HTML to Markdown</Link>
                  <Link to="/regex_tester" className="dropdown-item" onClick={closeDropdown}>Regex Tester</Link>
                  <Link to="/hash_generator" className="dropdown-item" onClick={closeDropdown}>Hash Generator</Link>
                  <Link to="/bcrypt_generator" className="dropdown-item" onClick={closeDropdown}>Bcrypt Generator</Link>
                  <Link to="/jwt_decoder" className="dropdown-item" onClick={closeDropdown}>JWT Decoder</Link>
                  <Link to="/qrcode_generator" className="dropdown-item" onClick={closeDropdown}>QR Code Generator</Link>
                  <Link to="/color_converter" className="dropdown-item" onClick={closeDropdown}>Color Converter</Link>
                  <Link to="/lorem_ipsum" className="dropdown-item" onClick={closeDropdown}>Lorem Ipsum Generator</Link>
                </div>
              )}
            </div>

            {/* ALL TOOLS */}
            <div className="nav-item dropdown" onClick={() => toggleDropdown('all')}>
              ALL TOOLS <ChevronDown size={14} />
              {activeDropdown === 'all' && (
                <div className="dropdown-menu">
                  <Link to="/" className="dropdown-item" onClick={closeDropdown}>View Dashboard</Link>
                  <Link to="/json_to_csv" className="dropdown-item" onClick={closeDropdown}>JSON to CSV</Link>
                  <Link to="/convert/3d" className="dropdown-item" onClick={closeDropdown}>3D & CAD</Link>
                  <Link to="/hash_generator" className="dropdown-item" onClick={closeDropdown}>Hash Generator (SHA256)</Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="header-right">
          <button className="btn-grid"><Grid size={24} color="#555" /></button>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/convert/:categoryId" element={<UniversalConverter />} />
          <Route path="/merge_pdf" element={<MergePDF />} />
          <Route path="/split_pdf" element={<SplitPDF />} />
          <Route path="/extract_pages" element={<ExtractPages />} />
          <Route path="/remove_pages" element={<RemovePages />} />
          <Route path="/rotate_pdf" element={<RotatePDF />} />
          <Route path="/add_page_numbers" element={<AddPageNumbers />} />
          <Route path="/convert_image" element={<ConvertImage />} />
          <Route path="/compress_image" element={<CompressImage />} />
          <Route path="/video_to_gif" element={<VideoToGif />} />
          <Route path="/video_to_audio" element={<VideoToAudio />} />
          <Route path="/image_to_pdf" element={<ImageToPDF />} />
          <Route path="/pdf_to_image" element={<PdfToImage />} />
          <Route path="/word_to_pdf" element={<WordToPdf />} />
          <Route path="/pdf_to_word" element={<PdfToWord />} />
          <Route path="/excel_to_pdf" element={<ExcelToPdf />} />
          <Route path="/powerpoint_to_pdf" element={<PowerpointToPdf />} />
          <Route path="/compress_pdf" element={<CompressPdfBackend />} />
          <Route path="/remove_background" element={<RemoveBackground />} />
          <Route path="/protect_pdf" element={<ProtectPDF />} />
          <Route path="/unlock_pdf" element={<UnlockPDF />} />
          <Route path="/trim_video" element={<TrimVideo />} />
          <Route path="/add_watermark" element={<AddWatermark />} />
          <Route path="/hash_generator" element={<HashGenerator />} />
          <Route path="/json_to_csv" element={<JsonToCsv />} />
          <Route path="/gif_to_mp4" element={<GifToMp4 />} />
          <Route path="/svg_to_png" element={<SvgToPng />} />
          <Route path="/image_to_ico" element={<ImageToIco />} />
          <Route path="/resize_image" element={<ResizeImage />} />
          <Route path="/rotate_image" element={<RotateImage />} />
          <Route path="/grayscale_image" element={<GrayscaleImage />} />
          <Route path="/image_blur" element={<ImageBlur />} />
          <Route path="/bmp_to_png" element={<BmpToPng />} />
          <Route path="/webm_to_mp4" element={<WebmToMp4 />} />
          <Route path="/mute_video" element={<MuteVideo />} />
          <Route path="/change_video_speed" element={<ChangeVideoSpeed />} />
          <Route path="/extract_video_frames" element={<ExtractVideoFrames />} />
          <Route path="/reverse_video" element={<ReverseVideo />} />
          <Route path="/csv_to_json" element={<CsvToJson />} />
          <Route path="/base64_encode_decode" element={<Base64EncodeDecode />} />
          <Route path="/url_encode_decode" element={<UrlEncodeDecode />} />
          <Route path="/text_case_converter" element={<TextCaseConverter />} />
          <Route path="/word_character_counter" element={<WordCharacterCounter />} />
          <Route path="/uuid_generator" element={<UuidGenerator />} />
          <Route path="/html_formatter" element={<HtmlFormatter />} />
          <Route path="/css_formatter" element={<CssFormatter />} />
          <Route path="/json_formatter" element={<JsonFormatter />} />
          <Route path="/qrcode_generator" element={<QrCodeGenerator />} />
          <Route path="/color_converter" element={<ColorConverter />} />
          <Route path="/lorem_ipsum" element={<LoremIpsumGenerator />} />
          <Route path="/jwt_decoder" element={<JwtDecoder />} />
          <Route path="/markdown_to_html" element={<MarkdownToHtml />} />
          <Route path="/html_to_markdown" element={<HtmlToMarkdown />} />
          <Route path="/regex_tester" element={<RegexTester />} />
          <Route path="/bcrypt_generator" element={<BcryptGenerator />} />
          <Route path="/xml_to_json" element={<XmlToJson />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
