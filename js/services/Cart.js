const LS_CART_KEY = "pulga_cart_v1";

export class Cart {
  #items = new Map(); 

  constructor() {
    const raw = JSON.parse(localStorage.getItem(LS_CART_KEY) || "null");
    if (raw && Array.isArray(raw)) raw.forEach(([id, q]) => this.#items.set(Number(id), Number(q)));
  }

  save() {
    const arr = Array.from(this.#items.entries());
    localStorage.setItem(LS_CART_KEY, JSON.stringify(arr));
  }

  totalCount() {
    let s = 0; for (const [,q] of this.#items) s += q; return s;
  }

  entries() { return Array.from(this.#items.entries()); } // [[id, qty], ...]

  add(id, qty, maxStock) {
    const prev = this.#items.get(id) || 0;
    const next = Math.min(prev + qty, maxStock);
    if (next <= 0) this.#items.delete(id); else this.#items.set(id, next);
    this.save();
  }

  update(id, qty, maxStock) {
    const next = Math.max(0, Math.min(qty, maxStock));
    if (next === 0) this.#items.delete(id); else this.#items.set(id, next);
    this.save();
  }

  remove(id) { this.#items.delete(id); this.save(); }
  clear() { this.#items.clear(); this.save(); }
  isEmpty() { return this.#items.size === 0; }

  total(inventoryGet) {
    let t = 0;
    for (const [id, qty] of this.#items) {
      const p = inventoryGet(id);
      if (p) t += p.precio * qty;
    }
    return t;
  }
}
