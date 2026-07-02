import { toast } from 'wiss';
import { initToaster } from 'wiss/vanilla';
import type { WissConfig } from 'wiss';

const root = document.documentElement;
const themeLabel = document.getElementById('theme-label');

let theme: NonNullable<WissConfig['theme']> = 'sileo';

function applyTheme(): void {
  if (themeLabel) {
    themeLabel.textContent = theme;
  }

  if (theme === 'daisy') {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  } else {
    root.setAttribute('data-theme', 'light');
    root.classList.remove('dark');
  }

  // Evita mezclar nodos ya renderizados con el tema anterior.
  toast.clear();
  initToaster({ theme, position: 'bottom-right', duration: 4000 });
}

document.getElementById('btn-success')?.addEventListener('click', () => {
  toast.success('¡Todo salió bien!');
});

document.getElementById('btn-error')?.addEventListener('click', () => {
  toast.error('Algo salió mal');
});

document.getElementById('btn-warning')?.addEventListener('click', () => {
  toast.warning('Revisa este campo');
});

document.getElementById('btn-info')?.addEventListener('click', () => {
  toast.info('Nueva actualización disponible');
});

document.getElementById('btn-theme')?.addEventListener('click', () => {
  theme = theme === 'sileo' ? 'daisy' : 'sileo';
  applyTheme();
});

applyTheme();
