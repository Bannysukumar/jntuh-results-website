const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../public/icon-512x512.png');
const androidResDir = path.join(__dirname, '../android/app/src/main/res');

// Android mipmap sizes (in pixels)
const androidSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function generateAndroidIcons() {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file not found: ${inputFile}`);
      process.exit(1);
    }

    console.log('Generating Android app icons from:', inputFile);
    console.log('Output directory:', androidResDir);
    console.log('');

    // Generate icons for each density
    for (const [folder, size] of Object.entries(androidSizes)) {
      const folderPath = path.join(androidResDir, folder);
      
      // Ensure folder exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Generate ic_launcher.png
      const launcherPath = path.join(folderPath, 'ic_launcher.png');
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
        })
        .png()
        .toFile(launcherPath);
      console.log(`✓ Generated ${folder}/ic_launcher.png (${size}x${size})`);

      // Generate ic_launcher_round.png (same as regular for now)
      const launcherRoundPath = path.join(folderPath, 'ic_launcher_round.png');
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .png()
        .toFile(launcherRoundPath);
      console.log(`✓ Generated ${folder}/ic_launcher_round.png (${size}x${size})`);

      // Generate ic_launcher_foreground.png (for adaptive icons)
      // Use the full icon since it already has black background
      const foregroundPath = path.join(folderPath, 'ic_launcher_foreground.png');
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 } // Keep black background
        })
        .png()
        .toFile(foregroundPath);
      console.log(`✓ Generated ${folder}/ic_launcher_foreground.png (${size}x${size})`);
    }

    console.log('');
    console.log('✅ All Android app icons generated successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Rebuild the Android app in Android Studio');
    console.log('2. The new icons will be used automatically');
  } catch (error) {
    console.error('Error generating Android icons:', error);
    process.exit(1);
  }
}

generateAndroidIcons();

