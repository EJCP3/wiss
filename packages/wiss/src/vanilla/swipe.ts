import { removeToast } from '../core/store';

const SWIPE_THRESHOLD = 80;
const SWIPE_OPACITY_THRESHOLD = 150;

export function setupSwipe(container: HTMLDivElement): void {
  let activeToast: HTMLElement | null = null;
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  const resetSwipe = () => {
    if (activeToast) {
      activeToast.style.transform = '';
      activeToast.style.opacity = '';
      activeToast.style.transition = '';
    }
    activeToast = null;
    isSwiping = false;
  };

  container.addEventListener('pointerdown', (e) => {
    // Solo permitir botón principal o toque
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const target = e.target as HTMLElement;
    const toast = target.closest('[data-wiss-id]') as HTMLElement;
    if (!toast) return;

    // Prevenir swipe si estamos saliendo o si es un action button
    if (toast.dataset.exiting === 'true' || target.closest('[data-wiss-action]') || target.closest('.island-action')) return;

    activeToast = toast;
    startX = e.clientX;
    currentX = startX;
    isSwiping = true;

    // Deshabilitamos la transición temporalmente para que el swipe sea fluido e instantáneo
    activeToast.style.transition = 'none';
    
    // Capturamos el puntero para que no se pierda el evento al salir del elemento
    target.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isSwiping || !activeToast) return;

    currentX = e.clientX;
    const deltaX = currentX - startX;

    // Aplicar transformación visual
    // Usamos translateX para respetar la animacion por transformacion sin sobreescribirla por completo
    // Ya que usamos transition: none, se sentira rapido.
    activeToast.style.transform = `translateX(${deltaX}px)`;
    
    // Reducir opacidad suavemente
    const opacity = Math.max(0, 1 - Math.abs(deltaX) / SWIPE_OPACITY_THRESHOLD);
    activeToast.style.opacity = String(opacity);
  });

  const onPointerUpOrCancel = (e: PointerEvent) => {
    if (!isSwiping || !activeToast) return;

    const deltaX = currentX - startX;
    const toastId = activeToast.dataset.wissId;
    
    // Restaurar transiciones para la animación de cierre o rebote
    activeToast.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && toastId) {
      // Remover
      activeToast.dataset.exiting = 'true';
      const direction = deltaX > 0 ? 1 : -1;
      activeToast.style.transform = `translateX(${direction * 150}%)`;
      activeToast.style.opacity = '0';
      
      // Llamar a removeToast, esto disparará animateOut
      // No necesitamos manejar la transición de salida completa aquí, 
      // porque store llamará a removeToast y reconciliación hará el resto.
      // El setTimeout garantiza que la transición css se registre
      setTimeout(() => {
         removeToast(toastId);
      }, 0);
    } else {
      // Rebotar al centro
      activeToast.style.transform = '';
      activeToast.style.opacity = '';
      
      // Quitar los estilos inline después de la transición para devolver el control al CSS original
      const toastRef = activeToast;
      setTimeout(() => {
        if (toastRef && toastRef.dataset.exiting !== 'true') {
          toastRef.style.transition = '';
        }
      }, 300);
    }

    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    activeToast = null;
    isSwiping = false;
  };

  container.addEventListener('pointerup', onPointerUpOrCancel);
  container.addEventListener('pointercancel', onPointerUpOrCancel);
}
