#!/bin/bash

echo "🚀 Starting CareNavigator Prototype..."
echo ""
echo "This will take 2-3 minutes the first time."
echo ""

# Navigate to project directory
cd "/Users/andrew-mbp/Documents/claude projects/Care Navigator"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
    echo ""
fi

echo "✅ Starting development server..."
echo ""
echo "🌐 The prototype will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Start the dev server
npm run dev
