import { getAll } from '../services/storage.js';
import { TIPOS, TEMAS, NIVELES } from '../data/options.js';

// Retorna el label legible de una opción según su value
export function getLabel(lista, value) {
  const item = lista.find((option) => option.value === value);
  return item ? item.label : value;
}

// Renderiza la vista con el catálogo de recursos ordenados cronológicamente
export function renderList(app) {
  const resources = getAll();
  const sortedResources = [...resources].sort(
    (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
  );

  const content = sortedResources.length === 0
    ? `
      <div class="card empty-state">
        <p>Aún no tienes recursos</p>
        <a href="#/nuevo" class="btn btn-primary">Agregar el primero</a>
      </div>
    `
    : `
      <div class="resource-grid">
        ${sortedResources.map((resource) => {
          const tipoLabel = getLabel(TIPOS, resource.tipo);
          const temaLabel = getLabel(TEMAS, resource.tema);
          const nivelLabel = getLabel(NIVELES, resource.nivel);
          let hostname = '';
          try {
            hostname = new URL(resource.url).hostname;
          } catch {
            hostname = resource.url;
          }
          const formattedDate = resource.fechaCreacion
            ? new Date(resource.fechaCreacion).toLocaleDateString('es-SV')
            : '';

          return `
            <div class="card resource-card">
              <div class="resource-card-header">
                <span class="badge badge--${resource.tipo}">${tipoLabel}</span>
                ${resource.favorito ? '<span class="resource-favorite" title="Favorito">★</span>' : ''}
              </div>
              <h3 class="resource-title">
                <a href="${resource.url}" target="_blank" rel="noopener">${resource.titulo}</a>
              </h3>
              <p class="resource-domain"><code>${hostname}</code></p>
              <div class="resource-meta">
                <span>Tema: ${temaLabel}</span>
                <span>Nivel: ${nivelLabel}</span>
              </div>
              <div class="resource-footer">
                <time class="resource-date">${formattedDate}</time>
                <a href="#/editar/${resource.id}" class="btn btn-secondary">Editar</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

  app.innerHTML = `
    <div class="container">
      <div class="list-header">
        <h1>Mis recursos</h1>
        <a href="#/nuevo" class="btn btn-primary">+ Nuevo recurso</a>
      </div>
      ${content}
    </div>
  `;
}
