document.getElementById("form-seguimiento").addEventListener("submit", function(e) {
  e.preventDefault();
  const codigo = document.getElementById("codigo-seguimiento").value.trim().toUpperCase();
  if (!codigo) return;

  let ordenes = JSON.parse(localStorage.getItem("ordenesPulga")) || [];
  let orden = ordenes.find(o => o.codigo === codigo);

  const resultado = document.getElementById("resultado-seguimiento");
  if (!orden) {
    resultado.innerHTML = `
      <div class="alert alert-warning text-center">
        No se encontró ningún pedido con ese código. Revisa si lo escribiste bien.
      </div>
    `;
    return;
  }

  let estado = "En preparación";
  let html = `
    <div class="alert alert-success">
      <strong>¡Pedido encontrado!</strong><br>
      <b>Código:</b> ${orden.codigo}<br>
      <b>Fecha:</b> ${orden.fecha}<br>
      <b>Total:</b> $${orden.total.toLocaleString()}<br>
      <b>Estado:</b> ${estado}<br>
      <hr>
      <b>Detalle:</b>
      <ul>
        ${orden.carrito.map(p => `
          <li>${p.cantidad} x ${p.nombre} ($${p.precio.toLocaleString()} c/u)</li>
        `).join("")}
      </ul>
    </div>
  `;
  resultado.innerHTML = html;
});
