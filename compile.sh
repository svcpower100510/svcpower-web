#!/bin/bash
# TechHub Pro v4.0 编译脚本
set -e
echo "╔════════════════════════════════════╗"
echo "║   TechHub Pro v4.0 编译脚本         ║"
echo "╚════════════════════════════════════╝"
echo ""
JAVAC=$(which javac || true)
if [ -z "$JAVAC" ]; then
  echo "⚠️  未找到 javac，跳过 Java 编译"
  echo "    本地开发请安装 JDK 11+"
  echo "    或使用 ./run.sh 直接运行"
  exit 0
fi
JAVA_VER=$($JAVAC -version 2>&1 | head -1)
echo "✅ 编译器: $JAVA_VER"
# 收集所有 Java 文件
JAVA_FILES=$(find server -name "*.java" 2>/dev/null | tr '\n' ' ')
if [ -z "$JAVA_FILES" ]; then
  echo "⚠️  未找到 Java 源文件"
  exit 0
fi
# 检查 sqlite-jdbc
if [ -f "lib/sqlite-jdbc.jar" ]; then
  CP=".:lib/sqlite-jdbc.jar"
  echo "✅ 找到 sqlite-jdbc.jar"
else
  CP="."
  echo "⚠️  未找到 lib/sqlite-jdbc.jar (运行时需下载)"
fi
echo ""
echo "📦 编译中..."
$JAVAC -encoding UTF-8 -cp "$CP" -d . $JAVA_FILES 2>&1
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 编译成功！"
  echo ""
  echo "启动方式:"
  echo "  java -cp \"$CP\" Application [port]"
  echo ""
  echo "测试:"
  echo "  curl http://localhost:8080/api/health"
  echo "  curl http://localhost:8080/api/courses | head"
else
  echo ""
  echo "❌ 编译失败，请检查上方错误信息"
  exit 1
fi
