const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// For root path, serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoint to execute tcping
app.post('/api/ping', (req, res) => {
    const {
        hostname,
        port,
        count,
        interval,
        ipVersion,
        timeoutSec,
        timeoutUsec,
        floodConnect,
        quietMode
    } = req.body;

    // Validate input
    if (!hostname || !port) {
        return res.status(400).json({ error: 'Hostname and port are required' });
    }

    // Build command with proper escaping to prevent command injection
    let command = path.join(__dirname, '../tcping');

    // Add port parameter
    command += ` -p ${parseInt(port)}`;

    // Add count parameter if provided
    if (count && !isNaN(count)) {
        const pingCount = Math.min(Math.max(1, parseInt(count)), 100);
        command += ` -c ${pingCount}`;
    }

    // Add interval parameter if provided
    if (interval && !isNaN(interval)) {
        const pingInterval = Math.min(Math.max(0, parseInt(interval)), 60);
        command += ` -i ${pingInterval}`;
    }

    // Add IP version parameter if provided
    if (ipVersion && (ipVersion === '4' || ipVersion === '6')) {
        command += ` -v ${ipVersion}`;
    }

    // Add timeout parameters if provided
    if (timeoutSec && !isNaN(timeoutSec)) {
        const timeout = Math.min(Math.max(0, parseInt(timeoutSec)), 60);
        command += ` -t ${timeout}`;
    }

    if (timeoutUsec && !isNaN(timeoutUsec)) {
        const timeout = Math.min(Math.max(0, parseInt(timeoutUsec)), 999999);
        command += ` -u ${timeout}`;
    }

    // Add flood connect flag if enabled
    if (floodConnect === true) {
        command += ' -f';
    }

    // Add quiet mode flag if enabled
    if (quietMode === true) {
        command += ' -q';
    }

    // Add hostname at the end
    command += ` ${hostname}`;

    console.log(`Executing command: ${command}`);

    // Execute command
    exec(command, (error, stdout, stderr) => {
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }

        // Parse output
        const results = parseOutput(stdout);
        results.command = command; // Include the command for debugging
        res.json(results);
    });
});

// Parse tcping output
function parseOutput(output) {
    const lines = output.split('\n');
    const results = {
        responses: [],
        summary: {}
    };

    // Parse each line
    lines.forEach(line => {
        // Match response line
        const responseMatch = line.match(/response from (.*):(\d+), seq=(\d+) time=([\d.]+) ms/);
        if (responseMatch) {
            results.responses.push({
                host: responseMatch[1],
                port: responseMatch[2],
                sequence: parseInt(responseMatch[3]),
                time: parseFloat(responseMatch[4]),
                success: true
            });
        }

        // Match summary line
        const summaryMatch = line.match(/(\d+) responses, (\d+) ok, ([\d.]+)% failed/);
        if (summaryMatch) {
            results.summary.total = parseInt(summaryMatch[1]);
            results.summary.success = parseInt(summaryMatch[2]);
            results.summary.failureRate = parseFloat(summaryMatch[3]);
        }

        // Match round-trip line
        const rtMatch = line.match(/round-trip min\/avg\/max = ([\d.]+)\/([\d.]+)\/([\d.]+) ms/);
        if (rtMatch) {
            results.summary.min = parseFloat(rtMatch[1]);
            results.summary.avg = parseFloat(rtMatch[2]);
            results.summary.max = parseFloat(rtMatch[3]);
        }
    });

    return results;
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to use the TCPing visualization tool`);
});
