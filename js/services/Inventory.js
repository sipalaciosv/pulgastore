import { Product } from "../models/Product.js";
import { ExternalAPI } from "./ExternalAPI.js";


const LS_INV_KEY = "pulga_inventory_v1";
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export class Inventory {
  #products = new Map();


  async load(url) {
    const cached = JSON.parse(localStorage.getItem(LS_INV_KEY) || "null");
    if (cached && Array.isArray(cached)) {
    cached.forEach(p => this.#products.set(Number(p.id), new Product(p)));
    return;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    data.forEach(p => this.#products.set(Number(p.id), new Product(p)));
    this.save();
  }


  save() {
    const arr = Array.from(this.#products.values()).map(p => ({...p}));
    localStorage.setItem(LS_INV_KEY, JSON.stringify(arr));
  }


  all() { return Array.from(this.#products.values()); }
  get(id) { return this.#products.get(Number(id)); }


  nextId() {
    const ids = this.all().map(p => p.id);
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }


  create(input) {
    const id = this.nextId();
    const prod = new Product({ ...input, id });
    this.#products.set(id, prod);
    this.save();
    return prod;
  }


  update(id, patch) {
    const prev = this.get(id);
    if (!prev) return null;
    const merged = new Product({ ...prev, ...patch, id: Number(id) });
    this.#products.set(Number(id), merged);
    this.save();
    return merged;
  }


  remove(id) {
    this.#products.delete(Number(id));
    this.save();
  }


  decreaseStock(id, qty) {
    const p = this.get(id);
    if (!p) return;
    p.stock = Math.max(0, p.stock - qty);
    this.save();
  }

  async verifyStockAsync(id, qty) {
    await delay(300); 
    const p = this.get(id);
    if (!p) throw new Error("Producto no encontrado");
    return p.stock >= qty; 
  }

  async decreaseStockAsync(id, qty) {
    await delay(500); 
    const p = this.get(id);
    if (!p) throw new Error("Producto no encontrado");
    if (p.stock < qty) {
      return { ok: false, reason: "not_enough", current: p.stock };
    }
    p.stock = Math.max(0, p.stock - qty);
    this.save();
    return { ok: true, newStock: p.stock };
  }
 async refreshFromExternal() {
  for (const p of this.all()) {
    try {
      let ext = null;

      if (p.externalId != null) {
        ext = await ExternalAPI.getProductById(Number(p.externalId));
      } else {
        const results = await ExternalAPI.searchProductByName(p.nombre);
        ext = results[0] || null;
      }

      if (!ext) continue;

      this.update(p.id, {
        nombre: ext.title,                                 
        precio: Number(ext.price) || p.precio,
        stock: Number(ext.stock) || p.stock,
        categoria: ext.category || p.categoria,
        descripcion: ext.description || p.descripcion,
        etiquetas: Array.isArray(ext.tags) ? ext.tags : (p.etiquetas || []),
        imagen: ext.thumbnail || p.imagen,
        externalId: Number(ext.id),                         
        lastSync: new Date().toISOString()
      });
    } catch {
      console.warn(`No se pudo actualizar el producto ID ${p.id} (${p.nombre}) desde la API externa.`);
      await delay(200);
    }
  }
  this.save();
}

  async importExternalProducts(limit = 6) {
    const incoming = await ExternalAPI.getTopProducts(limit);
    let added = 0, updated = 0;

    const byExternalId = new Map(
      this.all().filter(p => p.externalId != null).map(p => [Number(p.externalId), p])
    );

    incoming.forEach(src => {
      const map = {
        nombre: src.title,
        precio: Number(src.price) || 0,
        categoria: src.category || "",
        stock: Number(src.stock) || 0,
        descripcion: src.description || "",
        etiquetas: Array.isArray(src.tags) ? src.tags : [],
        imagen: src.thumbnail || (Array.isArray(src.images) ? src.images[0] : ""),
        externalId: Number(src.id),
        lastSync: new Date().toISOString()
      };

      const exists = byExternalId.get(Number(src.id));
      if (exists) {
        this.update(exists.id, map);
        updated++;
      } else {
        this.create(map);
        added++;
      }
    });

    return { added, updated };
  }
}