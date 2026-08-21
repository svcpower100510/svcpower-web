#!/usr/bin/env bash
# compile.sh - 编译 TechHub Pro Java 后端（Java 11+）
set -e
cd "$(dirname "$0")"
mkdir -p bin
CP=".:lib/sqlite-jdbc.jar"
if [ ! -f lib/sqlite-jdbc.jar ] || [ ! -s lib/sqlite-jdbc.jar ]; then
  echo "⚠ lib/sqlite-jdbc.jar 为空占位文件，编译将跳过数据库相关运行验证"
  echo "  请将真实的 sqlite-jdbc-3.42.0.jar 重命名为 sqlite-jdbc.jar 放入 lib/ 后重新编译"
fi
echo "📦 编译 server/*.java ..."
javac -encoding UTF-8 -cp "$CP" -d bin server/Application.java server/TechHubServer.java server/DatabaseUtil.java server/CourseService.java server/PaymentService.java server/DataStore.java
echo "✅ 编译完成，class 文件输出到 bin/"
echo "   运行：./run.sh"
