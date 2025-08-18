import { el, clear, money } from "../ui/View.js";

const LS_ORDERS = "ordenesPulga";

export function mountCart({ inventory, cart, onCartChange }) {
  const resumen = document.getElementById("carrito-resumen");
  const form = document.getElementById("form-pedido");
  if (!resumen || !form) return;

  function render() {
    clear(resumen);
    clear(form);

    if (cart.isEmpty()) {
      resumen.appendChild(
        el("div", { class:"alert alert-info text-center" },
          "Tu carrito está vacío. ",
          el("a", { href:"productos.html", class:"btn btn-sm btn-outline-primary ms-2" }, "Ir al catálogo")
        )
      );
      return;
    }

    const tbody = el("tbody");
    let total = 0;

    cart.entries().forEach(([id, qty]) => {
      const p = inventory.get(id);
      if (!p) return;
      const subtotal = p.precio * qty;
      total += subtotal;

      const input = el("input", {
        type: "number", min: "1", max: String(p.stock), value: String(qty),
        class:"form-control form-control-sm", style:"width:80px;",
        onChange: () => {
          const v = Math.max(1, Math.min(Number(input.value)||1, p.stock));
          input.value = String(v);
          cart.update(p.id, v, p.stock);
          onCartChange();
          render();
        }
      });

      const tr = el("tr", {},
        el("td", {}, p.nombre),
        el("td", {}, input),
        el("td", {}, money(p.precio)),
        el("td", {}, money(subtotal)),
        el("td", {},
          el("button", { class:"btn btn-danger btn-sm", onClick:()=>{ cart.remove(p.id); onCartChange(); render(); } }, "×")
        )
      );
      tbody.appendChild(tr);
    });

    const table = el("table", { class:"table align-middle" },
      el("thead", {},
        el("tr", {},
          el("th", {}, "Producto"),
          el("th", {}, "Cant."),
          el("th", {}, "Precio"),
          el("th", {}, "Total"),
          el("th", {}, "")
        )
      ),
      tbody
    );

    const footer = el("div", { class:"text-end" },
      el("strong", {}, `Total: ${money(total)}`),
      el("button", { class:"btn btn-outline-danger btn-sm ms-2", onClick:()=>{ cart.clear(); onCartChange(); render(); } }, "Vaciar carrito")
    );

    resumen.appendChild(table);
    resumen.appendChild(footer);

    form.appendChild(
      el("button", { class:"btn btn-success", onClick: finalizarPedido }, "Terminar pedido")
    );
  }

  function finalizarPedido(e) {
    e?.preventDefault();
    const codigo = "PS-" + Math.floor(1000 + Math.random() * 9000);
    const fecha = new Date().toLocaleString();

    const detalle = cart.entries().map(([id, qty]) => {
      const p = inventory.get(id);
      return { id, nombre: p?.nombre || "?", precio: p?.precio || 0, cantidad: qty };
    });

    const total = detalle.reduce((s, it) => s + it.precio * it.cantidad, 0);

    detalle.forEach(it => inventory.decreaseStock(it.id, it.cantidad));

    const orden = { codigo, fecha, carrito: detalle, total };
    const prev = JSON.parse(localStorage.getItem(LS_ORDERS) || "[]");
    prev.push(orden);
    localStorage.setItem(LS_ORDERS, JSON.stringify(prev));

    cart.clear();
    onCartChange();

    clear(form);
    clear(resumen);
    form.appendChild(
      el("div", { class:"alert alert-success text-center" },
        el("div", { class:"mb-2", text:"¡Pedido realizado con éxito!" }),
        el("div", {}, "Tu código de seguimiento es: ", el("strong", {}, codigo)),
        el("div", {}, el("a", { href:"seguimiento.html", class:"btn btn-primary mt-3" }, "Seguir mi pedido"))
      )
    );

    const agotados = inventory.all().filter(p => p.isOutOfStock);
    if (agotados.length) {
      document.body.prepend(
        el("div", { class:"alert alert-warning", role:"alert" },
          `Sin stock: ${agotados.map(a=>a.nombre).join(", ")}`
        )
      );
    }
  }

  render();
}
