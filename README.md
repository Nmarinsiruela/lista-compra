# Lista de la Compra

Webapp mobile-first para gestionar la lista de la compra, con historial inteligente que recuerda lo que compras para facilitar añadir productos.

## Características

- Añadir, marcar y eliminar productos
- Etiquetas por producto para separar la compra: *Yo*, *Familia*, *Amigos*, *Otros* (un producto puede tener varias)
- Autocompletado basado en historial personal (ordenado por frecuencia)
- Persistencia en `localStorage` — funciona sin conexión
- Compartir la lista mediante enlace; los productos importados reciben la etiqueta *Externo*
- Interfaz en español e inglés (selector ES/EN en la cabecera)
- Modo oscuro por defecto, con opción de modo claro
- Diseño mobile-first

## Estructura

```
src/
  components/   Componentes de UI (+ CSS modules)
  hooks/        Estado: lista, historial, etiquetas, tema, toasts
  i18n/         Traducciones (translations.js) y proveedor de idioma
  utils/        Helpers: texto, localStorage, enlaces compartidos, etiquetas del sistema
```

Para añadir un idioma, añade un diccionario en `src/i18n/translations.js` con las mismas claves (un test comprueba que coinciden).

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tests

Tests con [Vitest](https://vitest.dev/), `jsdom` y Testing Library.

```bash
npm test            # ejecuta la suite una vez
npm run test:watch  # modo watch durante el desarrollo
```

## Deploy

El proyecto está configurado para desplegarse en Vercel directamente desde GitHub. Vercel detecta automáticamente Vite y configura el build.
