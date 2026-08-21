#!/bin/bash
# TechHub Pro v6.0 — 编译脚本
echo "=========================================="
echo "  TechHub Pro v6.0 Beta — 编译脚本"
echo "  愿行无止之境 svcliny"
echo "=========================================="
echo ""

# 检查JDK
if ! command -v javac &> /dev/null; then
    echo "❌ 未找到 javac (JDK)"
    echo "   请安装 JDK 11+ 后重试"
    exit 1
fi

echo "✅ JDK: $(javac -version 2>&1)"
echo ""

# 下载SQLite JDBC（如果不存在）
if [ ! -f "lib/sqlite-jdbc.jar" ]; then
    echo "📦 下载 SQLite JDBC..."
    mkdir -p lib
    curl -L -o lib/sqlite-jdbc.jar "https://github.com/xerial/sqlite-jdbc/releases/download/3.43.2.2/sqlite-jdbc-3.43.2.2.jar" 2>/dev/null \
        || echo "⚠️ 无法下载 SQLite JDBC，将使用无DB模式"
fi

# 编译
echo ""
echo "🔨 编译 Java 文件..."
mkdir -p bin

CP="bin"
if [ -f "lib/sqlite-jdbc.jar" ]; then CP="bin:lib/sqlite-jdbc.jar"; fi

cd server
javac -d ../bin -cp "$CP" *.java 2>&1
RESULT=$?
cd ..

if [ $RESULT -eq 0 ]; then
    echo ""
    echo "✅ 编译成功！"
    echo ""
    echo "启动服务器："
    echo "  java -cp \"$CP\" Application"
    echo ""
    echo "或直接运行："
    echo "  ./run.sh"
else
    echo ""
    echo "❌ 编译失败，请检查错误信息"
    exit 1
fi
