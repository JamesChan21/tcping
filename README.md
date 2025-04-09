<div align="center">

# 🌐 TCPing Visual

*A beautiful web interface for TCP connectivity testing*

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Node.js](https://img.shields.io/badge/Node.js-14.x-green.svg)](https://nodejs.org/)
[![Language: JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[English](#english) | [中文](#chinese)

<img src="https://user-images.githubusercontent.com/583231/89642856-d9dd0b00-d8d2-11ea-9857-1d2dbfc8c85d.png" alt="TCPing Visualization Screenshot" width="600"/>

</div>

---

<a id="english"></a>

## 🇺🇸 English

TCPing Visual is a modern web interface for the TCPing utility, allowing you to test TCP connectivity to any host and port with a beautiful, interactive visualization.

### ✨ Features

- **Interactive Visualization**: Real-time charts showing ping response times
- **Comprehensive Parameter Support**: Access all TCPing command line options through a user-friendly interface
- **Bilingual Interface**: Switch between English and Chinese with one click
- **Detailed Tooltips**: Hover over parameters to see explanations
- **Real-time Logs**: View detailed logs of each ping attempt
- **Summary Statistics**: See min/avg/max response times and success rates

### 🚀 Quick Start

#### Prerequisites

- Node.js (v12 or higher)
- npm (comes with Node.js)
- TCPing utility compiled in the project directory

#### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/JamesChan21/tcping-visual.git
   cd tcping-visual
   ```

2. Compile the TCPing utility:
   ```bash
   make
   ```

3. Install the required Node.js dependencies:
   ```bash
   npm install
   ```

#### Usage

1. Start the server:
   ```bash
   ./start-demo.sh
   ```
   or
   ```bash
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Enter a hostname/IP address and adjust the parameters as needed

4. Hover over the "?" icons to see explanations for each parameter

5. Click "Start TCPing" to begin the test

6. To switch language, click the language button in the top-right corner

### 💻 Command Line Usage

TCPing Visual is built on top of the TCPing command line utility. You can also use TCPing directly from the command line:

```bash
# Basic usage (ping port 80)
./tcping hostname

# Specify a different port
./tcping -p 443 hostname

# Ping once
./tcping -p 443 -c 1 hostname

# Ping 5 times with 2 second interval
./tcping -p 443 -c 5 -i 2 hostname

# Use IPv6
./tcping -p 443 -v 6 hostname

# Set timeout (2 seconds)
./tcping -p 443 -t 2 hostname

# Set timeout with microseconds
./tcping -p 443 -t 1 -u 500000 hostname

# Flood connect (no delays)
./tcping -p 443 -f hostname

# Quiet mode (only return code)
./tcping -p 443 -q hostname
```

#### Return Codes

TCPing returns the following exit codes:

- `0`: Success - connection established
- `2`: Host or service could not be resolved
- `127`: Other errors

### 🔍 How It Works

1. The web interface sends a request to the Node.js server
2. The server executes the TCPing command with the provided parameters
3. The results are parsed and sent back to the web interface
4. The web interface displays the results in a chart and log

### 🧪 Simulated Mode

By default, the web interface runs in simulated mode, which doesn't require the server to be running. This is useful for demonstration purposes. To use the actual TCPing utility, uncomment the relevant code in script.js.

### 📜 License

This project is licensed under the GNU General Public License v2.0 - see the LICENSE file for details.

---

<a id="chinese"></a>

## 🇨🇳 中文

TCPing Visual 是 TCPing 实用程序的现代 Web 界面，允许您通过美观、交互式的可视化界面测试到任何主机和端口的 TCP 连接。

### ✨ 功能特点

- **交互式可视化**：实时图表显示 ping 响应时间
- **全面的参数支持**：通过用户友好的界面访问所有 TCPing 命令行选项
- **双语界面**：一键切换英文和中文
- **详细工具提示**：悬停在参数上可查看解释
- **实时日志**：查看每次 ping 尝试的详细日志
- **统计摘要**：查看最小/平均/最大响应时间和成功率

### 🚀 快速开始

#### 前提条件

- Node.js（v12 或更高版本）
- npm（随 Node.js 一起提供）
- 在项目目录中编译的 TCPing 实用程序

#### 安装

1. 克隆此仓库：
   ```bash
   git clone https://github.com/JamesChan21/tcping-visual.git
   cd tcping-visual
   ```

2. 编译 TCPing 实用程序：
   ```bash
   make
   ```

3. 安装所需的 Node.js 依赖项：
   ```bash
   npm install
   ```

#### 使用方法

1. 启动服务器：
   ```bash
   ./start-demo.sh
   ```
   或
   ```bash
   node server.js
   ```

2. 打开浏览器并导航至：
   ```
   http://localhost:3000
   ```

3. 输入主机名/IP 地址并根据需要调整参数

4. 将鼠标悬停在 "?" 图标上，查看每个参数的解释

5. 点击 "开始 TCPing" 开始测试

6. 要切换语言，请点击右上角的语言按钮

### 💻 命令行使用方法

TCPing Visual 是基于 TCPing 命令行工具构建的。您也可以直接从命令行使用 TCPing：

```bash
# 基本用法（ping 80端口）
./tcping 主机名

# 指定不同的端口
./tcping -p 443 主机名

# 只 ping 一次
./tcping -p 443 -c 1 主机名

# ping 5次，间隔为2秒
./tcping -p 443 -c 5 -i 2 主机名

# 使用IPv6
./tcping -p 443 -v 6 主机名

# 设置超时（2秒）
./tcping -p 443 -t 2 主机名

# 设置带微秒的超时
./tcping -p 443 -t 1 -u 500000 主机名

# 洪水连接（无延迟）
./tcping -p 443 -f 主机名

# 安静模式（只返回代码）
./tcping -p 443 -q 主机名
```

#### 返回代码

TCPing 返回以下退出代码：

- `0`：成功 - 连接已建立
- `2`：无法解析主机或服务
- `127`：其他错误

### 🔍 工作原理

1. Web 界面向 Node.js 服务器发送请求
2. 服务器使用提供的参数执行 TCPing 命令
3. 解析结果并发送回 Web 界面
4. Web 界面在图表和日志中显示结果

### 🧪 模拟模式

默认情况下，Web 界面在模拟模式下运行，这不需要服务器运行。这对于演示目的很有用。要使用实际的 TCPing 实用程序，请取消注释 script.js 中的相关代码。

### 📜 许可证

本项目根据 GNU 通用公共许可证 v2.0 授权 - 有关详细信息，请参阅 LICENSE 文件。
