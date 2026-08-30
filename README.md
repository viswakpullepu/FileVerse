<div align="center">

# 🌐 FileVerze — Free 100% In-Browser File Converter & Privacy Powerhouse

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](LICENSE)
[![Zero Cloud Uploads](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10b981.svg?style=flat-square)](https://fileverze.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-0284c7.svg?style=flat-square)](https://fileverze.com)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundled%20with-Vite%208-646cff.svg?style=flat-square&logo=vite)](https://vite.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](https://github.com/viswakpullepu/FileVerse/pulls)

**Every file tool you could ever need in one place. Convert, compress, edit, inspect, and analyze 50+ file formats 100% locally in your browser with zero server uploads.**

[**Explore Live Demo**](https://fileverze.com) • [**Browse All Tools**](https://fileverze.com/all_tools) • [**FAQ & Knowledge Base**](https://fileverze.com/faq) • [**LLM Spec (/llms.txt)**](https://fileverze.com/llms.txt)

</div>

---

## ⚡ Why FileVerze?

Traditional file converters upload your files to remote third-party cloud servers, put you in slow queues, impose 10MB–50MB file size throttles, and charge $12–$20/month.

**FileVerze changes everything.** By leveraging modern **WebAssembly (WASM)**, **WebGL**, **HTML5 Canvas**, and **Web Workers**, 100% of calculations occur in your browser RAM. Your files never leave your computer.

| Feature | 🌐 FileVerze (Client-Side) | ☁️ Traditional Cloud Converters |
| :--- | :--- | :--- |
| **Privacy & Security** | ✅ **100% On-Device** (0 bytes sent to internet) | ❌ Stored on 3rd-party remote cloud servers |
| **Processing Speed** | ⚡ **Instant RAM/CPU compute** | ⏳ Slow network upload/download queues |
| **File Size Limits** | ♾️ **Unlimited** (uses device RAM) | ❌ 10MB–50MB caps for free users |
| **Pricing** | 🎁 **100% Free Forever** | 💳 $12–$20 / Month Subscriptions |
| **Offline Support** | 📶 **Full PWA Offline Mode** | ❌ Broken without active internet |
| **Account Required** | 🚫 **None** (instant zero-friction use) | ❌ Mandatory email signups |

---

## 🧰 50+ Native In-Browser Tools

### 📄 PDF Document Suite
- **Merge & Split PDF**: Combine multiple PDFs or extract custom page ranges locally.
- **PDF to Word (.docx)**: Extracts text runs with geometry into editable Microsoft Word documents via `pdfjs-dist` + `JSZip`.
- **Word to PDF (.docx to PDF)**: Compiles OpenXML paragraphs into clean vector PDF pages using `pdf-lib`.
- **Compress PDF**: Multi-level canvas resampling (Extreme, Recommended, Light) with structural optimization.
- **Excel to PDF & PowerPoint to PDF**: Parses `.xlsx` tables and `.pptx` slides into formatted landscape PDFs.
- **PDF to Image / Image to PDF**: High-res raster page rendering and embedding.
- **Security**: Unlock password-protected PDFs or encrypt sensitive documents with 128/256-bit passwords.

### 🖼️ Image & Computer Vision
- **AI Background Remover**: Isolates photo subjects using Euclidean color-distance segmentation and alpha feathering directly in Canvas.
- **OCR Text Extractor**: Extracts text from scanned photos using compiled Tesseract.js neural WebAssembly.
- **Gemini Watermark Remover**: Cleanly cleans visible AI watermarks natively.
- **Format Converters**: Instant lossless conversion between PNG, JPG, WebP, SVG, BMP, and ICO.

### 📐 3D, GIS, Typography & E-Books
- **3D STL Viewport**: Interactive Three.js WebGL viewport with wireframe, lighting, and polycount inspector.
- **GIS Map Converter**: Bidirectional conversion between GeoJSON, Google Earth KML, and CSV coordinate datasets.
- **Typography Font Inspector**: Real-time `@font-face` CSS generator and opentype.js glyph inspector (TTF, OTF, WOFF).
- **E-Book Reader & Builder**: Unpacks EPUB chapters and compiles standard digital EPUB 3 publications.
- **Subtitle Converter**: SubRip (`.srt`) ↔ WebVTT (`.vtt`) ↔ ASS with millisecond-precision timing offset shift.

### 💻 Developer & Data Utilities
- **JSON Formatter & CSV ↔ JSON**: Beautify, validate, minify, and cross-convert tabular datasets.
- **Cryptographic Hashes**: SHA-256, MD5, SHA-512 checksums, and salted Bcrypt hash generator.
- **Markdown & HTML**: Real-time Markdown to HTML and HTML to Markdown converters.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/viswakpullepu/FileVerse.git
cd FileVerse/frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

---

## 🤖 AI & Generative Engine Optimization (GEO)
FileVerze exposes a standard machine-readable LLM endpoint:
- **LLM Summary:** [`/llms.txt`](https://fileverze.com/llms.txt)
- **Full Reference:** [`/llms-full.txt`](https://fileverze.com/llms-full.txt)
- **XML Sitemap:** [`/sitemap.xml`](https://fileverze.com/sitemap.xml)

---

## 📄 License
Released under the [MIT License](LICENSE). Built for open privacy and speed.
