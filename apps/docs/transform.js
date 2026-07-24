const fs = require('fs');
const path = 'c:/Users/euddy/Desktop/Pagina web/wiss/apps/docs/src/pages/index.astro';
let content = fs.readFileSync(path, 'utf8');

// Replace the toast-btn script logic
content = content.replace(
  /document\.querySelectorAll\('\.toast-btn'\)[\s\S]*?default: toast\.show\('Hello world'\);\n        \}\n      \}\);\n    \}\);/,
  `document.querySelectorAll('.run-code-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const block = (e.target).closest('.preview-block');
        if (!block) return;
        const codeEl = block.querySelector('[data-code-editor]');
        if (!codeEl) return;
        
        let rawCode = codeEl.textContent || '';
        rawCode = rawCode.replace(/import\\s+.*?;?\\n/g, '');
        
        try {
          new Function('toast', 'toaster', rawCode)(toast, toaster);
        } catch(err) {
          toast.error('Error de sintaxis en el código');
          console.error(err);
        }
      });
    });`
);

// Replace all slot="preview" inside PreviewBlocks
content = content.replace(/<PreviewBlock[^>]*id="([^"]+)"[\s\S]*?<div slot="preview"[^>]*>[\s\S]*?<\/div>\s*<\/PreviewBlock>/g, (match, id) => {
  if (id === 'toast-icon') {
    return match.replace(/<div slot="preview"[^>]*>[\s\S]*?<\/div>/, `<div slot="preview" class="flex flex-col items-center gap-4 w-full">
            <button class="run-code-btn px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black hover:scale-105 rounded-xl text-sm font-medium transition-all shadow-lg">▶ Ejecutar Código</button>
            <div class="text-sm text-zinc-500 flex flex-col gap-2 items-center justify-center">
               <span>Copia uno de estos y pégalo en la pestaña "Code":</span>
               <div class="flex gap-2">
                 <code class="px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 rounded select-all cursor-pointer hover:bg-zinc-200 transition-colors">💡</code>
                 <code class="px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 rounded select-all cursor-pointer hover:bg-zinc-200 transition-colors">🔥</code>
                 <code class="px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 rounded select-all cursor-pointer hover:bg-zinc-200 transition-colors">✨</code>
               </div>
               <code class="px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded text-xs select-all cursor-pointer break-all text-center max-w-[280px] text-zinc-400 mt-2 hover:bg-zinc-200 transition-colors">&lt;svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"&gt;&lt;path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/&gt;&lt;/svg&gt;</code>
            </div>
          </div>`);
  }
  
  return match.replace(/<div slot="preview"[^>]*>[\s\S]*?<\/div>/, `<div slot="preview" class="flex flex-col items-center gap-3">
            <button class="run-code-btn px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black hover:scale-105 rounded-xl text-sm font-medium transition-all shadow-lg">▶ Ejecutar Código</button>
            <span class="text-xs text-zinc-400">💡 Edita el código en la pestaña "Code" y pruébalo aquí</span>
          </div>`);
});

fs.writeFileSync(path, content);
console.log('Successfully updated index.astro');
