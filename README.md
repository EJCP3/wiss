# wiss

Librería de notificaciones toast **headless** y sin dependencias de runtime. El
núcleo (`wiss`) es un "cerebro" de TypeScript puro —estado, cola, timers— que
no sabe nada del DOM ni de ningún framework. La capa visual es intercambiable:
por defecto trae sus propios temas (**light** y **dark**) o puedes optar
por heredar el tema de tu proyecto vía **daisyUI** para que se adapte a tu diseño actual.

Esta fase incluye un único adaptador, **Vanilla JS**, que también sirve para
Astro.

## Instalación

```bash
pnpm add wiss
```

## Uso básico (Vanilla JS)

```js
// una vez, en el entry point de tu app
import { initToaster } from 'wiss/vanilla';
initToaster();
```

```js
// desde cualquier archivo
import { toast } from 'wiss';

toast.success('Usuario creado');
toast.error('Algo salió mal');
toast.warning('Revisa este campo');
toast.info('Nueva actualización disponible');

// promesas
toast.promise(
  fetch('/api/users'),
  {
    loading: 'Cargando usuarios...',
    success: 'Usuarios cargados correctamente',
    error: 'Error al cargar usuarios',
  }
);
```

## Uso en Astro

```astro
---
// Layout.astro
---
<slot />
<script>
  import { initToaster } from 'wiss/vanilla';
  initToaster();
</script>
```

Luego, desde cualquier componente o script del cliente:

```js
import { toast } from 'wiss';
toast.success('¡Listo!');
```

## Temas, daisyUI y shadcn/ui

Por defecto, la librería utiliza sus propios temas (**light** y **dark**) construidos con Tailwind. Esto permite que los toasts se vean bien automáticamente.

### Integración con shadcn/ui

Si usas **shadcn/ui** (en Tailwind v4 o usando variables de colores absolutas/hex/oklch), wiss ahora incluye soporte nativo. Configura `theme: 'shadcn'` y los toasts mapearán automáticamente sus colores a las variables de tu proyecto (como `--background`, `--foreground`, `--primary`, `--destructive`, etc.):

```js
import { initToaster } from 'wiss/vanilla';

initToaster({
  theme: 'shadcn',
  position: 'bottom-right',
  duration: 4000,
});
```
*Nota: Si estás usando una versión más antigua de shadcn donde las variables solo exportan los valores HSL sueltos (ej. `0 0% 100%`), puedes seguir usando `theme: 'light'` o `'dark'` y mapear las variables `--wiss-*` en tu archivo `globals.css` envolviéndolas en la función `hsl()`.*

### Integración con daisyUI

Si prefieres que los toasts hereden el estilo activo de **daisyUI** (claro, oscuro, cyberpunk, etc.), puedes usar `theme: 'daisy'`:

```js
import { initToaster } from 'wiss/vanilla';

initToaster({
  theme: 'daisy', // 'dark' (default) | 'light' | 'shadcn' | 'daisy'
  position: 'bottom-right',
  duration: 4000,
  offset: 16,
});
```

Con `theme: 'daisy'`, wiss inyecta las clases de daisyUI (`alert`, `alert-success`, `alert-error`, ...) en vez de las suyas propias. Así, el color final lo resuelve el tema de daisyUI configurado en tu proyecto.

Si no necesitas integrarlo con daisyUI o prefieres los estilos que trae wiss de base, simplemente no envíes la propiedad `theme` (o usa `'light'`/`'dark'`) y usará el tema predeterminado.

## Nota importante sobre Tailwind

Los temas de wiss traen las clases de Tailwind incrustadas en el código de la
librería, que vive dentro de `node_modules`. Tailwind, por defecto, **no
escanea `node_modules`**, así que si no le indicas la ruta explícitamente los
toasts se renderizan sin estilos. Agrega la ruta de `wiss` al `content` de tu
`tailwind.config.js`:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{astro,html,js,ts}',
    './node_modules/wiss/dist/**/*.{js,mjs}',
  ],
  // ...
};
```

## Uso en React

```tsx
import { Toaster } from 'wiss/react';
import { toast } from 'wiss';

function App() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <button onClick={() => toast.success('¡Hecho!')}>Notify</button>
    </>
  );
}
```

## Uso en Vue

```vue
<script setup>
import { WissToaster } from 'wiss/vue';
import { toast } from 'wiss';
</script>

<template>
  <WissToaster position="bottom-right" theme="dark" />
  <button @click="toast.success('¡Hecho!')">Notify</button>
</template>
```

## Uso en Svelte

Para **Svelte 5**:
```svelte
<script>
  import { createToaster } from 'wiss/svelte';
  import { toast } from 'wiss';

  $effect(() => createToaster({ position: 'bottom-right', theme: 'dark' }));
</script>

<button onclick={() => toast.success('¡Hecho!')}>Notify</button>
```

Para **Svelte 3/4**:
```svelte
<script>
  import { onMount } from 'svelte';
  import { createToaster } from 'wiss/svelte';
  import { toast } from 'wiss';

  onMount(() => createToaster({ position: 'bottom-right', theme: 'dark' }));
</script>

<button on:click={() => toast.success('¡Hecho!')}>Notify</button>
```

## Roadmap

Fuera de alcance en esta fase, planeado para más adelante:

- Mejora del sitio web/Docs
- Demo de uso de los adaptadores para frameworks.
- Añadir nuevos formatos: customizados para usuarios que no usan daisyui ni shadcn/ui.
- Añadir nuevas animaciones y que esten en la documentación.
- Implementar mejoras en el rendimiento.
- Añadir nuevos iconos para las notificaciones.
- Añadir nuevos sonidos para las notificaciones.
- Añadr nuevos temas 


## Créditos

* **Diseño Visual:** La estética base (con efectos de *glassmorphism* y bordes suaves) está inspirada en el diseño de [Sileo UI](https://sileo.aaryan.design/).

* **Sonido de notificación** : los mini sonidos de las notificaciones son de [Cuelume](https://cuelume-site.pages.dev/)