const fs = require('fs');
const path = require('path');

/** PNG’yi geçerli .ico içine gömer (Google /favicon.ico için). */
function pngToIco(pngPath, icoPath) {
  const png = fs.readFileSync(pngPath);
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(width >= 256 ? 0 : width, 6);
  header.writeUInt8(height >= 256 ? 0 : height, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  fs.writeFileSync(icoPath, Buffer.concat([header, png]));
}

const root = path.join(__dirname, '..');
const png48 = path.join(root, 'public', 'favicon-48.png');
pngToIco(png48, path.join(root, 'public', 'favicon.ico'));
pngToIco(png48, path.join(root, 'app', 'favicon.ico'));
console.log('favicon.ico yazildi');
