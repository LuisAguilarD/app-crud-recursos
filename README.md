# DevShelf

Biblioteca personal para guardar y organizar recursos de aprendizaje de programación.
Permite clasificar y consultar videos, artículos, documentación, cursos y herramientas en un solo lugar.

## Funcionalidades

- Página de bienvenida con estadísticas (total de recursos, favoritos y temas).
- Registro de recursos con validación de formulario.
- Listado de recursos en tarjetas con badges por tipo.
- Edición de recursos.
- Persistencia en localStorage.

## Tecnologías

- **Vite** (^8.3.5)
- **JavaScript vanilla** (módulos ES)
- **CSS** con variables
- **uuid** (^14.0.3)

## Requisitos

- Node.js
- pnpm

## Estructura del proyecto

```text
src/
├── main.js             # Punto de entrada de la aplicación
├── style.css           # Hoja de estilos principal que importa los archivos de src/styles/
├── router.js           # Enrutador por hash para navegación SPA
├── components/         # Componentes y piezas reutilizables (navbar, toast)
├── views/              # Módulos de vistas para cada página de la aplicación
├── services/
│   └── storage.js      # Servicio para acceso y persistencia en localStorage
└── data/
    └── options.js      # Colección de opciones para tipo, tema y nivel
```

## Modelo de datos

El modelo de datos almacena recursos en `localStorage` bajo la clave `"devshelf:recursos"` según la siguiente estructura:

```json
{
  "id": "c71a39f0-28e4-4d83-b924-a15d0fa86749",
  "titulo": "MDN Web Docs - Guía de JavaScript",
  "url": "https://developer.mozilla.org/es/docs/Web/JavaScript",
  "tipo": "docs",
  "tema": "javascript",
  "nivel": "intermedio",
  "favorito": true,
  "fechaCreacion": "2026-11-06T18:40:00.000Z"
}
```

## Autor

- [Tu nombre]
- Proyecto del bootcamp [Nombre del bootcamp]
