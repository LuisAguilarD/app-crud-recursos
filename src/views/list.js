import { getAll, remove } from '../services/storage.js';
import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { showToast } from '../components/toast.js';

// Retorna el label legible de una opción según su value
export function getLabel(lista, value) {
  const item = lista.find((option) => option.value === value);
  return item ? item.label : value;
}

// Despliega una ventana modal personalizada para confirmar la eliminación de un recurso
function showConfirmModal(title) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title">Eliminar recurso</h3>
        <p>¿Seguro que quieres eliminar «${title}»? Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-action="cancel">Cancelar</button>
          <button type="button" class="btn btn-danger" data-action="confirm">Sí, eliminar</button>
        </div>
      </div>
    `;

    const close = (result) => {
      document.removeEventListener('keydown', handleKey);
      overlay.remove();
      resolve(result);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        close(false);
      }
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('[data-action="cancel"]')) {
        close(false);
      } else if (e.target.closest('[data-action="confirm"]')) {
        close(true);
      }
    });

    document.addEventListener('keydown', handleKey);
    document.body.appendChild(overlay);
  });
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
                <div class="resource-actions" style="display: flex; gap: 0.5rem;">
                  <a href="#/editar/${resource.id}" class="btn btn-secondary">Editar</a>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-id="${resource.id}"
                    data-title="${resource.titulo}"
                  >
                    Eliminar
                  </button>
                </div>
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

  // Delegación de eventos sobre el contenedor del listado
  const listContainer = app.querySelector('.resource-grid');
  if (listContainer) {
    listContainer.addEventListener('click', async (event) => {
      const deleteButton = event.target.closest('button[data-id]');
      if (!deleteButton) {
        return;
      }

      const id = deleteButton.dataset.id;
      const resource = sortedResources.find((item) => item.id === id);
      const title = resource ? resource.titulo : (deleteButton.dataset.title || '');

      const isConfirmed = await showConfirmModal(title);
      if (!isConfirmed) {
        showToast('Eliminación cancelada');
        return;
      }

      const isRemoved = remove(id);
      if (isRemoved) {
        showToast('Recurso eliminado');
      } else {
        showToast('Recurso no encontrado', 'error');
      }

      renderList(app);
    });
  }
}
