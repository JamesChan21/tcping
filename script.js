document.addEventListener('DOMContentLoaded', () => {
    // Current language (default: English)
    let currentLanguage = 'en';

    // Language switch button
    const languageSwitch = document.getElementById('language-switch');
    // DOM elements
    const hostnameInput = document.getElementById('hostname');
    const portInput = document.getElementById('port');
    const countInput = document.getElementById('count');
    const intervalInput = document.getElementById('interval');
    const ipVersionSelect = document.getElementById('ip-version');
    const timeoutSecInput = document.getElementById('timeout-sec');
    const timeoutUsecInput = document.getElementById('timeout-usec');
    const floodConnectCheckbox = document.getElementById('flood-connect');
    const quietModeCheckbox = document.getElementById('quiet-mode');
    const startButton = document.getElementById('start-ping');
    const stopButton = document.getElementById('stop-ping');
    const statusText = document.getElementById('status-text');
    const pingLog = document.getElementById('ping-log');
    const summaryElement = document.getElementById('summary');

    // Ping state
    let isPinging = false;
    let shouldStop = false;

    // Chart setup
    const ctx = document.getElementById('ping-chart').getContext('2d');
    let pingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Response Time (ms)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 4,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Response Time (ms)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ping Sequence'
                    }
                }
            }
        }
    });

    // Simulated ping function (in a real implementation, this would call the server)
    async function simulatePing(params) {
        resetUI();
        isPinging = true;
        shouldStop = false;
        statusText.textContent = languages[currentLanguage].pinging;
        startButton.disabled = true;
        stopButton.disabled = false;

        let successCount = 0;
        let totalTime = 0;
        let minTime = Infinity;
        let maxTime = 0;
        let i = 0;

        // Determine delay between pings
        const delay = params.floodConnect ? 0 : (params.interval * 1000);

        while ((i < params.count || params.count === -1) && !shouldStop) {
            // Simulate network delay
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // Small delay even in flood mode to allow UI updates
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            // Simulate success/failure (90% success rate)
            const success = Math.random() < 0.9;

            if (success) {
                // Simulate response time between 10-200ms
                // In a real implementation, this would be the actual response time
                const responseTime = Math.floor(Math.random() * 190) + 10;
                successCount++;
                totalTime += responseTime;
                minTime = Math.min(minTime, responseTime);
                maxTime = Math.max(maxTime, responseTime);

                // Update chart
                pingChart.data.labels.push(i + 1);
                pingChart.data.datasets[0].data.push(responseTime);
                pingChart.update();

                // Add log entry
                if (!params.quietMode) {
                    const text = languages[currentLanguage];
                    addLogEntry(`${text.sequence} ${i + 1}: ${text.response} ${params.hostname}:${params.port} ${text.time}=${responseTime} ms`, true);
                }
            } else {
                // Add error log entry
                if (!params.quietMode) {
                    const text = languages[currentLanguage];
                    addLogEntry(`${text.sequence} ${i + 1}: ${text.error} ${params.hostname}:${params.port}`, false);
                }

                // Add null point to chart to show gap
                pingChart.data.labels.push(i + 1);
                pingChart.data.datasets[0].data.push(null);
                pingChart.update();
            }

            i++;
        }

        // Update status and summary
        const text = languages[currentLanguage];
        statusText.textContent = shouldStop ? text.stopped : text.complete;
        if (successCount > 0) {
            const avgTime = (totalTime / successCount).toFixed(2);
            summaryElement.textContent = `${i} ${text.requests}, ${successCount} ${text.successful} (${((successCount/i)*100).toFixed(1)}%), ${text.minAvgMax} = ${minTime}/${avgTime}/${maxTime} ms`;
        } else {
            summaryElement.textContent = `${i} ${text.requests}, 0 ${text.successful} (0%), ${text.noSuccessful}`;
        }

        // Reset UI state
        isPinging = false;
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    // Add log entry
    function addLogEntry(message, success) {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        entry.classList.add(success ? 'log-success' : 'log-error');
        entry.textContent = message;
        pingLog.appendChild(entry);

        // Auto-scroll to bottom
        pingLog.scrollTop = pingLog.scrollHeight;
    }

    // Reset UI for new ping
    function resetUI() {
        // Clear log
        pingLog.innerHTML = '';

        // Reset chart
        pingChart.data.labels = [];
        pingChart.data.datasets[0].data = [];
        pingChart.update();

        // Reset status and summary
        statusText.textContent = languages[currentLanguage].pinging;
        summaryElement.textContent = '';
    }

    // Event listener for start button
    startButton.addEventListener('click', () => {
        if (isPinging) return;

        // Get all parameters from the form
        const hostname = hostnameInput.value.trim();
        const port = parseInt(portInput.value);
        const count = parseInt(countInput.value);
        const interval = parseInt(intervalInput.value);
        const ipVersion = ipVersionSelect.value;
        const timeoutSec = parseInt(timeoutSecInput.value);
        const timeoutUsec = parseInt(timeoutUsecInput.value);
        const floodConnect = floodConnectCheckbox.checked;
        const quietMode = quietModeCheckbox.checked;

        // Validate required fields
        const text = languages[currentLanguage];

        if (!hostname) {
            alert(text.enterHostname);
            return;
        }

        if (isNaN(port) || port < 1 || port > 65535) {
            alert(text.validPort);
            return;
        }

        if (isNaN(count) || count < 1 || count > 100) {
            alert(text.validCount);
            return;
        }

        if (isNaN(interval) || interval < 0 || interval > 60) {
            alert(text.validInterval);
            return;
        }

        if (isNaN(timeoutSec) || timeoutSec < 0 || timeoutSec > 60) {
            alert(text.validTimeoutSec);
            return;
        }

        if (isNaN(timeoutUsec) || timeoutUsec < 0 || timeoutUsec > 999999) {
            alert(text.validTimeoutUsec);
            return;
        }

        // Create parameters object
        const params = {
            hostname,
            port,
            count,
            interval,
            ipVersion,
            timeoutSec,
            timeoutUsec,
            floodConnect,
            quietMode
        };

        // Start pinging
        simulatePing(params);
    });

    // Event listener for stop button
    stopButton.addEventListener('click', () => {
        if (isPinging) {
            shouldStop = true;
            statusText.textContent = languages[currentLanguage].stopping;
        }
    });

    // Function to update UI text based on selected language
    function updateLanguage(lang) {
        currentLanguage = lang;
        const text = languages[lang];

        // Update page title and description
        document.getElementById('title').textContent = text.title;
        document.getElementById('description').textContent = text.description;

        // Update form labels
        document.getElementById('label-hostname').textContent = text.hostname;
        document.getElementById('label-port').textContent = text.port;
        document.getElementById('label-count').textContent = text.count;
        document.getElementById('label-interval').textContent = text.interval;
        document.getElementById('label-ipVersion').textContent = text.ipVersion;
        document.getElementById('label-timeoutSec').textContent = text.timeoutSec;
        document.getElementById('label-timeoutUsec').textContent = text.timeoutUsec;
        document.getElementById('label-floodConnect').textContent = text.floodConnect;
        document.getElementById('label-quietMode').textContent = text.quietMode;

        // Update tooltips
        document.getElementById('tooltip-hostname').textContent = text.tooltips.hostname;
        document.getElementById('tooltip-port').textContent = text.tooltips.port;
        document.getElementById('tooltip-count').textContent = text.tooltips.count;
        document.getElementById('tooltip-interval').textContent = text.tooltips.interval;
        document.getElementById('tooltip-ipVersion').textContent = text.tooltips.ipVersion;
        document.getElementById('tooltip-timeoutSec').textContent = text.tooltips.timeoutSec;
        document.getElementById('tooltip-timeoutUsec').textContent = text.tooltips.timeoutUsec;
        document.getElementById('tooltip-floodConnect').textContent = text.tooltips.floodConnect;
        document.getElementById('tooltip-quietMode').textContent = text.tooltips.quietMode;

        // Update buttons
        document.getElementById('btn-startPing').textContent = text.startPing;
        document.getElementById('btn-stopPing').textContent = text.stopPing;

        // Update status and log section
        document.getElementById('label-status').textContent = text.status;
        document.getElementById('label-pingLog').textContent = text.pingLog;

        // Update status text if it's one of the standard statuses
        const statusText = document.getElementById('status-text');
        if (statusText.textContent === 'Ready' || statusText.textContent === '就绪') {
            statusText.textContent = text.ready;
        } else if (statusText.textContent === 'Pinging...' || statusText.textContent === 'Ping中...') {
            statusText.textContent = text.pinging;
        } else if (statusText.textContent === 'Complete' || statusText.textContent === '完成') {
            statusText.textContent = text.complete;
        } else if (statusText.textContent === 'Stopped' || statusText.textContent === '已停止') {
            statusText.textContent = text.stopped;
        } else if (statusText.textContent === 'Stopping...' || statusText.textContent === '正在停止...') {
            statusText.textContent = text.stopping;
        }

        // Update language switch button
        languageSwitch.textContent = text.switchLanguage;
    }

    // Language switch event listener
    languageSwitch.addEventListener('click', () => {
        const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
        updateLanguage(newLanguage);
    });

    // Initialize with example values and default language
    hostnameInput.value = 'example.com';
    updateLanguage('en');
});

// In a real implementation, this function would call the backend
async function realPing(params) {
    try {
        const response = await fetch('/api/ping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { error: error.message };
    }
}
