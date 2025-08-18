import { Product } from "../models/Product.js";

const LS_INV_KEY = "pulga_inventory_v1";

export class Inventory {
  #products = new Map();

  async load(url) {
    const cached = JSON.parse(localStorage.getItem(LS_INV_KEY) || "null");
    if (cached && Array.isArray(cached)) {
      cached.forEach(p => this.#products.set(p.id, new Product(p)));
      return;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    data.forEach(p => this.#products.set(p.id, new Product(p)));
    this.save();
  }

  save() {
    const arr = Array.from(this.#products.values()).map(p => ({...p}));
    localStorage.setItem(LS_INV_KEY, JSON.stringify(arr));
  }

  all() { return Array.from(this.#products.values()); }
  get(id) { return this.#products.get(Number(id)); }

  decreaseStock(id, qty) {
    const p = this.get(id);
    if (!p) return;
    p.stock = Math.max(0, p.stock - qty);
    this.save();
  }
}
