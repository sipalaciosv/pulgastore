window.addEventListener("DOMContentLoaded", () => {
  const wrap = document.createElement("div");
  wrap.id = "loader-bg";
  wrap.style.cssText = "position:fixed;inset:0;z-index:1999;display:flex;justify-content:center;align-items:center;background:rgba(246,252,255,0.96)";
  const inner = document.createElement("div");
  inner.className = "text-center";
  const img = document.createElement("img");
  img.src = "img/logo.svg";
  img.alt = "Pulga Loader";
  img.className = "loader-logo";
  const txt = document.createElement("div");
  txt.style.cssText = "color:var(--color-2);margin-top:1em;font-weight:700;";
  txt.textContent = "Cargando...";
  inner.appendChild(img); inner.appendChild(txt);
  wrap.appendChild(inner);
  document.body.prepend(wrap);

  setTimeout(() => { wrap.style.display = "none"; }, 800);
});
