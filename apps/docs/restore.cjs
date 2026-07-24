const fs = require('fs');
const path = 'c:/Users/euddy/Desktop/Pagina web/wiss/apps/docs/src/pages/index.astro';
let content = fs.readFileSync(path, 'utf8');

const slots = {
  'toast-simple': `<div slot="preview" class="flex flex-wrap justify-center gap-3">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Success</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Error</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Warning</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Info</button>
          </div>`,
  'toast-action': `<div slot="preview" class="flex justify-center">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Action</button>
          </div>`,
  'toast-promise': `<div slot="preview" class="flex justify-center">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Promise</button>
          </div>`,
  'toast-description': `<div slot="preview" class="flex justify-center">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Description</button>
          </div>`,
  'toast-progress': `<div slot="preview" class="flex justify-center">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Progress</button>
          </div>`,
  'toast-history': `<div slot="preview" class="flex justify-center">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">History</button>
          </div>`,
  'toast-theme': `<div slot="preview" class="flex justify-center gap-3">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Dark Theme</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Light Theme</button>
          </div>`,
  'toast-format': `<div slot="preview" class="flex justify-center gap-3">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Classic Format</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Island Format</button>
          </div>`,
  'toast-limit': `<div slot="preview" class="flex justify-center gap-3">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Limit 2</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Limit 5</button>
          </div>`,
  'toast-behavior': `<div slot="preview" class="flex justify-center gap-3">
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Behavior Normal</button>
            <button class="toast-btn px-5 py-2.5 bg-[#f6f6f7] hover:bg-[#ececed] dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">Behavior Wiss</button>
          </div>`
};

for (const [id, slotHTML] of Object.entries(slots)) {
  const regexStr = '<PreviewBlock[^>]*id="' + id + '"[\\s\\S]*?<div slot="preview"[^>]*>[\\s\\S]*?<\\/div>\\s*<\\/PreviewBlock>';
  const regex = new RegExp(regexStr);
  content = content.replace(regex, (match) => {
    return match.replace(/<div slot="preview"[^>]*>[\s\S]*?<\/div>/, slotHTML);
  });
}

// Fix the SVG icon logic - ensure it replaces precisely by capturing the same quote
content = content.replace(
  /text = text\.replace\(\/icon:\\s\*\['"\`\]\[\\s\\S\]\*\?\['"\`\]\/, `icon: '\\$\\{newIcon\\}'`\);/,
  "text = text.replace(/icon:\\s*(['\"`])([\\s\\S]*?)\\1/, `icon: $1${newIcon}$1`);"
);
// In case the above replace didn't match (because it might be formatted differently)
content = content.replace(
  /text = text\.replace\(\/icon:\\\\s\*\['"\\\]\[\\\\s\\\\S\]\*\?\['"\\\]\/, \`icon: '\$\{newIcon\}'\`\);/,
  "text = text.replace(/icon:\\s*(['\"`])([\\s\\S]*?)\\1/, `icon: $1${newIcon}$1`);"
);
// Or brute force replacing the specific line inside index.astro:
content = content.replace(
  /text\.replace\(\/icon:[\s\S]*?\),/,
  "text.replace(/icon:\\s*(['\"`])([\\s\\S]*?)\\1/, `icon: $1${newIcon}$1`);"
);

// Inject back the toast-btn listener if it's not there
if (!content.includes('.toast-btn')) {
  const toastBtnScript = `
    document.querySelectorAll('.toast-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = (e.target).textContent?.toLowerCase().trim();
        
        switch(type) {
          case 'success': toast.success('Event has been created'); break;
          case 'error': toast.error('Missing required fields'); break;
          case 'warning': toast.warning('Your session will expire soon'); break;
          case 'info': toast.info('New software update available'); break;
          case 'action': toast.show('Item deleted', { 
            action: { label: 'Undo', onClick: () => console.log('Undone') } 
          }); break;
          case 'promise': 
            toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
              loading: 'Loading data...',
              success: 'Data loaded successfully!',
              error: 'Error loading data'
            }); 
            break;
          case 'description': toast.success('¡Archivo guardado!', { description: 'El archivo se guardó correctamente en tu carpeta local.' }); break;
          case 'icon': toast.info('Nueva actualización', { icon: '🚀' }); break;
          case 'progress': toast.info('Descargando archivo...', { duration: 5000, progressBar: true }); break;
          case 'history': 
            console.log(toast.history()); 
            toast.info('Historial impreso en consola. Abre DevTools para verlo.'); 
            break;
          case 'dark theme': toaster({ theme: 'dark' }); toast.success('Tema oscuro activado'); break;
          case 'light theme': toaster({ theme: 'light' }); toast.success('Tema claro activado'); break;
          case 'classic format': toaster({ format: 'classic' }); toast.success('Formato Classic activado'); break;
          case 'island format': toaster({ format: 'island' }); toast.success('Formato Island activado'); break;
          case 'limit 2': toaster({ maxToasts: 2 }); toast.info('Límite cambiado a 2. Spamea clics para probar.'); break;
          case 'limit 5': toaster({ maxToasts: 5 }); toast.info('Límite cambiado a 5.'); break;
          case 'behavior normal': toaster({ replaceBehavior: 'normal' }); toast.info('Comportamiento Normal activado (Apilar)'); break;
          case 'behavior wiss': toaster({ replaceBehavior: 'wiss' }); toast.info('Comportamiento Wiss activado (Reemplazar)'); break;
        }
      });
    });
  `;
  content = content.replace(
    /document\.querySelectorAll\('\.run-code-btn'\)\.forEach\(btn => \{/,
    toastBtnScript + '\n    document.querySelectorAll(".run-code-btn").forEach(btn => {'
  );
}

fs.writeFileSync(path, content);
console.log('Done restoring buttons and fixing regex!');
