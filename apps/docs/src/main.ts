import { toast, subscribeHistory } from '@ejcp/wiss';
import { initToaster } from '@ejcp/wiss/vanilla';
import type { WissConfig } from '@ejcp/wiss';
import '@ejcp/wiss/styles.css';

const themeLabel = document.getElementById('theme-label');

const themes = ['light', 'dark', 'glass', 'neon', 'brutal', 'pastel'];
let themeIndex = 0;
let colorTheme: string = themes[themeIndex];

const formats: Array<'classic' | 'island'> = ['classic', 'island'];
let formatIndex = 0;
let format = formats[formatIndex];

let pageTheme: 'light' | 'dark' = 'light';
let showProgressBar: boolean = false;
let replaceBehavior: 'normal' | 'wiss' = 'normal';
let enableHistory: boolean = true;
let maxToasts: number = 1;

function applyTheme(): void {
  if (themeLabel) {
    themeLabel.textContent = colorTheme;
  }
  const formatLabel = document.getElementById('format-label');
  if (formatLabel) {
    formatLabel.textContent = format;
  }
  const pageThemeLabel = document.getElementById('page-theme-label');
  if (pageThemeLabel) {
    pageThemeLabel.textContent = pageTheme;
  }

  if (pageTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const actualToastTheme = colorTheme;

  // Evita mezclar nodos ya renderizados con el tema anterior.
  toast.clear();
  
  const configOpts: WissConfig = { 
    theme: actualToastTheme, 
    format, 
    position: 'top-center', 
    duration: 4000, 
    progressBar: showProgressBar,
    replaceBehavior,
    enableHistory,
    maxToasts
  };

  if (format === 'brutalist') {
    configOpts.fontFamily = 'Courier New, monospace';
  } else {
    configOpts.fontFamily = 'system-ui, -apple-system, sans-serif';
  }

  initToaster(configOpts);
}

document.getElementById('btn-success')?.addEventListener('click', () => {
  toast.success('<b>¡Todo salió bien!</b>', { 
    description: 'Los cambios se han guardado exitosamente en la base de datos. Por favor refresca la página. <br/> <a href="#">Ver detalles</a>',
    richText: true
  });
});

document.getElementById('btn-error')?.addEventListener('click', () => {
  toast.error('Algo salió mal', {
    description: 'No pudimos procesar tu solicitud. Intenta de nuevo más tarde.'
  });
});

document.getElementById('btn-warning')?.addEventListener('click', () => {
  toast.warning('Revisa este campo', {
    description: 'La contraseña debe tener al menos 8 caracteres y un símbolo especial.'
  });
});

document.getElementById('btn-info')?.addEventListener('click', () => {
  toast.info('Nueva actualización disponible', {
    description: 'Hemos lanzado la versión 2.0 con nuevas características y mejoras de rendimiento.'
  });
});

document.getElementById('btn-action')?.addEventListener('click', () => {
  toast.show('Archivo modificado', {
    description: 'Tus cambios locales no se han sincronizado con la nube aún.',
    action: {
      label: 'Sincronizar ahora',
      onClick: () => {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 2000)),
          {
            loading: 'Sincronizando archivos...',
            success: 'Archivos sincronizados con éxito',
            error: 'Error al sincronizar'
          }
        );
      }
    }
  });
});

document.getElementById('btn-promise')?.addEventListener('click', () => {
  toast.promise(
    new Promise((resolve) => setTimeout(resolve, 2000)),
    {
      loading: 'Enviando invitación...',
      success: 'Invitación enviada a maria@example.com',
      error: 'No se pudo enviar la invitación'
    }
  );
});

document.getElementById('btn-theme')?.addEventListener('click', () => {
  themeIndex = (themeIndex + 1) % themes.length;
  colorTheme = themes[themeIndex];
  applyTheme();
});

document.getElementById('btn-page-theme')?.addEventListener('click', () => {
  pageTheme = pageTheme === 'light' ? 'dark' : 'light';
  applyTheme();
});

document.getElementById('btn-theme-island')?.addEventListener('click', () => {
  formatIndex = (formatIndex + 1) % formats.length;
  format = formats[formatIndex];
  applyTheme();
});

document.getElementById('btn-progress')?.addEventListener('click', () => {
  showProgressBar = !showProgressBar;
  const label = document.getElementById('progress-label');
  if (label) {
    label.textContent = showProgressBar ? 'Visible' : 'Oculto';
  }
  applyTheme();
});

document.getElementById('btn-replace')?.addEventListener('click', () => {
  replaceBehavior = replaceBehavior === 'normal' ? 'metamorphosis' : 'normal';
  const label = document.getElementById('replace-label');
  if (label) {
    label.textContent = replaceBehavior;
  }
  applyTheme();
});

document.getElementById('btn-history-toggle')?.addEventListener('click', () => {
  enableHistory = !enableHistory;
  const label = document.getElementById('history-toggle-label');
  if (label) {
    label.textContent = enableHistory ? 'Activo' : 'Inactivo';
  }
  applyTheme();
});
document.getElementById('btn-limit')?.addEventListener('click', () => {
  maxToasts = maxToasts === 5 ? 3 : (maxToasts === 3 ? 1 : 5);
  const label = document.getElementById('limit-label');
  if (label) {
    label.textContent = maxToasts.toString();
  }
  applyTheme();
});


applyTheme();

const historyList = document.getElementById('history-list');
const historyCount = document.getElementById('history-count');
const btnClearHistory = document.getElementById('btn-clear-history');

if (historyList && historyCount && btnClearHistory) {
  subscribeHistory((history) => {
    historyCount.textContent = history.length.toString();
    
    if (history.length === 0) {
      historyList.innerHTML = '<li class="text-sm text-zinc-500 dark:text-zinc-400 italic text-center py-4">No hay notificaciones en el historial.</li>';
      return;
    }

    historyList.innerHTML = history.map(t => {
      const typeColor = t.type === 'error' ? 'text-red-500' 
                      : t.type === 'success' ? 'text-emerald-500' 
                      : t.type === 'warning' ? 'text-amber-500' 
                      : 'text-blue-500';
      const time = new Date(t.createdAt).toLocaleTimeString();
      return `
        <li class="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div class="flex items-center justify-between mb-1">
            <strong class="text-xs uppercase font-bold ${typeColor}">${t.type}</strong>
            <span class="text-xs text-zinc-400 dark:text-zinc-500">${time}</span>
          </div>
          <div class="text-sm text-zinc-700 dark:text-zinc-300">${String(t.message)}</div>
        </li>
      `;
    }).join('');
  });

  btnClearHistory.addEventListener('click', () => {
    toast.clearHistory();
  });
}
