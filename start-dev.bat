@echo off
echo 启动懂研网开发环境...
echo.

echo 1. 启动后端服务器 (Django)...
start "后端服务器" cmd /k "cd dongyanwang_drf && python manage.py runserver 0.0.0.0:8000"

echo 2. 等待后端启动...
timeout /t 3 /nobreak > nul

echo 3. 启动前端服务器 (React)...
start "前端服务器" cmd /k "cd frontend && npm start"

echo.
echo 开发环境启动完成！
echo 后端地址: http://127.0.0.1:8000
echo 前端地址: http://localhost:3000
echo.
echo 按任意键退出...
pause > nul
