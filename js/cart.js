// cart.js
const CART_KEY = 'carritoPulgaStore';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Agregar producto al carrito
function addToCart(producto) {
  let cart = getCart();
  let existe = cart.find(item => item.id === producto.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    cart.push({...producto, cantidad: 1});
  }
  saveCart(cart);
  updateCartBadge();
}

// Quitar producto del carrito
function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartBadge();
}

// Cambiar cantidad (usado en pedidos si quieres)
function updateQty(id, cantidad) {
  let cart = getCart();
  let prod = cart.find(item => item.id === id);
  if (prod) prod.cantidad = cantidad;
  saveCart(cart);
  updateCartBadge();
}

// Limpiar carrito
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

// Actualiza el badge del carrito en el navbar
function updateCartBadge() {
  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.cantidad, 0);
  let badge = document.getElementById('carrito-badge');
  if (badge) badge.textContent = total;
}

// Ejecutar siempre al cargar la página
document.addEventListener('DOMContentLoaded', updateCartBadge);
