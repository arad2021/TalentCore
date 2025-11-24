@echo off
echo Building React app...
cd app
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Copying files to Spring Boot...
cd ..
xcopy /E /I /Y app\build\* Temp\src\main\resources\static\

echo Done! Now restart your Spring Boot application.
pause
