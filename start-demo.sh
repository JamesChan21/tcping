#!/bin/bash

# Check if tcping is compiled
if [ ! -f "./tcping" ]; then
    echo "TCPing executable not found. Compiling..."
    make
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run the demo."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server
echo "Starting TCPing Visual server..."
node src/server.js
