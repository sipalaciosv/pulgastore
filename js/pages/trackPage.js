import { el, clear, money } from "../ui/View.js";

export function mountTrack() {
  const form = document.getElementById("form-seguimiento");
  const result = document.getElementById("resultado-seguimiento");
  if (!form || !result) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cod = document.getElementById("codigo-seguimiento").value.trim().toUpperCase();
    const ordenes = JSON.parse(localStorage.getItem("ordenesPulga") || "[]");
    const o = ordenes.find(x => x.codigo === cod);
    clear(result);

    if (!o) {
      result.appendChild(
        el("div", { class:"alert alert-warning text-center", text:"No se encontró ningún pedido con ese código. Revisa si lo escribiste bien." })
      );
      return;
    }

    const ul = el("ul");
    o.carrito.forEach(it => {
      ul.appendChild(el("li", {}, `${it.cantidad} x ${it.nombre} (${money(it.precio)} c/u)`));
    });

    result.appendChild(
      el("div", { class:"alert alert-success" },
        el("strong", {}, "¡Pedido encontrado!"), el("br"),
        el("b", {}, "Código: "), o.codigo, el("br"),
        el("b", {}, "Fecha: "), o.fecha, el("br"),
        el("b", {}, "Total: "), money(o.total), el("br"),
        el("b", {}, "Estado: "), "En preparación", el("hr"),
        el("b", {}, "Detalle:"), ul
      )
    );
  });
}
