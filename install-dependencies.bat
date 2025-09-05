@echo off
echo 安装懂研网项目依赖...
echo.

echo 1. 安装后端依赖 (Python)...
cd dongyanwang_drf
pip install django-cors-headers
echo 后端依赖安装完成！

echo.
echo 2. 安装前端依赖 (Node.js)...
cd ../frontend
npm install axios
echo 前端依赖安装完成！

echo.
echo 所有依赖安装完成！
echo 现在可以运行 start-dev.bat 启动开发环境
echo.
pause
