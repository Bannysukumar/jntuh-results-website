const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../public/jntuhresults_black.png');
const outputDir = path.join(__dirname, '../public');

// Sizes needed for different purposes
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

// Medium-sized logos for navbar (optimized for navbar height: 64px max, maintaining aspect ratio)
// Using 130x60 to fit better in navbar (h-16 = 64px)
const mediumLogos = [
  { width: 130, height: 60, name: 'jntuhresults_md.png', background: { r: 255, g: 255, b: 255, alpha: 1 } }, // White background for light mode
  { width: 130, height: 60, name: 'jntuhresults_md_black.png', background: { r: 0, g: 0, b: 0, alpha: 1 } }, // Black background for dark mode
];

async function generateLogos() {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file not found: ${inputFile}`);
      process.exit(1);
    }

    console.log('Generating logo sizes from:', inputFile);
    console.log('Output directory:', outputDir);
    console.log('');

    // Generate square sizes
    for (const { size, name } of sizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    // Generate medium-sized logos for navbar
    for (const { width, height, name, background } of mediumLogos) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(inputFile)
        .resize(width, height, {
          fit: 'contain',
          background: background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${width}x${height})`);
    }

    console.log('');
    console.log('✅ All logo sizes generated successfully!');
  } catch (error) {
    console.error('Error generating logos:', error);
    process.exit(1);
  }
}

generateLogos();

