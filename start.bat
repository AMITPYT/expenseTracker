@echo off
echo Starting Expense Tracker Application...
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is running ✓
) else (
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB before continuing.
    echo.
    pause
    exit /b
)

echo.
echo Starting Backend Server...
cd backend
start "Expense Tracker Backend" cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
cd ../frontend
start "Expense Tracker Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Expense Tracker is starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to open the application in your browser...
pause > nul

start http://localhost:5173

echo.
echo Application is now running!
echo Close the terminal windows to stop the servers.
echo.
