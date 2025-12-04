const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const outputDir = 'build';
const zipFileName = 'duet-plus-extension.zip';

const filesToInclude = [
  'manifest.json',
  'dist/',
  'icon/'
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const zipPath = path.join(outputDir, zipFileName);

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } 
});

output.on('close', function() {
  console.log(`zip file created: ${zipPath}`);
  console.log(`file size: ${archive.pointer()} bytes`);
});

archive.on('error', function(err) {
  console.error('error: ', err);
  throw err;
});

archive.pipe(output);

filesToInclude.forEach(item => {
  const itemPath = path.resolve(item);
  
  if (fs.existsSync(itemPath)) {
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      console.log(`added: ${item}`);
      archive.directory(item, item);
    } else {
      console.log(`added: ${item}`);
      archive.file(item, { name: item });
    }
  } else {
    console.warn(`not found: ${item}`);
  }
});

archive.finalize();
