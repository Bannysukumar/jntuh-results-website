const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'app', 'api');
const apiBackupDir = path.join(__dirname, '..', 'app', '_api_backup');

try {
  console.log('Preparing for static export...');
  
  // Move API directory temporarily
  if (fs.existsSync(apiDir)) {
    console.log('Temporarily moving API routes...');
    if (fs.existsSync(apiBackupDir)) {
      fs.rmSync(apiBackupDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, apiBackupDir);
  }
  
  // Run the build
  console.log('Building static export...');
  process.env.NEXT_EXPORT = 'true';
  execSync('npm run build', { stdio: 'inherit' });
  
  // Restore API directory
  if (fs.existsSync(apiBackupDir)) {
    console.log('Restoring API routes...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiBackupDir, apiDir);
  }
  
  console.log('Static export build completed successfully!');
} catch (error) {
  // Always restore API directory on error
  if (fs.existsSync(apiBackupDir) && !fs.existsSync(apiDir)) {
    console.log('Restoring API routes after error...');
    fs.renameSync(apiBackupDir, apiDir);
  }
  console.error('Build failed:', error.message);
  process.exit(1);
}

