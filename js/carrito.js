const LS_KEY = "carritoPulgaStore";
let carrito = cargarCarrito();

function cargarCarrito() {
  return JSON.parse(localStorage.getItem(LS_KEY)) || [];
}

function guardarCarrito() {
  localStorage.setItem(LS_KEY, JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function addToCart(producto) {
  let item = carrito.find(p => p.id === producto.id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
}

function removeFromCart(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
}

function clearCart() {
  carrito = [];
  guardarCarrito();
}

function actualizarBadgeCarrito() {
  const badge = document.getElementById('carrito-badge');
  if (badge) {
    const total = carrito.reduce((s, p) => s + p.cantidad, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);
