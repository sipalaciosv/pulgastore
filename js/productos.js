let productos = [];
let productosPorPagina = 8;
let paginaActual = 1;
let categorias = new Set();

async function cargarProductos() {
  const resp = await fetch('data/productos.json');
  productos = await resp.json();
  renderCatalogo();
  renderCategorias();
}

function renderCatalogo() {
  const catalogo = document.getElementById('catalogo');
  let filtrados = filtrarProductos();
  let paginados = paginarProductos(filtrados);

  catalogo.innerHTML = "";
  if (paginados.length === 0) {
    catalogo.innerHTML = `<p class="text-center mt-4">No se encontraron productos.</p>`;
    return;
  }
  paginados.forEach(prod => {
    catalogo.innerHTML += `
      <div class="col-md-3 col-12 mb-4 d-flex">
        <div class="product-card w-100">
          <img class="product-img" src="${prod.imagen}" alt="${prod.nombre}">
          <div class="product-title">${prod.nombre}</div>
          <div class="product-desc">${prod.descripcion || ""}</div>
          <div class="product-price">$${prod.precio.toLocaleString()}</div>
          <button class="btn-add" data-id="${prod.id}">Agregar al carrito</button>
        </div>
      </div>
    `;
  });

  renderPaginacion(filtrados.length);
}

function filtrarProductos() {
  let texto = document.getElementById('buscador').value.toLowerCase();
  let categoria = document.getElementById('categoria').value;
  let orden = document.getElementById('orden').value;
  let filtrados = productos.filter(prod => 
    prod.nombre.toLowerCase().includes(texto) &&
    (categoria === "" || prod.categoria === categoria)
  );
  if (orden === "precio_asc") filtrados.sort((a, b) => a.precio - b.precio);
  if (orden === "precio_desc") filtrados.sort((a, b) => b.precio - a.precio);
  return filtrados;
}

function paginarProductos(lista) {
  let ini = (paginaActual - 1) * productosPorPagina;
  return lista.slice(ini, ini + productosPorPagina);
}

function renderPaginacion(totalFiltrados) {
  const paginacion = document.getElementById('paginacion');
  let totalPaginas = Math.ceil(totalFiltrados / productosPorPagina);
  paginacion.innerHTML = "";
  if (totalPaginas <= 1) return;
  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <button class="paginacion-btn${i === paginaActual ? " active" : ""}" data-pag="${i}">${i}</button>
    `;
  }

  document.querySelectorAll(".paginacion-btn").forEach(btn =>
    btn.onclick = () => {
      paginaActual = Number(btn.dataset.pag);
      renderCatalogo();
    }
  );
}

function renderCategorias() {
  categorias = new Set(productos.map(p => p.categoria));
  const select = document.getElementById('categoria');
  select.innerHTML = `<option value="">Todas las categorías</option>`;
  categorias.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}
toastr.options = {
  "closeButton": false,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "timeOut": "1400"
};

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  document.getElementById('buscador').addEventListener('input', () => {
    paginaActual = 1; renderCatalogo();
  });
  document.getElementById('categoria').addEventListener('change', () => {
    paginaActual = 1; renderCatalogo();
  });
  document.getElementById('orden').addEventListener('change', () => {
    paginaActual = 1; renderCatalogo();
  });
});
document.getElementById('catalogo').addEventListener('click', e => {
  if (e.target.classList.contains('btn-add')) {
    const id = Number(e.target.dataset.id);
    const prod = productos.find(p => p.id === id);
    addToCart(prod);
    e.target.textContent = "¡Agregado!";
    setTimeout(() => e.target.textContent = "Agregar al carrito", 800);
    toastr.success(`"${prod.nombre}" agregado al carrito`, '¡Éxito!');
  }
});
