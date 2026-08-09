#!/bin/bash
# TechHub Pro v4.0 启动脚本
# 用法: ./run.sh [port]
PORT=${1:-8080}
echo "🚀 启动 TechHub Pro 服务器 (端口 $PORT)..."
echo "   控制台命令: stats | courses | reload | quit"
echo ""
if [ -f "lib/sqlite-jdbc.jar" ]; then
  CP=".:lib/sqlite-jdbc.jar"
else
  CP="."
fi
java -cp "$CP" Application $PORT
