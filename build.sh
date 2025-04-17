#!/bin/bash

# Clean dist directory if it exists
if [ -d "dist" ]; then
    echo "Cleaning dist directory..."
    rm -rf dist
fi

# Create dist directory
echo "Creating dist directory..."
mkdir -p dist

# Copy necessary files
echo "Copying files..."
cp app.js dist/
cp package.json dist/
cp -r public dist/
cp -r routes dist/
cp -r services dist/
cp -r scripts dist/

# Install production dependencies
echo "Installing production dependencies..."
cd dist
npm install --production

echo "Build completed successfully!" 