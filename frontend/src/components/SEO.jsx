import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Comprehensive metadata catalog for all routes on FileVerze
const ROUTE_SEO_MAP = {
  '/': {
    title: 'FileVerze — Free 100% In-Browser File Converter & Privacy Powerhouse',
    description: 'Convert, compress, and edit PDFs, images, videos, 3D models, fonts, subtitles, and spreadsheets 100% locally in your browser. Zero server uploads.',
    keywords: 'file converter, universal dropzone, private file converter, local file tools, pdf tools, image tools'
  },
  '/all_tools': {
    title: 'All Tools Catalog — FileVerze',
    description: 'Browse all 50+ free in-browser file conversion, optimization, dev, and media tools.',
    keywords: 'all tools, file tools, free converters, pdf tools, image tools, dev tools'
  },
  '/universal_converter': {
    title: 'Universal File Converter — FileVerze',
    description: 'Drop any document, image, video, 3D model, or spreadsheet to detect and convert natively.',
    keywords: 'universal converter, smart dropzone, file format detector'
  },
  '/faq': {
    title: 'Frequently Asked Questions & Knowledge Base — FileVerze',
    description: 'Learn how FileVerze processes PDFs, images, videos, 3D models, and office documents 100% locally in your browser with zero server uploads.',
    keywords: 'fileverze faq, private file converter faq, zero upload conversion, client side file tools questions'
  },

  // PDF
  '/merge_pdf': {
    title: 'Merge PDF Online (Free & Private) — FileVerze',
    description: 'Combine multiple PDF files into one single document locally in your browser. 100% private.',
    keywords: 'merge pdf, combine pdf, join pdf files, free pdf merger'
  },
  '/split_pdf': {
    title: 'Split PDF Online (Free & Fast) — FileVerze',
    description: 'Separate pages or extract page ranges from PDF files with instant local processing.',
    keywords: 'split pdf, extract pdf pages, separate pdf'
  },
  '/pdf_to_word': {
    title: 'PDF to Word (.docx) Converter — FileVerze',
    description: 'Convert PDF documents into editable Microsoft Word (.docx) files locally in your browser.',
    keywords: 'pdf to word, pdf to docx, convert pdf to word, editable word document'
  },
  '/word_to_pdf': {
    title: 'Word to PDF Converter (.docx to PDF) — FileVerze',
    description: 'Convert Word DOCX documents into clean, paginated vector PDF files with zero server uploads.',
    keywords: 'word to pdf, docx to pdf, convert word document'
  },
  '/compress_pdf': {
    title: 'Compress PDF Online (Shrink PDF Size) — FileVerze',
    description: 'Reduce PDF file size with smart image optimization and metadata compaction entirely in-browser.',
    keywords: 'compress pdf, shrink pdf, reduce pdf size, optimize pdf'
  },
  '/excel_to_pdf': {
    title: 'Excel to PDF Converter (.xlsx to PDF Table) — FileVerze',
    description: 'Convert Excel spreadsheets (.xlsx, .xls) into clean landscape PDF tables natively.',
    keywords: 'excel to pdf, xlsx to pdf, spreadsheet to pdf table'
  },
  '/powerpoint_to_pdf': {
    title: 'PowerPoint to PDF Converter (.pptx to PDF) — FileVerze',
    description: 'Convert PowerPoint slide presentations into clean 16:9 landscape PDF documents in your browser.',
    keywords: 'powerpoint to pdf, pptx to pdf, ppt to pdf, presentation slides to pdf'
  },
  '/pdf_to_image': {
    title: 'PDF to Image Converter (PDF to JPG/PNG) — FileVerze',
    description: 'Convert every page of a PDF document into high-resolution JPG images instantly.',
    keywords: 'pdf to image, pdf to jpg, pdf to png, render pdf pages'
  },
  '/image_to_pdf': {
    title: 'Image to PDF Converter — FileVerze',
    description: 'Convert JPG, PNG, and WebP images into a single PDF document.',
    keywords: 'image to pdf, jpg to pdf, png to pdf'
  },
  '/remove_pages': {
    title: 'Remove PDF Pages — FileVerze',
    description: 'Delete specific unwanted pages from your PDF documents.',
    keywords: 'remove pdf pages, delete pages from pdf'
  },
  '/extract_pages': {
    title: 'Extract PDF Pages — FileVerze',
    description: 'Extract select pages into a new independent PDF document.',
    keywords: 'extract pdf pages, split pdf page range'
  },
  '/rotate_pdf': {
    title: 'Rotate PDF Online — FileVerze',
    description: 'Rotate individual pages or entire PDF documents permanently.',
    keywords: 'rotate pdf, flip pdf pages, change pdf orientation'
  },
  '/add_page_numbers': {
    title: 'Add Page Numbers to PDF — FileVerze',
    description: 'Stamp custom page numbering into headers and footers of PDF documents.',
    keywords: 'add page numbers pdf, stamp page numbers'
  },
  '/add_watermark': {
    title: 'Add Watermark to PDF — FileVerze',
    description: 'Stamp custom text or image watermarks onto PDF pages with opacity controls.',
    keywords: 'watermark pdf, stamp pdf watermark'
  },
  '/unlock_pdf': {
    title: 'Unlock PDF (Remove Password) — FileVerze',
    description: 'Remove restrictions and passwords from encrypted PDF files.',
    keywords: 'unlock pdf, remove pdf password'
  },
  '/protect_pdf': {
    title: 'Protect PDF (Password Encrypt) — FileVerze',
    description: 'Encrypt and password-protect your confidential PDF documents.',
    keywords: 'protect pdf, password protect pdf, encrypt pdf'
  },

  // Image
  '/remove_background': {
    title: 'AI Background Remover (100% In-Browser) — FileVerze',
    description: 'Remove background from images and export transparent PNGs directly in your browser. Fast, private, and offline.',
    keywords: 'remove background, background remover, transparent png, remove bg'
  },
  '/compress_image': {
    title: 'Compress Image (JPG, PNG, WebP) — FileVerze',
    description: 'Compress images to reduce file size while preserving high visual quality.',
    keywords: 'compress image, shrink image size, optimize jpg, optimize png'
  },
  '/ocr_extractor': {
    title: 'OCR Text Extractor (Image to Text) — FileVerze',
    description: 'Extract text from scanned images and documents using in-browser neural AI (Tesseract.js).',
    keywords: 'ocr extractor, image to text, extract text from photo, tesseract ocr'
  },
  '/gemini_watermark_remover': {
    title: 'Gemini Watermark Remover — FileVerze',
    description: 'Cleanly remove visible Google Gemini watermarks from AI-generated images.',
    keywords: 'gemini watermark remover, remove watermark ai'
  },
  '/convert_image': {
    title: 'Convert Image Format (PNG, JPG, WebP) — FileVerze',
    description: 'Convert between PNG, JPG, and modern WebP formats in seconds.',
    keywords: 'convert image, png to jpg, jpg to png, convert to webp'
  },
  '/resize_image': {
    title: 'Resize Image Dimensions — FileVerze',
    description: 'Resize image dimensions by pixels or percentage scale.',
    keywords: 'resize image, scale photo, change image resolution'
  },
  '/rotate_image': {
    title: 'Rotate Image Online — FileVerze',
    description: 'Rotate images 90, 180, or 270 degrees.',
    keywords: 'rotate image, flip photo'
  },
  '/grayscale_image': {
    title: 'Grayscale Image Filter — FileVerze',
    description: 'Convert color photos into clean black-and-white tonal images.',
    keywords: 'grayscale image, black and white filter'
  },
  '/image_blur': {
    title: 'Image Blur & Privacy Obscure — FileVerze',
    description: 'Apply Gaussian blur to obscure sensitive details in pictures.',
    keywords: 'blur image, redact photo, gaussian blur'
  },
  '/bmp_to_png': {
    title: 'BMP to PNG Converter — FileVerze',
    description: 'Convert legacy BMP bitmaps into modern compressed PNGs.',
    keywords: 'bmp to png, convert bmp'
  },
  '/svg_to_png': {
    title: 'SVG to PNG Converter — FileVerze',
    description: 'Rasterize vector SVG files into high-resolution PNG images.',
    keywords: 'svg to png, rasterize svg'
  },
  '/image_to_ico': {
    title: 'Image to ICO Favicon Generator — FileVerze',
    description: 'Convert images to multi-size Windows icon (.ico) favicons.',
    keywords: 'image to ico, favicon generator, create ico'
  },

  // Video
  '/video_to_gif': {
    title: 'Video to GIF Converter — FileVerze',
    description: 'Convert video clips (MP4, WebM) into lightweight animated GIFs.',
    keywords: 'video to gif, mp4 to gif, create gif from video'
  },
  '/video_to_audio': {
    title: 'Extract Audio from Video (Video to MP3/WAV) — FileVerze',
    description: 'Extract audio soundtracks directly from video files.',
    keywords: 'video to audio, extract mp3, video to mp3'
  },
  '/trim_video': {
    title: 'Trim Video Online — FileVerze',
    description: 'Cut and trim video segments right inside your browser.',
    keywords: 'trim video, cut video, slice video'
  },
  '/mute_video': {
    title: 'Mute Video (Remove Audio Track) — FileVerze',
    description: 'Strip audio tracks completely from video clips.',
    keywords: 'mute video, remove sound from video'
  },
  '/change_video_speed': {
    title: 'Change Video Speed (Slow Motion & Fast Forward) — FileVerze',
    description: 'Speed up or slow down video playback frame rate.',
    keywords: 'change video speed, slow motion video, speed up video'
  },
  '/extract_video_frames': {
    title: 'Extract Video Frames (Video to JPG Sequence) — FileVerze',
    description: 'Extract high-resolution image frames from video files.',
    keywords: 'extract video frames, video to images'
  },
  '/reverse_video': {
    title: 'Reverse Video Playback — FileVerze',
    description: 'Play video clips backwards from end to start.',
    keywords: 'reverse video, play video backwards'
  },
  '/webm_to_mp4': {
    title: 'WebM to MP4 Converter — FileVerze',
    description: 'Convert WebM video clips into universally compatible MP4 format.',
    keywords: 'webm to mp4, convert webm'
  },

  // Phase 2
  '/threed_converter': {
    title: '3D STL Viewport & Mesh Inspector — FileVerze',
    description: 'Inspect 3D STL geometry in interactive WebGL viewport with wireframe, lighting, and polycount analysis.',
    keywords: '3d viewer, stl viewer, stl converter, webgl 3d model'
  },
  '/gis_converter': {
    title: 'GIS Map Converter (GeoJSON ↔ KML) — FileVerze',
    description: 'Convert between GeoJSON, Google Earth KML, and CSV map coordinates in your browser.',
    keywords: 'gis converter, geojson to kml, kml to geojson, csv to geojson'
  },
  '/font_converter': {
    title: 'Font Inspector & @font-face Generator (TTF, OTF, WOFF) — FileVerze',
    description: 'Inspect typography glyphs, test custom strings in real-time, and generate @font-face CSS snippets.',
    keywords: 'font converter, ttf to woff, opentype font inspector, font face css'
  },
  '/ebook_converter': {
    title: 'EPUB E-Book Reader & Builder — FileVerze',
    description: 'Extract EPUB chapters, read books in browser, and compile digital EPUB 3 publications.',
    keywords: 'ebook converter, epub reader, epub builder, extract epub'
  },
  '/subtitle_converter': {
    title: 'Subtitle Converter (SRT ↔ VTT ↔ ASS) — FileVerze',
    description: 'Convert subtitle files between SubRip (.srt), WebVTT (.vtt), and ASS formats with timing offset sync.',
    keywords: 'subtitle converter, srt to vtt, vtt to srt, subtitle sync offset'
  },

  // Dev & Data
  '/json_formatter': {
    title: 'JSON Formatter & Validator — FileVerze',
    description: 'Beautify, validate, and minify JSON data structures.',
    keywords: 'json formatter, format json, beautify json, minify json'
  },
  '/csv_to_json': {
    title: 'CSV to JSON Converter — FileVerze',
    description: 'Convert spreadsheet CSV data into formatted JSON arrays and objects.',
    keywords: 'csv to json, convert spreadsheet to json'
  },
  '/json_to_csv': {
    title: 'JSON to CSV Converter — FileVerze',
    description: 'Export JSON arrays into tabular CSV spreadsheet format.',
    keywords: 'json to csv, convert json to spreadsheet'
  },
  '/xml_to_json': {
    title: 'XML to JSON Converter — FileVerze',
    description: 'Parse XML tags into native structured JSON models.',
    keywords: 'xml to json, parse xml'
  },
  '/base64_encode_decode': {
    title: 'Base64 Encoder & Decoder — FileVerze',
    description: 'Encode text and files to Base64 or decode Base64 strings to original text.',
    keywords: 'base64 encode, base64 decode, base64 converter'
  },
  '/hash_generator': {
    title: 'Cryptographic Hash Generator (SHA-256, MD5, SHA-512) — FileVerze',
    description: 'Compute checksum cryptographic hashes for text and file verification.',
    keywords: 'hash generator, sha256 hash, md5 hash, checksum generator'
  },
  '/bcrypt_generator': {
    title: 'Bcrypt Hash Generator & Verifier — FileVerze',
    description: 'Generate salted bcrypt password hashes with configurable work factor.',
    keywords: 'bcrypt generator, bcrypt hash, password hash'
  },
  '/word_character_counter': {
    title: 'Word, Character & Reading Time Counter — FileVerze',
    description: 'Analyze word counts, character lengths, sentence density, and reading duration.',
    keywords: 'word counter, character counter, reading time calculator'
  },
  '/markdown_to_html': {
    title: 'Markdown to HTML Converter — FileVerze',
    description: 'Compile Markdown syntax into semantic HTML markup in real-time.',
    keywords: 'markdown to html, convert markdown, md to html'
  },
  '/html_to_markdown': {
    title: 'HTML to Markdown Converter — FileVerze',
    description: 'Convert HTML markup trees into clean Markdown syntax.',
    keywords: 'html to markdown, convert html to md'
  },
  '/css_formatter': {
    title: 'CSS Formatter & Minifier — FileVerze',
    description: 'Format, beautify, and compress CSS stylesheets.',
    keywords: 'css formatter, minify css, beautify css'
  },
  '/html_formatter': {
    title: 'HTML Formatter & Minifier — FileVerze',
    description: 'Format, indent, and compress HTML documents.',
    keywords: 'html formatter, format html, minify html'
  }
};

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const meta = ROUTE_SEO_MAP[path] || ROUTE_SEO_MAP['/'];

    // Update document title
    document.title = meta.title;

    // Update or create Meta Description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    // Update or create Meta Keywords
    let kwTag = document.querySelector('meta[name="keywords"]');
    if (!kwTag) {
      kwTag = document.createElement('meta');
      kwTag.setAttribute('name', 'keywords');
      document.head.appendChild(kwTag);
    }
    kwTag.setAttribute('content', meta.keywords);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://fileverze.com${path}`);

    // Update Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://fileverze.com${path}`);

  }, [location.pathname]);

  return null;
}
