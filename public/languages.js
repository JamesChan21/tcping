// Language data for the TCPing Visual
const languages = {
    en: {
        // Page title and description
        title: "TCPing Visual",
        description: "Test TCP connectivity to a host on a specific port and visualize the results.",

        // Form labels
        hostname: "Hostname/IP:",
        port: "Port (-p):",
        count: "Number of pings (-c):",
        interval: "Interval in seconds (-i):",
        ipVersion: "IP Version (-v):",
        timeoutSec: "Timeout in seconds (-t):",
        timeoutUsec: "Timeout in microseconds (-u):",
        floodConnect: "Flood connect (-f) (no delays)",
        quietMode: "Quiet mode (-q) (only return code)",

        // Buttons
        startPing: "Start TCPing",
        stopPing: "Stop",

        // Status and results
        status: "Status:",
        ready: "Ready",
        pinging: "Pinging...",
        complete: "Complete",
        stopped: "Stopped",
        stopping: "Stopping...",

        // Log section
        pingLog: "Ping Log",
        sequence: "Sequence",
        response: "Response from",
        time: "time",
        error: "Error connecting to",

        // Summary
        requests: "requests",
        successful: "successful",
        minAvgMax: "min/avg/max",
        noSuccessful: "no successful responses",

        // Validation messages
        enterHostname: "Please enter a hostname or IP address",
        validPort: "Please enter a valid port number (1-65535)",
        validCount: "Please enter a valid count (1-100)",
        validInterval: "Please enter a valid interval (0-60 seconds)",
        validTimeoutSec: "Please enter a valid timeout in seconds (0-60)",
        validTimeoutUsec: "Please enter a valid timeout in microseconds (0-999999)",

        // Language switch
        switchLanguage: "切换到中文",

        // Tooltips
        tooltips: {
            hostname: "The hostname or IP address to ping (e.g., google.com or 192.168.1.1)",
            port: "The TCP port number to connect to (1-65535)",
            count: "How many times to connect. Use -1 for unlimited pings",
            interval: "Delay between each connect in seconds",
            ipVersion: "IP version to use (IPv4 or IPv6)",
            timeoutSec: "Timeout for server response in seconds",
            timeoutUsec: "Timeout for server response in microseconds",
            floodConnect: "Send pings as fast as possible without delays",
            quietMode: "Only show return code, no output"
        }
    },
    zh: {
        // 页面标题和描述
        title: "TCPing Visual",
        description: "测试到指定主机和端口的TCP连接并可视化结果。",

        // 表单标签
        hostname: "主机名/IP地址:",
        port: "端口 (-p):",
        count: "Ping次数 (-c):",
        interval: "间隔(秒) (-i):",
        ipVersion: "IP版本 (-v):",
        timeoutSec: "超时(秒) (-t):",
        timeoutUsec: "超时(微秒) (-u):",
        floodConnect: "洪水连接 (-f) (无延迟)",
        quietMode: "安静模式 (-q) (仅返回代码)",

        // 按钮
        startPing: "开始 TCPing",
        stopPing: "停止",

        // 状态和结果
        status: "状态:",
        ready: "就绪",
        pinging: "Ping中...",
        complete: "完成",
        stopped: "已停止",
        stopping: "正在停止...",

        // 日志部分
        pingLog: "Ping 日志",
        sequence: "序列",
        response: "来自",
        time: "时间",
        error: "连接错误",

        // 摘要
        requests: "请求",
        successful: "成功",
        minAvgMax: "最小/平均/最大",
        noSuccessful: "没有成功的响应",

        // 验证消息
        enterHostname: "请输入主机名或IP地址",
        validPort: "请输入有效的端口号 (1-65535)",
        validCount: "请输入有效的Ping次数 (1-100)",
        validInterval: "请输入有效的间隔时间 (0-60秒)",
        validTimeoutSec: "请输入有效的超时秒数 (0-60)",
        validTimeoutUsec: "请输入有效的超时微秒数 (0-999999)",

        // 语言切换
        switchLanguage: "Switch to English",

        // 工具提示
        tooltips: {
            hostname: "要ping的主机名或IP地址 (例如: google.com 或 192.168.1.1)",
            port: "要连接的TCP端口号 (1-65535)",
            count: "连接次数。使用-1表示无限ping",
            interval: "每次连接之间的延迟(秒)",
            ipVersion: "使用的IP版本 (IPv4或IPv6)",
            timeoutSec: "服务器响应超时时间(秒)",
            timeoutUsec: "服务器响应超时时间(微秒)",
            floodConnect: "尽可能快地发送ping，无延迟",
            quietMode: "只显示返回代码，无输出"
        }
    }
};
