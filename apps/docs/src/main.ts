import { toast } from 'wiss';
import { initToaster } from 'wiss/vanilla';
import type { WissConfig } from 'wiss';
import 'wiss/styles.css';

const root = document.documentElement;
const themeLabel = document.getElementById('theme-label');

let colorTheme: 'wiss' | 'daisy' = 'wiss';
let format: 'classic' | 'island' = 'classic';

function applyTheme(): void {
  const resolvedTheme = format === 'island' 
    ? (colorTheme === 'daisy' ? 'island-daisy' : 'island') 
    : colorTheme;

  if (themeLabel) {
    themeLabel.textContent = colorTheme;
  }
  const formatLabel = document.getElementById('format-label');
  if (formatLabel) {
    formatLabel.textContent = format;
  }

  // Evita mezclar nodos ya renderizados con el tema anterior.
  toast.clear();
  initToaster({ theme: resolvedTheme, position: 'top-center', duration: 4000 });
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
  colorTheme = colorTheme === 'wiss' ? 'daisy' : 'wiss';
  applyTheme();
});

document.getElementById('btn-theme-island')?.addEventListener('click', () => {
  format = format === 'classic' ? 'island' : 'classic';
  applyTheme();
});

const setHtmlTheme = (themeName: string, isDark: boolean = false) => {
  document.documentElement.setAttribute('data-theme', themeName);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  if (colorTheme !== 'daisy') {
    colorTheme = 'daisy';
    applyTheme();
  }
};

document.getElementById('btn-daisy-light')?.addEventListener('click', () => setHtmlTheme('light', false));
document.getElementById('btn-daisy-dark')?.addEventListener('click', () => setHtmlTheme('dark', true));
document.getElementById('btn-daisy-cyberpunk')?.addEventListener('click', () => setHtmlTheme('cyberpunk', false));
document.getElementById('btn-daisy-retro')?.addEventListener('click', () => setHtmlTheme('retro', false));
document.getElementById('btn-daisy-synthwave')?.addEventListener('click', () => setHtmlTheme('synthwave', true));

applyTheme();
