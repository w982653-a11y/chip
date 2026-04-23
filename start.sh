#!/bin/bash

echo "========================================"
echo "智监微痕 - 智能水质监测系统"
echo "========================================"
echo ""

echo "[1/2] 启动API服务..."
python3 api_server.py &
API_PID=$!
sleep 2

echo "[2/2] 启动前端服务..."
python3 -m http.server 8000 &
FRONTEND_PID=$!
sleep 2

echo ""
echo "========================================"
echo "服务启动完成！"
echo "========================================"
echo ""
echo "API服务: http://localhost:5000"
echo "前端服务: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 保存PID以便后续清理
echo $API_PID > api_server.pid
echo $FRONTEND_PID > frontend_server.pid

# 打开浏览器（可选）
if command -v open &> /dev/null; then
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8000
fi

# 等待用户中断
trap "kill $API_PID $FRONTEND_PID; rm -f api_server.pid frontend_server.pid; echo ''; echo '服务已停止'; exit 0" INT TERM

wait
