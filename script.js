/* ===== Estado ===== */
const CLAVE_FAV = 'vistazo_favoritos';
let noticias = [];
let categoriaActual = 'todas';
let idDetalle = null;

const CATEGORIAS = {
  educacion:  { clase: 'cat-edu',  nombre: 'Educación' },
  tecnologia: { clase: 'cat-tech', nombre: 'Tecnología' },
  turismo:    { clase: 'cat-tur',  nombre: 'Turismo' },
  comercio:   { clase: 'cat-com',  nombre: 'Comercio' }
};

/* ===== Favoritos (localStorage) ===== */
function leerFavoritos() {
  try { return JSON.parse(localStorage.getItem(CLAVE_FAV)) || []; }
  catch { return []; }
}
function esFavorito(id) { return leerFavoritos().includes(String(id)); }
function alternarFavorito(id) {
  const favs = leerFavoritos();
  const i = favs.indexOf(String(id));
  if (i >= 0) favs.splice(i, 1); else favs.push(String(id));
  localStorage.setItem(CLAVE_FAV, JSON.stringify(favs));
}

/* ===== Navegación entre pantallas ===== */
function irA(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}

/* ===== Render de tarjetas ===== */
function tarjeta(n, claseExtra = '', claseContenedor = 'card') {
  const cat = CATEGORIAS[n.categoria] || { clase: 'cat-tech', nombre: n.categoria };
  const fav = esFavorito(n.id);
  return `
    <article class="${claseContenedor} ${claseExtra}">
      <div class="card-img" style="background-image:url('${n.imagen || ''}')">
        <span class="cat-pill ${cat.clase}">${cat.nombre}</span>
      </div>
      <div class="card-body">
        <h3>${n.titulo}</h3>
        <p>${n.descripcion}</p>
        <div class="card-foot">
          <span class="link-more" data-ver="${n.id}">Ver más →</span>
          <span class="fav-icon ${fav ? 'active' : ''}" data-fav="${n.id}" title="Favorito">${fav ? '♥' : '♡'}</span>
        </div>
      </div>
    </article>`;
}

function renderHome() {
  const destacadas = noticias.slice(0, 5);
  document.getElementById('home-cards-grid').innerHTML = destacadas
    .map((n, i) => tarjeta(n, i === 0 ? 'card-feature' : ''))
    .join('');
}

function renderListado() {
  const lista = categoriaActual === 'todas'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaActual);

  document.getElementById('listado-contador').textContent =
    `${lista.length} ${lista.length === 1 ? 'noticia' : 'noticias'}`;

  document.getElementById('listado-grid').innerHTML = lista.length
    ? lista.map(n => tarjeta(n, '', 'list-card')).join('')
    : '<p class="empty-state">No hay noticias en esta categoría.</p>';
}

function mostrarDetalle(id) {
  const n = noticias.find(x => String(x.id) === String(id));
  if (!n) return;
  idDetalle = n.id;

  const cat = CATEGORIAS[n.categoria] || { clase: 'cat-tech', nombre: n.categoria };
  const fav = esFavorito(n.id);
  const relacionadas = noticias
    .filter(x => x.categoria === n.categoria && x.id !== n.id)
    .slice(0, 3);

  document.getElementById('detalle-contenido').innerHTML = `
    <div>
      <div class="breadcrumb">
        <a data-goto="home">Inicio</a> / <a data-goto="listado">Explorar</a> / ${cat.nombre}
      </div>
      <div class="detalle-img" style="background-image:url('${n.imagen || ''}')">
        <span class="cat-pill ${cat.clase}">${cat.nombre}</span>
      </div>
      <h1>${n.titulo}</h1>
      <div class="meta-row">
        ${n.autor ? `<span>Por ${n.autor}</span>` : ''}
        ${n.fecha ? `<span>${n.fecha}</span>` : ''}
      </div>
      <div class="detalle-body"><p>${n.contenido || n.descripcion}</p></div>
      <div class="detalle-actions">
        <button type="button" class="btn btn-primary" data-fav="${n.id}">
          ${fav ? '♥ Quitar de favoritos' : '♡ Guardar en favoritos'}
        </button>
        <button type="button" class="btn btn-ghost" data-goto="contacto">Contactar</button>
      </div>
    </div>
    <aside>
      <div class="side-box">
        <h4>¿Tienes una historia similar?</h4>
        <p>Compártela con nosotros desde la página de contacto.</p>
      </div>
      <div class="side-box">
        <h4>Noticias relacionadas</h4>
        ${relacionadas.length
          ? relacionadas.map(r => `<p class="related-item" data-ver="${r.id}">${r.titulo}</p>`).join('')
          : '<p>No hay noticias relacionadas.</p>'}
      </div>
    </aside>`;

  irA('detalle');
}

function renderTodo() {
  renderHome();
  renderListado();
  if (idDetalle !== null && document.getElementById('detalle').classList.contains('active')) {
    mostrarDetalle(idDetalle);
  }
}

/* ===== Clics (un solo listener para toda la página) ===== */
document.addEventListener('click', e => {
  const goto = e.target.closest('[data-goto]');
  if (goto) { irA(goto.dataset.goto); return; }

  const ver = e.target.closest('[data-ver]');
  if (ver) { mostrarDetalle(ver.dataset.ver); return; }

  const fav = e.target.closest('[data-fav]');
  if (fav) {
    alternarFavorito(fav.dataset.fav);
    renderTodo();
    return;
  }

  const chip = e.target.closest('.filter-chip');
  if (chip) {
    categoriaActual = chip.dataset.cat;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    renderListado();
  }
});

/* ===== Carga de noticias ===== */
fetch('data/news.json')
  .then(r => r.json())
  .then(datos => {
    noticias = datos;
    renderHome();
    renderListado();
  })
  .catch(() => {
    document.getElementById('listado-contador').textContent =
      'No se pudieron cargar las noticias.';
  });

/* ===== Formulario de contacto + toast ===== */
/* ===== Formulario de contacto + toast ===== */
const btnEnviar = document.getElementById('btn-enviar');
let toastTimer;

const campos = {
  nombre: document.getElementById('nombre'),
  correo: document.getElementById('correo'),
  asunto: document.getElementById('asunto'),
  mensaje: document.getElementById('mensaje')
};

function marcarError(input, hayError) {
  input.closest('.field').classList.toggle('error', hayError);
}

function formularioValido() {
  const nombreOk = campos.nombre.value.trim() !== '';
  const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.correo.value.trim());
  const mensajeOk = campos.mensaje.value.trim() !== '';

  marcarError(campos.nombre, !nombreOk);
  marcarError(campos.correo, !correoOk);
  marcarError(campos.mensaje, !mensajeOk);

  return nombreOk && correoOk && mensajeOk;
}

function mostrarToast(texto) {
  let t = document.getElementById('toast-exito');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast-exito';
    document.body.appendChild(t);
  }

  t.hidden = false;
  t.textContent = '✓ ' + texto;
  Object.assign(t.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1F6F6B',
    color: '#fff',
    padding: '14px 22px',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 6px 24px rgba(0,0,0,.25)',
    zIndex: '9999',
    transition: 'opacity .3s ease',
    opacity: '1',
    display: 'block'
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => { t.style.display = 'none'; }, 300);
  }, 3500);
}

btnEnviar.addEventListener('click', () => {
  if (!formularioValido()) return;
  mostrarToast('Tu mensaje fue enviado correctamente.');
  Object.values(campos).forEach(c => (c.value = ''));
});

['nombre', 'correo', 'mensaje'].forEach(k => {
  campos[k].addEventListener('input', () => marcarError(campos[k], false));
});