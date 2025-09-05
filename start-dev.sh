#!/bin/bash

echo "启动懂研网开发环境..."
echo

echo "1. 启动后端服务器 (Django)..."
cd dongyanwang_drf
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

echo "2. 等待后端启动..."
sleep 3

echo "3. 启动前端服务器 (React)..."
cd ../../frontend
npm start &
FRONTEND_PID=$!

echo
echo "开发环境启动完成！"
echo "后端地址: http://127.0.0.1:8000"
echo "前端地址: http://localhost:3000"
echo
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
