import { Inventory } from "./services/Inventory.js";
import { Cart } from "./services/Cart.js";
import { mountHome } from "./pages/homePage.js";
import { mountCatalog } from "./pages/catalogPage.js";
import { mountCart } from "./pages/cartPage.js";
import { mountTrack } from "./pages/trackPage.js";

function updateBadge(cart) {
  const badge = document.getElementById("carrito-badge");
  if (!badge) return;
  const total = cart.totalCount();
  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block" : "none";
}

window.addEventListener("DOMContentLoaded", async () => {
  const inventory = new Inventory();
  await inventory.load("data/productos.json");

  const cart = new Cart();
  updateBadge(cart);

  const onCartChange = () => updateBadge(cart);

  mountHome({ inventory });
  mountCatalog({ inventory, cart, onCartChange });
  mountCart({ inventory, cart, onCartChange });
  mountTrack();
});
