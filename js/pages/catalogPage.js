import { el, clear, money } from "../ui/View.js";

export function mountCatalog({ inventory, cart, onCartChange }) {
  const $ = (id) => document.getElementById(id);
  const catalogo = $("catalogo");
  if (!catalogo) return;

  const buscador = $("buscador");
  const categoriaSel = $("categoria");
  const ordenSel = $("orden");
  const paginacion = $("paginacion");

  const cats = Array.from(new Set(inventory.all().map(p => p.categoria))).sort();
  clear(categoriaSel);
  categoriaSel.appendChild(el("option", { value: "", text: "Todas las categorías" }));
  cats.forEach(c => categoriaSel.appendChild(el("option", { value: c, text: c })));

  let paginaActual = 1;
  const porPagina = 8;

  function filtrar() {
    const q = (buscador.value || "").toLowerCase();
    const cat = categoriaSel.value || "";
    let list = inventory.all().filter(p =>
      p.nombre.toLowerCase().includes(q) && (cat === "" || p.categoria === cat)
    );
    if (ordenSel.value === "precio_asc")  list.sort((a,b)=>a.precio-b.precio);
    if (ordenSel.value === "precio_desc") list.sort((a,b)=>b.precio-a.precio);
    return list;
  }

  function render() {
    const list = filtrar();
    const ini = (paginaActual - 1) * porPagina;
    const page = list.slice(ini, ini + porPagina);

    clear(catalogo);
    const frag = document.createDocumentFragment();

    if (page.length === 0) {
      frag.appendChild(el("p", { class: "text-center mt-4", text: "No se encontraron productos." }));
    } else {
      page.forEach(p => {
        const btn = el("button",
          { class: "btn-add", disabled: p.isOutOfStock, onClick: () => {
              cart.add(p.id, 1, p.stock);
              onCartChange();
            }
          },
          p.isOutOfStock ? "Agotado" : "Agregar al carrito"
        );

        const stockSmall = el("small", { class: "text-muted", text: p.stockLabel });

        const card = el("div", { class: "col-md-3 col-12 mb-4 d-flex" },
          el("div", { class: "product-card w-100" },
            el("img", { class:"product-img", src:p.imagen, alt:p.nombre }),
            el("div", { class:"product-title", text:p.nombre }),
            el("div", { class:"product-desc",  text:p.descripcion }),
            el("div", { class:"product-price", text: money(p.precio) }),
            stockSmall,
            btn
          )
        );
        frag.appendChild(card);
      });
    }
    catalogo.appendChild(frag);

    clear(paginacion);
    const totalPag = Math.ceil(filtrar().length / porPagina);
    if (totalPag > 1) {
      const pf = document.createDocumentFragment();
      for (let i=1;i<=totalPag;i++){
        pf.appendChild(
          el("button", { class: `paginacion-btn${i===paginaActual?" active":""}`, onClick:()=>{paginaActual=i;render();} }, String(i))
        );
      }
      paginacion.appendChild(pf);
    }
  }

  buscador?.addEventListener("input", () => { paginaActual = 1; render(); });
  categoriaSel?.addEventListener("change", () => { paginaActual = 1; render(); });
  ordenSel?.addEventListener("change", () => { paginaActual = 1; render(); });

  render();
}
