#!/usr/bin/env bash
# run.sh - 运行 TechHub Pro Java 后端
cd "$(dirname "$0")"
CP="bin:lib/sqlite-jdbc.jar"
PORT="${1:-8080}"
echo "🚀 启动 TechHub Pro v6.0 (port=$PORT) ..."
java -cp "$CP" Application --port "$PORT" --web . --db techhub.db
