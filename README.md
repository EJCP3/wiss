# wiss

Librería de notificaciones toast **headless** y sin dependencias de runtime. El
núcleo (`wiss`) es un "cerebro" de TypeScript puro —estado, cola, timers— que
no sabe nada del DOM ni de ningún framework. La capa visual es intercambiable:
por defecto trae un tema propio con glassmorphism (**sileo**) o puedes optar
por heredar el tema de tu proyecto vía **daisyUI**.

Esta fase incluye un único adaptador, **Vanilla JS**, que también sirve para
Astro (Astro usa Vanilla en el cliente por defecto).

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

## Cambiar de tema (sileo vs daisy)

El tema por defecto es **sileo** (glassmorphism, clases Tailwind propias, sin
depender de ninguna librería de componentes). Si tu proyecto ya usa daisyUI y
quieres que los toasts hereden su tema activo (claro/oscuro/cyberpunk/etc.),
configura `theme: 'daisy'` al inicializar:

```js
import { initToaster } from 'wiss/vanilla';

initToaster({
  theme: 'daisy', // 'sileo' (default) | 'daisy'
  position: 'bottom-right',
  duration: 4000,
  offset: 16,
});
```

Con `theme: 'daisy'`, wiss inyecta las clases de daisyUI (`alert`,
`alert-success`, `alert-error`, ...) en vez de las suyas propias, así que el
color final lo resuelve el tema de daisyUI configurado en tu proyecto, no
wiss.

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

## Roadmap

Fuera de alcance en esta fase, planeado para más adelante:

- Adaptadores para **Vue** y **React**.
- Tema **headless** (sin clases de estilo, pensado para integrarse con
  shadcn/ui u otros sistemas de diseño propios).
- Efecto de entrada/salida **"gooey pill"** con filtro SVG.
- `toast.promise(...)` y toasts con **acciones** (botones dentro del toast).


## Créditos

* **Diseño Visual:** La estética base (con efectos de *glassmorphism* y bordes suaves) está inspirada en el diseño de [Sileo UI](https://sileo.aaryan.design/).

* **Sonido de notificación** : los mini sonidos de las notificaciones son de [Cuelume](https://cuelume-site.pages.dev/)