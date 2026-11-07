import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'devshelf:recursos';

// Obtiene todos los recursos de localStorage o un arreglo vacío ante ausencia o error
export function getAll() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Devuelve el recurso con ese id usando find, o null si no existe
export function getById(id) {
  const resources = getAll();
  return resources.find((item) => item.id === id) || null;
}

// Crea y almacena un nuevo recurso asignándole id y fechaCreacion, retornando el objeto creado
export function create(data) {
  const resources = getAll();
  const newResource = {
    ...data,
    id: uuidv4(),
    fechaCreacion: new Date().toISOString()
  };
  resources.push(newResource);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  return newResource;
}

// Busca el índice con findIndex, actualiza combinando datos y conservando id y fechaCreacion
export function update(id, data) {
  const resources = getAll();
  const index = resources.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const recursoActual = resources[index];
  const recursoActualizado = {
    ...recursoActual,
    ...data,
    id: recursoActual.id,
    fechaCreacion: recursoActual.fechaCreacion
  };

  resources[index] = recursoActualizado;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  return recursoActualizado;
}

// Busca el índice con findIndex; si existe elimina con splice, guarda y devuelve true, si no false
export function remove(id) {
  const resources = getAll();
  const index = resources.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  resources.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  return true;
}

// Calcula estadísticas del catálogo: total, favoritos (vía filter) y temas distintos (vía Set)
export function getStats() {
  const resources = getAll();
  const total = resources.length;
  const favoritos = resources.filter((resource) => Boolean(resource.favorito)).length;
  const temas = new Set(resources.map((resource) => resource.tema).filter(Boolean)).size;

  return { total, favoritos, temas };
}
