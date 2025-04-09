# TCPing Visualization Tool

This is a web-based visualization tool for the TCPing utility, which tests TCP connectivity to a host on a specific port.

## Features

- Test TCP connectivity to any host and port
- Visualize response times with an interactive chart
- View detailed logs of each ping attempt
- See summary statistics (min/avg/max response times, success rate)
- Support for all TCPing command line parameters
- Bilingual interface (English/Chinese) with language switching
- Tooltips with parameter explanations

## Prerequisites

- Node.js (v12 or higher)
- npm (comes with Node.js)
- TCPing utility compiled and available in the project directory

## Installation

1. Make sure you have compiled the TCPing utility:
   ```
   make
   ```

2. Install the required Node.js dependencies:
   ```
   npm install express
   ```

## Usage

1. Start the server:
   ```
   node server.js
   ```
   Or use the provided start script:
   ```
   ./start-demo.sh
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Enter a hostname/IP address and adjust the parameters as needed

4. Hover over the "?" icons to see explanations for each parameter

5. Click "Start TCPing" to begin the test

6. To switch language, click the language button in the top-right corner

## How It Works

1. The web interface sends a request to the Node.js server
2. The server executes the TCPing command with the provided parameters
3. The results are parsed and sent back to the web interface
4. The web interface displays the results in a chart and log

## Simulated Mode

By default, the web interface runs in simulated mode, which doesn't require the server to be running. This is useful for demonstration purposes. To use the actual TCPing utility, uncomment the relevant code in script.js.

## License

This project is licensed under the GNU General Public License v2.0 - see the LICENSE file for details.
