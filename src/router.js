import { renderHome } from './views/home.js';
import { renderForm } from './views/form.js';
import { renderList } from './views/list.js';
import { setActiveLink } from './components/navbar.js';
import { getById } from './services/storage.js';
import { showToast } from './components/toast.js';

export const routes = {
  '#/': renderHome,
  '#/recursos': renderList,
  '#/nuevo': renderForm,
};

export function initRouter(app) {
  const handleRoute = () => {
    const hash = window.location.hash;

    // Ruta dinámica #/editar/{id}
    const editMatch = hash.match(/^#\/editar\/(.+)$/);
    if (editMatch) {
      const id = editMatch[1];
      const recurso = getById(id);
      if (recurso) {
        renderForm(app, recurso);
        setActiveLink('#/recursos');
      } else {
        showToast('Recurso no encontrado', 'error');
        window.location.hash = '#/recursos';
      }
      return;
    }

    const activeHash = routes[hash] ? hash : '#/';
    const render = routes[activeHash];

    render(app);
    setActiveLink(activeHash);
  };

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
  handleRoute();
}
