import { toast } from '@ejcp/wiss';
import { initToaster } from '@ejcp/wiss/vanilla';
import type { WissConfig } from '@ejcp/wiss';
import '@ejcp/wiss/styles.css';

const themeLabel = document.getElementById('theme-label');

let colorTheme: 'light' | 'dark' | 'auto' = 'auto';
let format: 'classic' | 'island' = 'classic';
let pageTheme: 'light' | 'dark' = 'light';
let showProgressBar: boolean = false;

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

  const actualToastTheme = colorTheme === 'auto' 
    ? (pageTheme === 'light' ? 'dark' : 'light') 
    : colorTheme;

  // Evita mezclar nodos ya renderizados con el tema anterior.
  toast.clear();
  initToaster({ theme: actualToastTheme, format, position: 'top-center', duration: 4000, progressBar: showProgressBar });
}

document.getElementById('btn-success')?.addEventListener('click', () => {
  toast.success('¡Todo salió bien!', { 
    description: 'Los cambios se han guardado exitosamente en la base de datos. Por favor refresca la página.' 
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
  if (colorTheme === 'light') colorTheme = 'dark';
  else if (colorTheme === 'dark') colorTheme = 'auto';
  else colorTheme = 'light';
  applyTheme();
});

document.getElementById('btn-page-theme')?.addEventListener('click', () => {
  pageTheme = pageTheme === 'light' ? 'dark' : 'light';
  applyTheme();
});

document.getElementById('btn-theme-island')?.addEventListener('click', () => {
  format = format === 'classic' ? 'island' : 'classic';
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



applyTheme();
