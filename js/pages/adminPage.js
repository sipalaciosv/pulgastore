import { el, clear, money } from "../ui/View.js";

export function mountAdmin({ inventory }) {
  const root = document.getElementById("admin-root");
  if (!root) return;

  const form = document.getElementById("form-admin");
  const tbody = document.querySelector("#tabla-admin tbody");
  const btnSync = document.getElementById("btn-sync");
  const btnImport6 = document.getElementById("btn-import-6");

  const $ = (id) => document.getElementById(id);

  function formValues() {
    const rawTags = $("prod-etiquetas").value
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    return {
      id: $("prod-id").value ? Number($("prod-id").value) : null,
      nombre: $("prod-nombre").value,
      precio: Number($("prod-precio").value || 0),
      categoria: $("prod-categoria").value,
      stock: Number($("prod-stock").value || 0),
      descripcion: $("prod-descripcion").value,
      imagen: $("prod-imagen").value || "img/reloj.jpg",
      etiquetas: rawTags
    };
  }

  function setForm(p) {
    $("prod-id").value = p?.id ?? "";
    $("prod-nombre").value = p?.nombre ?? "";
    $("prod-precio").value = p?.precio ?? "";
    $("prod-categoria").value = p?.categoria ?? "";
    $("prod-stock").value = p?.stock ?? "";
    $("prod-descripcion").value = p?.descripcion ?? "";
    $("prod-imagen").value = p?.imagen ?? "";
    $("prod-etiquetas").value = (p?.etiquetas || []).join(", ");

    document.getElementById("form-admin").scrollIntoView({ behavior: "smooth", block: "start" });
    $("prod-nombre").focus();
    console.log("[ADMIN] Editando producto:", p?.id, p?.nombre);
  }
  async function handleSync() {
    btnSync.disabled = true;
    btnSync.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Sincronizando...`;
    try {
      await inventory.refreshFromExternal();
      renderTable();
      alert("Precios y stock actualizados desde la API.");
    } catch (e) {
      alert("No se pudo sincronizar. Revisa la consola/red.");
    } finally {
      btnSync.disabled = false;
      btnSync.innerHTML = `<i class="bi bi-cloud-arrow-down me-1"></i> Actualizar desde API`;
    }
  }
  
  btnSync?.addEventListener("click", handleSync);
btnImport6?.addEventListener("click", async () => {
  btnImport6.disabled = true;
  btnImport6.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Importando...`;
  try {
    const { added, updated } = await inventory.importExternalProducts(6);
    renderTable();
    alert(`Importación completa.\nNuevos: ${added}\nActualizados: ${updated}`);
  } catch (e) {
    console.error(e);
    alert("No se pudo importar. Revisa la consola/red.");
  } finally {
    btnImport6.disabled = false;
    btnImport6.innerHTML = `<i class="bi bi-plus-circle me-1"></i> Importar 6 de API`;
  }
});
  function renderTable() {
    clear(tbody);
    const frag = document.createDocumentFragment();
    inventory.all().forEach(p => {
      frag.appendChild(el("tr", {},
        el("td", {}, String(p.id)),
        el("td", {}, p.nombre),
        el("td", {}, p.descripcion),
        el("td", {}, money(p.precio)),
        el("td", {}, p.categoria),
        el("td", {}, String(p.stock)),
        el("td", {}, (p.etiquetas || []).map(t => `#${t}`).join(" ")),
        el("td", { class: "text-end" },
          el("button", { type:"button", class: "btn btn-sm btn-outline-primary me-2", title: "Editar",
            onClick: () => setForm(p)
          }, el("i", { class: "bi bi-pencil" })),
          el("button", { type:"button", class: "btn btn-sm btn-outline-danger", title: "Eliminar",
            onClick: () => {
              if (confirm(`¿Eliminar producto ${p.nombre}?`)) {
                inventory.remove(p.id);
                renderTable();
              }
            }
          }, el("i", { class: "bi bi-trash" }))
        )
      ));
    });
    tbody.appendChild(frag);
  }

  function limpiar() { setForm(null); }

  function renderTable() {
  clear(tbody);
  const frag = document.createDocumentFragment();
  inventory.all().forEach(p => {
    frag.appendChild(el("tr", {},
      el("td", {}, String(p.id)),
      el("td", {}, p.nombre),
      el("td", {}, p.descripcion),
      el("td", {}, money(p.precio)),
      el("td", {}, p.categoria),
      el("td", {}, String(p.stock)),
      el("td", {}, (p.etiquetas || []).map(t => `#${t}`).join(" ")),
      el("td", { class: "text-end" },
        el("button", {
            type: "button",
            class: "btn btn-sm btn-outline-primary me-2",
            title: "Editar",
            onClick: () => setForm(p)
          },
          el("i", { class: "bi bi-pencil" })
        ),
        el("button", {
            type: "button",
            class: "btn btn-sm btn-outline-danger",
            title: "Eliminar",
            onClick: () => {
              if (confirm(`¿Eliminar producto ${p.nombre}?`)) {
                inventory.remove(p.id);
                renderTable();
              }
            }
          },
          el("i", { class: "bi bi-trash" })
        )
      )
    ));
  });
  tbody.appendChild(frag);
}

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = formValues();
    if (v.id) {
      inventory.update(v.id, v);
    } else {
      inventory.create(v);
    }
    limpiar();
    renderTable();
  });

  document.getElementById("btn-limpiar").addEventListener("click", limpiar);

  renderTable();
}
