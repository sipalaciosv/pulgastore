document.addEventListener('DOMContentLoaded', async () => {
  const resp = await fetch('data/productos.json');
  const productos = await resp.json();
  const destacados = productos.slice(0, 4);
  const cont = document.getElementById('destacados');
  if (cont) {
    destacados.forEach(prod => {
      cont.innerHTML += `
        <div class="col-12 col-sm-6 col-lg-3 mb-4">
          <div class="card h-100 text-center shadow-sm" style="border: none;">
            <img src="${prod.imagen}" alt="${prod.nombre}" class="card-img-top" style="object-fit:cover; height:180px; border-radius: 16px 16px 0 0;">
            <div class="card-body">
              <h5 class="card-title" style="color:var(--color-3);">${prod.nombre}</h5>
              <p class="card-text mb-2" style="color:var(--color-2);font-size:1.05em;">$${prod.precio.toLocaleString('es-CL')}</p>
              <a href="productos.html" class="btn btn-cta" style="padding:0.4em 1.2em;">Ver más</a>
            </div>
          </div>
        </div>
      `;
    });
  }
});
