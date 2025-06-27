function renderCarritoResumen() {
  const div = document.getElementById("carrito-resumen");
  if (!carrito.length) {
    div.innerHTML = `
      <div class="alert alert-info text-center">
        Tu carrito está vacío. <a href="productos.html" class="btn btn-sm btn-outline-primary ms-2">Ir al catálogo</a>
      </div>`;
    document.getElementById("form-pedido").innerHTML = "";
    return;
  }

  let total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  div.innerHTML = `
    <table class="table align-middle">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cant.</th>
          <th>Precio</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${carrito.map(p => `
          <tr>
            <td>${p.nombre}</td>
            <td>${p.cantidad}</td>
            <td>$${p.precio.toLocaleString()}</td>
            <td>$${(p.precio * p.cantidad).toLocaleString()}</td>
            <td><button class="btn btn-danger btn-sm btn-del" data-id="${p.id}">&times;</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="text-end">
      <strong>Total: $${total.toLocaleString()}</strong>
      <button class="btn btn-outline-danger btn-sm ms-2" id="vaciar-carro">Vaciar carrito</button>
    </div>
  `;
  document.getElementById("form-pedido").innerHTML = `
    <button class="btn btn-success" id="terminar-pedido">Terminar pedido</button>
  `;

  div.querySelectorAll(".btn-del").forEach(btn =>
    btn.onclick = () => {
      removeFromCart(Number(btn.dataset.id));
      renderCarritoResumen();
    }
  );
  const btnVaciar = div.querySelector("#vaciar-carro");
  if (btnVaciar) btnVaciar.onclick = () => {
    clearCart();
    renderCarritoResumen();
  };
  const btnTerminar = document.getElementById("terminar-pedido");
  if (btnTerminar) btnTerminar.onclick = finalizarPedido;
}

function finalizarPedido() {
  const codigo = "PS-" + Math.floor(1000 + Math.random() * 9000);
  const fecha = new Date().toLocaleString();
  const orden = {
    codigo,
    fecha,
    carrito: [...carrito], 
    total: carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
  };

  let ordenes = JSON.parse(localStorage.getItem("ordenesPulga")) || [];
  ordenes.push(orden);
  localStorage.setItem("ordenesPulga", JSON.stringify(ordenes));

  clearCart();
  document.getElementById("form-pedido").innerHTML = `
    <div class="alert alert-success text-center">
      ¡Pedido realizado con éxito!<br>
      Tu código de seguimiento es: <strong>${codigo}</strong><br>
      <a href="seguimiento.html" class="btn btn-primary mt-3">Seguir mi pedido</a>
    </div>
  `;
  document.getElementById("carrito-resumen").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", renderCarritoResumen);
