# Lista de la Compra

Webapp mobile-first para gestionar la lista de la compra, con historial inteligente que recuerda lo que compras para facilitar añadir productos.

## Características

- Añadir, marcar y eliminar productos
- Etiquetas ("carros") por producto para separar la compra (p. ej. familia vs. propia)
- Autocompletado basado en historial personal (ordenado por frecuencia)
- Persistencia en `localStorage` — funciona sin conexión
- Diseño mobile-first

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
