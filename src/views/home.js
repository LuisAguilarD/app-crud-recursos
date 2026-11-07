import { getStats } from '../services/storage.js';

export function renderHome(app) {
  const stats = getStats();

  app.innerHTML = `
    <div class="container">
      <section class="hero">
        <h1>Tu biblioteca de recursos para aprender a programar</h1>
        <p>Guarda, clasifica y consulta tus enlaces de estudio favoritos en un solo lugar.</p>
        <a href="#/recursos" class="btn btn-primary">Empezar</a>
      </section>

      <section class="cards-grid">
        <div class="card stat-card">
          <span class="stat-number">${stats.total}</span>
          <h3>Recursos guardados</h3>
        </div>
        <div class="card stat-card">
          <span class="stat-number">${stats.favoritos}</span>
          <h3>Favoritos</h3>
        </div>
        <div class="card stat-card">
          <span class="stat-number">${stats.temas}</span>
          <h3>Temas</h3>
        </div>
      </section>

      <section class="cards-grid">
        <div class="card">
          <h3>Guardar</h3>
          <p>Almacena enlaces a videos, artículos, cursos y documentación fácilmente.</p>
        </div>
        <div class="card">
          <h3>Organizar</h3>
          <p>Clasifica tus recursos por tipo, tema y nivel para encontrarlos rápido.</p>
        </div>
        <div class="card">
          <h3>Encontrar</h3>
          <p>Consulta tu catálogo personalizado y marca como favoritos los más útiles.</p>
        </div>
      </section>
    </div>
  `;
}
