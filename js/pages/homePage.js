import { el, clear, money } from "../ui/View.js";

export function mountHome({ inventory }) {
  const cont = document.getElementById("destacados");
  if (!cont) return;
  const destacados = inventory.all().slice(0, 4);

  clear(cont);
  const frag = document.createDocumentFragment();

  destacados.forEach(p => {
    const card = el("div", { class: "col-12 col-sm-6 col-lg-3 mb-4" },
      el("div", { class: "card h-100 text-center shadow-sm", style: "border:none;" },
        el("img", { src: p.imagen, alt: p.nombre, class: "card-img-top", style: "object-fit:cover;height:180px;border-radius:16px 16px 0 0;" }),
        el("div", { class: "card-body" },
          el("h5", { class: "card-title", style:"color:var(--color-3);", text: p.nombre }),
          el("p", { class: "card-text mb-2", style:"color:var(--color-2);font-size:1.05em;", text: money(p.precio) }),
          el("a", { href: "productos.html", class: "btn btn-cta", style: "padding:0.4em 1.2em;" }, "Ver más")
        )
      )
    );
    frag.appendChild(card);
  });

  cont.appendChild(frag);
}
