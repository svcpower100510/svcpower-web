#!/bin/bash
# TechHub Pro v6.0 — 启动脚本
cd "$(dirname "$0")"

CP="bin"
if [ -f "lib/sqlite-jdbc.jar" ]; then CP="bin:lib/sqlite-jdbc.jar"; fi

echo "🚀 启动 TechHub Pro v6.0..."
echo "   访问：http://localhost:8080"
echo "   API文档：http://localhost:8080/api/health"
echo ""

java -cp "$CP" Application "$@"
