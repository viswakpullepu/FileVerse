from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import tempfile
import subprocess
import shutil

app = FastAPI(title="PDF Suite Backend", description="Local backend for heavy PDF conversions")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "PDF Suite Backend is running. Processing stays 100% local."}

@app.post("/api/convert/word-to-pdf")
async def convert_word_to_pdf(file: UploadFile = File(...)):
    """
    Converts a Word document (.doc, .docx) to PDF locally.
    Uses 'docx2pdf' which requires Microsoft Word to be installed on Windows.
    """
    try:
        from docx2pdf import convert
    except ImportError:
        return {"error": "docx2pdf is not installed. Please run: pip install docx2pdf"}
        
    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, file.filename)
        output_path = os.path.join(temp_dir, "output.pdf")
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            # Run local conversion
            convert(input_path, output_path)
            
            # Since FileResponse needs the file to exist after the function returns,
            # we need to save it to a known temporary location outside this context block.
            final_out = os.path.join(tempfile.gettempdir(), f"converted_{file.filename}.pdf")
            shutil.copy(output_path, final_out)
            
            return FileResponse(final_out, media_type="application/pdf", filename=f"converted_{file.filename}.pdf")
        except Exception as e:
            return {"error": f"Conversion failed. Do you have MS Word installed? Details: {str(e)}"}

@app.post("/api/convert/pdf-to-word")
async def convert_pdf_to_word(file: UploadFile = File(...)):
    """
    Converts a PDF document to an editable Word (.docx) file locally.
    Uses 'pdf2docx'.
    """
    try:
        from pdf2docx import Converter
    except ImportError:
        return {"error": "pdf2docx is not installed. Please run: pip install pdf2docx"}

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, file.filename)
        output_path = os.path.join(temp_dir, "output.docx")
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            cv = Converter(input_path)
            cv.convert(output_path, start=0, end=None)
            cv.close()
            
            final_out = os.path.join(tempfile.gettempdir(), f"converted_{file.filename.replace('.pdf', '')}.docx")
            shutil.copy(output_path, final_out)
            
            return FileResponse(final_out, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename=f"converted_{file.filename.replace('.pdf', '')}.docx")
        except Exception as e:
            return {"error": f"PDF to Word failed: {str(e)}"}

@app.post("/api/convert/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):
    """
    Compresses a PDF file locally using PyMuPDF (fitz).
    """
    try:
        import fitz  # PyMuPDF
    except ImportError:
        return {"error": "PyMuPDF is not installed. Please run: pip install PyMuPDF"}

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, file.filename)
        output_path = os.path.join(temp_dir, "compressed.pdf")
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            doc = fitz.open(input_path)
            # Garbage collection mode 4 removes dead objects and compacts the file
            doc.save(output_path, garbage=4, deflate=True)
            doc.close()
            
            final_out = os.path.join(tempfile.gettempdir(), f"compressed_{file.filename}")
            shutil.copy(output_path, final_out)
            
            return FileResponse(final_out, media_type="application/pdf", filename=f"compressed_{file.filename}")
        except Exception as e:
            return {"error": f"PDF Compression failed: {str(e)}"}

@app.post("/api/convert/excel-to-pdf")
async def convert_excel_to_pdf(file: UploadFile = File(...)):
    """
    Converts Excel (.xls, .xlsx) to PDF locally using win32com.
    Requires MS Excel to be installed.
    """
    try:
        import win32com.client
    except ImportError:
        return {"error": "pywin32 is not installed."}

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.abspath(os.path.join(temp_dir, file.filename))
        output_path = os.path.abspath(os.path.join(temp_dir, "output.pdf"))
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        excel = None
        wb = None
        try:
            excel = win32com.client.DispatchEx("Excel.Application")
            excel.Interactive = False
            excel.Visible = False
            
            wb = excel.Workbooks.Open(input_path)
            # 0 is xlTypePDF
            wb.ExportAsFixedFormat(0, output_path)
            wb.Close(False)
            excel.Quit()
            
            final_out = os.path.join(tempfile.gettempdir(), f"converted_{file.filename}.pdf")
            shutil.copy(output_path, final_out)
            
            return FileResponse(final_out, media_type="application/pdf", filename=f"converted_{file.filename}.pdf")
        except Exception as e:
            if wb:
                wb.Close(False)
            if excel:
                excel.Quit()
            return {"error": f"Excel to PDF failed. Do you have MS Excel installed? Details: {str(e)}"}

@app.post("/api/convert/powerpoint-to-pdf")
async def convert_powerpoint_to_pdf(file: UploadFile = File(...)):
    """
    Converts PowerPoint (.ppt, .pptx) to PDF locally using win32com.
    Requires MS PowerPoint to be installed.
    """
    try:
        import win32com.client
    except ImportError:
        return {"error": "pywin32 is not installed."}

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.abspath(os.path.join(temp_dir, file.filename))
        output_path = os.path.abspath(os.path.join(temp_dir, "output.pdf"))
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        powerpoint = None
        presentation = None
        try:
            powerpoint = win32com.client.DispatchEx("Powerpoint.Application")
            # PowerPoint requires window to be visible or minimized sometimes, but let's try purely background
            # 32 is ppSaveAsPDF
            presentation = powerpoint.Presentations.Open(input_path, WithWindow=False)
            presentation.SaveAs(output_path, 32)
            presentation.Close()
            powerpoint.Quit()
            
            final_out = os.path.join(tempfile.gettempdir(), f"converted_{file.filename}.pdf")
            shutil.copy(output_path, final_out)
            
            return FileResponse(final_out, media_type="application/pdf", filename=f"converted_{file.filename}.pdf")
        except Exception as e:
            if presentation:
                presentation.Close()
            if powerpoint:
                powerpoint.Quit()
            return {"error": f"PowerPoint to PDF failed. Do you have MS PowerPoint installed? Details: {str(e)}"}

@app.post("/api/convert/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """
    Removes background from an image using rembg locally.
    Returns a transparent PNG.
    """
    try:
        from rembg import remove
        from PIL import Image
        import io
    except ImportError:
        return {"error": "rembg is not installed. Please run: pip install rembg pillow"}

    try:
        input_image_bytes = await file.read()
        
        # Remove background
        output_image_bytes = remove(input_image_bytes)
        
        # Convert output bytes to PIL Image to verify and save
        img = Image.open(io.BytesIO(output_image_bytes))
        
        final_out = os.path.join(tempfile.gettempdir(), f"nobg_{file.filename}.png")
        img.save(final_out, format="PNG")
        
        return FileResponse(final_out, media_type="image/png", filename=f"nobg_{file.filename}.png")
    except Exception as e:
        return {"error": f"Background Removal failed: {str(e)}"}
