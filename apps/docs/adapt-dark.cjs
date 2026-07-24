const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/euddy/Desktop/Pagina web/wiss/apps/docs/src';

// 1. Update CodeBlock.astro
const codeBlockPath = path.join(baseDir, 'components', 'CodeBlock.astro');
let codeBlock = fs.readFileSync(codeBlockPath, 'utf8');

// Update container background and border
codeBlock = codeBlock.replace(/bg-\[#f2f5f9\]/, 'bg-[#f2f5f9] dark:bg-[#1a1a1e]');
codeBlock = codeBlock.replace(/border-\[#e2e8f0\]/, 'border-[#e2e8f0] dark:border-zinc-800');
// Update copy button
codeBlock = codeBlock.replace(/bg-white\/80 hover:bg-white text-zinc-400 hover:text-zinc-700/, 'bg-white/80 hover:bg-white dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200');
codeBlock = codeBlock.replace(/border-zinc-200\/50/, 'border-zinc-200/50 dark:border-zinc-700');

// Dual Code blocks for dark/light themes
codeBlock = codeBlock.replace(
  /<Code code={code\.trim\(\)} lang={lang} theme="vitesse-light" class="!bg-transparent" \/>/,
  `<div class="dark:hidden"><Code code={code.trim()} lang={lang} theme="vitesse-light" class="!bg-transparent" /></div>\n    <div class="hidden dark:block"><Code code={code.trim()} lang={lang} theme="vitesse-dark" class="!bg-transparent" /></div>`
);
fs.writeFileSync(codeBlockPath, codeBlock);


// 2. Update PreviewBlock.astro
const previewBlockPath = path.join(baseDir, 'components', 'PreviewBlock.astro');
let previewBlock = fs.readFileSync(previewBlockPath, 'utf8');

// Container
previewBlock = previewBlock.replace(/bg-white/, 'bg-white dark:bg-[#121214]');
previewBlock = previewBlock.replace(/border-zinc-200\/80/, 'border-zinc-200/80 dark:border-zinc-800');
// Tabs header
previewBlock = previewBlock.replace(/border-zinc-100/, 'border-zinc-100 dark:border-zinc-800');
// Tab text
previewBlock = previewBlock.replace(/text-zinc-900 border-black/, 'text-zinc-900 dark:text-zinc-100 border-black dark:border-white');
previewBlock = previewBlock.replace(/text-zinc-400 hover:text-zinc-600 border-transparent/g, 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 border-transparent');
// Preview content area
previewBlock = previewBlock.replace(/bg-white/, 'bg-white dark:bg-[#121214]'); // Note: multiple bg-white might exist, using g flag or being specific
// Code tab area
previewBlock = previewBlock.replace(/bg-\[#f2f5f9\]/, 'bg-[#f2f5f9] dark:bg-[#1a1a1e]');
// Copy button
previewBlock = previewBlock.replace(/bg-white\/80 hover:bg-white text-zinc-400 hover:text-zinc-700/, 'bg-white/80 hover:bg-white dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200');
previewBlock = previewBlock.replace(/border-zinc-200\/50/, 'border-zinc-200/50 dark:border-zinc-700');

// Dual Code blocks
previewBlock = previewBlock.replace(
  /<Code code={code\.trim\(\)} lang={lang} theme="vitesse-light" class="!bg-transparent" \/>/,
  `<div class="dark:hidden"><Code code={code.trim()} lang={lang} theme="vitesse-light" class="!bg-transparent" /></div>\n      <div class="hidden dark:block"><Code code={code.trim()} lang={lang} theme="vitesse-dark" class="!bg-transparent" /></div>`
);

// We need to update the tab click logic to toggle dark mode classes correctly!
// Currently it does: b.classList.remove('text-zinc-900', 'border-black');
// It needs to remove dark:text-zinc-100, dark:border-white
previewBlock = previewBlock.replace(
  /b\.classList\.remove\('text-zinc-900', 'border-black'\);/g,
  `b.classList.remove('text-zinc-900', 'border-black', 'dark:text-zinc-100', 'dark:border-white');`
);
previewBlock = previewBlock.replace(
  /b\.classList\.add\('text-zinc-400', 'border-transparent'\);/g,
  `b.classList.add('text-zinc-400', 'border-transparent', 'dark:text-zinc-500');`
);
previewBlock = previewBlock.replace(
  /btn\.classList\.remove\('text-zinc-400', 'border-transparent'\);/g,
  `btn.classList.remove('text-zinc-400', 'border-transparent', 'dark:text-zinc-500');`
);
previewBlock = previewBlock.replace(
  /btn\.classList\.add\('text-zinc-900', 'border-black'\);/g,
  `btn.classList.add('text-zinc-900', 'border-black', 'dark:text-zinc-100', 'dark:border-white');`
);

fs.writeFileSync(previewBlockPath, previewBlock);


// 3. Update index.astro
const indexPath = path.join(baseDir, 'pages', 'index.astro');
let index = fs.readFileSync(indexPath, 'utf8');

// Replace general typography classes
index = index.replace(/text-zinc-900/g, 'text-zinc-900 dark:text-zinc-100');
index = index.replace(/text-zinc-600/g, 'text-zinc-600 dark:text-zinc-400');
index = index.replace(/bg-zinc-50/g, 'bg-zinc-50 dark:bg-zinc-800/50');
// Some buttons like run-code-btn might need adjustment if they had hardcoded dark styles (they already do: dark:bg-white dark:text-black)

fs.writeFileSync(indexPath, index);

console.log('Successfully adapted all components for Dark Mode!');
