@echo off
chcp 65001 >nul
echo ========================================
echo 智监微痕 - 智能水质监测系统
echo ========================================
echo.

echo [1/2] 启动API服务...
start "API Server" cmd /k "python api_server.py"
timeout /t 2 /nobreak >nul

echo [2/2] 启动前端服务...
start "Frontend Server" cmd /k "python -m http.server 8000"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo 服务启动完成！
echo ========================================
echo.
echo API服务: http://localhost:5000
echo 前端服务: http://localhost:8000
echo.
echo 按任意键打开浏览器...
pause >nul

echo 正在打开浏览器...
start http://localhost:8000

echo.
echo 提示：关闭本窗口不会停止服务
echo 如需停止服务，请关闭相应的命令行窗口
pause
