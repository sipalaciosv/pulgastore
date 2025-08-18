export const el = (tag, props = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
  if (k === "class") {
    node.className = v;
  } else if (k === "text") {
    node.textContent = v;
  } else if (k.startsWith("on") && typeof v === "function") {
    node.addEventListener(k.slice(2).toLowerCase(), v);
  } else {
    if (k in node) {
      node[k] = v;
    } else if (v !== null && v !== undefined) {
      node.setAttribute(k, v);
    }
  }
}

  children.forEach(ch => {
    if (ch == null) return;
    if (Array.isArray(ch)) ch.forEach(c => c && node.appendChild(c));
    else if (typeof ch === "string" || typeof ch === "number") node.appendChild(document.createTextNode(String(ch)));
    else node.appendChild(ch);
  });
  return node;
};

export const clear = (root) => { while (root.firstChild) root.removeChild(root.firstChild); };

export const money = (n) => `$${Number(n).toLocaleString("es-CL")}`;
