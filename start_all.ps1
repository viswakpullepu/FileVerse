# Start FastAPI Backend in background
Start-Process -FilePath "powershell" -ArgumentList "-Command `"cd backend; .\venv\Scripts\uvicorn main:app --reload --port 8000`"" -WindowStyle Normal

# Start Vite Frontend in background
Start-Process -FilePath "powershell" -ArgumentList "-Command `"cd frontend; npm run dev`"" -WindowStyle Normal

Write-Host "PDF Suite is starting up..."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend API: http://localhost:8000"
