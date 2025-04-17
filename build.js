const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Create dist/public directory
const publicDir = path.join(distDir, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy files
function copyFiles(source, destination) {
    if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isDirectory()) {
            // Create directory if it doesn't exist
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }
            
            // Copy all files in the directory
            const files = fs.readdirSync(source);
            files.forEach(file => {
                const srcPath = path.join(source, file);
                const destPath = path.join(destination, file);
                copyFiles(srcPath, destPath);
            });
        } else {
            // Copy file
            fs.copyFileSync(source, destination);
            console.log(`Copied: ${source} -> ${destination}`);
        }
    }
}

// Copy necessary files and directories
const filesToCopy = [
    { source: 'app.js', destination: 'dist/app.js' },
    { source: 'index.js', destination: 'dist/index.js' },
    { source: 'public', destination: 'dist/public' },
    { source: 'routes', destination: 'dist/routes' },
    { source: 'services', destination: 'dist/services' },
    { source: 'scripts', destination: 'dist/scripts' },
    { source: 'nse', destination: 'dist/nse' },
    { source: 'bse', destination: 'dist/bse' },
    { source: 'utils', destination: 'dist/utils' },
    { source: 'config', destination: 'dist/config' },
    { source: 'data', destination: 'dist/data' },
    { source: 'package.json', destination: 'dist/package.json' }
];

filesToCopy.forEach(({ source, destination }) => {
    copyFiles(path.join(__dirname, source), path.join(__dirname, destination));
});

console.log('Build completed successfully!');

// Install production dependencies
try {
    console.log('Installing production dependencies...');
    process.chdir(distDir);
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('Build completed successfully!');
} catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
} 