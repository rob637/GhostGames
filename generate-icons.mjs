import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ghost icon SVG with proper rendering (no emoji, direct draw)
const createGhostSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#e8e8e8"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <g transform="translate(${size * 0.19},${size * 0.14}) scale(${size / 100 * 0.62})">
    <path d="M50 10 C25 10 15 35 15 55 L15 85 L25 75 L35 85 L50 75 L65 85 L75 75 L85 85 L85 55 C85 35 75 10 50 10 Z" fill="url(#ghostGrad)"/>
    <ellipse cx="38" cy="45" rx="8" ry="10" fill="#1a1a2e"/>
    <ellipse cx="62" cy="45" rx="8" ry="10" fill="#1a1a2e"/>
    <ellipse cx="30" cy="55" rx="6" ry="3" fill="#ffcccc" opacity="0.5"/>
    <ellipse cx="70" cy="55" rx="6" ry="3" fill="#ffcccc" opacity="0.5"/>
  </g>
</svg>`;

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  
  // Generate 192x192
  const svg192 = Buffer.from(createGhostSvg(192));
  await sharp(svg192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Created icon-192.png');
  
  // Generate 512x512
  const svg512 = Buffer.from(createGhostSvg(512));
  await sharp(svg512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Created icon-512.png');
  
  // Generate 180x180 for apple-touch-icon
  const svg180 = Buffer.from(createGhostSvg(180));
  await sharp(svg180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');
  
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
