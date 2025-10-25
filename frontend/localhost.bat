@echo off
echo Starting RoomApp Development Server...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting development server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause
