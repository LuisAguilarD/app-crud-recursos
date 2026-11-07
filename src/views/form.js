import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { create, update } from '../services/storage.js';
import { showToast } from '../components/toast.js';

// Renderiza el formulario tanto en modo creación como en modo edición si se pasa un recurso
export function renderForm(app, recurso = null) {
  const isEditing = Boolean(recurso);

  app.innerHTML = `
    <div class="container">
      <div class="card form-card">
        <h1>${isEditing ? 'Editar recurso' : 'Nuevo recurso'}</h1>
        <form id="resource-form" novalidate>
          <div class="form-group">
            <label for="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              class="input"
              placeholder="Ej. Documentación de MDN"
              value="${recurso ? recurso.titulo : ''}"
            />
            <span class="form-error" id="error-titulo"></span>
          </div>

          <div class="form-group">
            <label for="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              class="input"
              placeholder="https://ejemplo.com"
              value="${recurso ? recurso.url : ''}"
            />
            <span class="form-error" id="error-url"></span>
          </div>

          <div class="form-group">
            <label for="tipo">Tipo</label>
            <select id="tipo" name="tipo" class="select">
              <option value="">Selecciona...</option>
              ${TIPOS.map((tipo) => `
                <option value="${tipo.value}" ${recurso && recurso.tipo === tipo.value ? 'selected' : ''}>
                  ${tipo.label}
                </option>
              `).join('')}
            </select>
            <span class="form-error" id="error-tipo"></span>
          </div>

          <div class="form-group">
            <label for="tema">Tema</label>
            <select id="tema" name="tema" class="select">
              <option value="">Selecciona...</option>
              ${TEMAS.map((tema) => `
                <option value="${tema.value}" ${recurso && recurso.tema === tema.value ? 'selected' : ''}>
                  ${tema.label}
                </option>
              `).join('')}
            </select>
            <span class="form-error" id="error-tema"></span>
          </div>

          <div class="form-group">
            <label>Nivel</label>
            <div class="radio-group">
              ${NIVELES.map((nivel) => {
                const isChecked = recurso
                  ? recurso.nivel === nivel.value
                  : nivel.value === 'basico';
                return `
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="nivel"
                      value="${nivel.value}"
                      ${isChecked ? 'checked' : ''}
                    />
                    <span>${nivel.label}</span>
                  </label>
                `;
              }).join('')}
            </div>
            <span class="form-error" id="error-nivel"></span>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="favorito"
                name="favorito"
                ${recurso && recurso.favorito ? 'checked' : ''}
              />
              <span>Marcar como favorito</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${isEditing ? 'Actualizar' : 'Guardar'}</button>
            <a href="#/recursos" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = app.querySelector('#resource-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Limpiar errores previos
    form.querySelectorAll('.is-error').forEach((element) => {
      element.classList.remove('is-error');
      element.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.form-error').forEach((element) => {
      element.textContent = '';
    });

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.favorito = Boolean(formData.get('favorito'));

    let hasErrors = false;

    // Validación de título
    const titleInput = form.querySelector('#titulo');
    const errorTitle = form.querySelector('#error-titulo');
    const title = (data.titulo || '').trim();
    if (!title || title.length < 3) {
      titleInput.classList.add('is-error');
      titleInput.setAttribute('aria-invalid', 'true');
      errorTitle.textContent = 'El título es obligatorio y debe tener al menos 3 caracteres.';
      hasErrors = true;
    }

    // Validación de URL con new URL()
    const urlInput = form.querySelector('#url');
    const errorUrl = form.querySelector('#error-url');
    const url = (data.url || '').trim();
    let isValidUrl = false;
    if (url) {
      try {
        new URL(url);
        isValidUrl = true;
      } catch {
        isValidUrl = false;
      }
    }
    if (!isValidUrl) {
      urlInput.classList.add('is-error');
      urlInput.setAttribute('aria-invalid', 'true');
      errorUrl.textContent = 'Ingresa una URL válida (ej. https://ejemplo.com).';
      hasErrors = true;
    }

    // Validación de tipo
    const typeSelect = form.querySelector('#tipo');
    const errorType = form.querySelector('#error-tipo');
    if (!data.tipo) {
      typeSelect.classList.add('is-error');
      typeSelect.setAttribute('aria-invalid', 'true');
      errorType.textContent = 'El tipo es obligatorio.';
      hasErrors = true;
    }

    // Validación de tema
    const themeSelect = form.querySelector('#tema');
    const errorTheme = form.querySelector('#error-tema');
    if (!data.tema) {
      themeSelect.classList.add('is-error');
      themeSelect.setAttribute('aria-invalid', 'true');
      errorTheme.textContent = 'El tema es obligatorio.';
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const payload = {
      titulo: title,
      url,
      tipo: data.tipo,
      tema: data.tema,
      nivel: data.nivel || 'basico',
      favorito: data.favorito
    };

    if (isEditing) {
      update(recurso.id, payload);
      showToast('Recurso actualizado');
    } else {
      create(payload);
      showToast('Recurso guardado');
    }

    form.reset();
    window.location.hash = '#/recursos';
  });
}
