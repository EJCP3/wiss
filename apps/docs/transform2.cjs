const fs = require('fs');
const pathIndex = 'c:/Users/euddy/Desktop/Pagina web/wiss/apps/docs/src/pages/index.astro';
let content = fs.readFileSync(pathIndex, 'utf8');

// 1. Remove the hint text from all previews
content = content.replace(/<span class="text-xs text-zinc-400">💡 Edita el código en la pestaña "Code" y pruébalo aquí<\/span>/g, '');

// 2. Add the hint text below the first preview block (toast-simple)
content = content.replace(
  /<PreviewBlock id="toast-simple"[\s\S]*?<\/PreviewBlock>/,
  (match) => match + '\n        <p class="text-sm text-zinc-500 mt-4 text-center">💡 Puedes editar el código de cualquier ejemplo en su pestaña "Code" y ejecutarlo en vivo.</p>'
);

// 3. Update toast-icon preview slot to have visual buttons instead of text code
content = content.replace(
  /<PreviewBlock id="toast-icon"[\s\S]*?<div slot="preview"[^>]*>[\s\S]*?<\/div>\s*<\/PreviewBlock>/,
  (match) => {
    return match.replace(/<div slot="preview"[^>]*>[\s\S]*?<\/div>/, `<div slot="preview" class="flex flex-col items-center gap-4 w-full">
            <button class="run-code-btn px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black hover:scale-105 rounded-xl text-sm font-medium transition-all shadow-lg">▶ Ejecutar Código</button>
            <div class="text-sm text-zinc-500 flex flex-col gap-2 items-center justify-center">
               <span>O elige un icono para probar:</span>
               <div class="flex gap-2">
                 <button class="icon-option p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xl" data-icon="💡">💡</button>
                 <button class="icon-option p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xl" data-icon="🔥">🔥</button>
                 <button class="icon-option p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xl" data-icon="✨">✨</button>
                 <button class="icon-option p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300" data-icon='<svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'>
                   <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                 </button>
                 <button class="icon-option p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-green-500" data-icon='<svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'>
                   <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
               </div>
            </div>
          </div>`);
  }
);

// 4. Add script logic for .icon-option
content = content.replace(
  /document\.querySelectorAll\('\.run-code-btn'\)\.forEach\(btn => \{/,
  `document.querySelectorAll('.icon-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const block = e.currentTarget.closest('.preview-block');
        if (!block) return;
        const codeEl = block.querySelector('[data-code-editor]');
        if (!codeEl) return;
        
        const newIcon = e.currentTarget.getAttribute('data-icon');
        let text = codeEl.textContent || '';
        text = text.replace(/icon:\\s*['"\`][\\s\\S]*?['"\`]/, \`icon: '\${newIcon}'\`);
        codeEl.textContent = text;
        
        block.querySelector('.run-code-btn')?.click();
      });
    });\n\n    document.querySelectorAll('.run-code-btn').forEach(btn => {`
);

fs.writeFileSync(pathIndex, content);

// 5. Update PreviewBlock.astro to add Run button in Code tab
const pathPreview = 'c:/Users/euddy/Desktop/Pagina web/wiss/apps/docs/src/components/PreviewBlock.astro';
let previewContent = fs.readFileSync(pathPreview, 'utf8');

previewContent = previewContent.replace(
  /<button class="absolute top-4 right-4[^>]*>[\s\S]*?<\/button>/,
  (match) => match + '\n    <button class="run-code-btn absolute bottom-4 right-4 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg px-4 py-2 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 text-xs font-semibold uppercase tracking-wider" aria-label="Ejecutar código">▶ Run</button>'
);

fs.writeFileSync(pathPreview, previewContent);
console.log('Successfully updated index.astro and PreviewBlock.astro');
