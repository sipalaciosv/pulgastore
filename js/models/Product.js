export class Product {
  constructor({id, nombre, precio, imagen, categoria, stock, descripcion, etiquetas, externalId, lastSync}) {
    this.id = Number(id);
    this.nombre = nombre?.trim() || "";
    this.precio = Number(precio) || 0;
    this.imagen = imagen || "";
    this.categoria = categoria || "";
    this.stock = Number(stock) || 0;
    this.descripcion = descripcion || "";
    this.etiquetas = Array.isArray(etiquetas)
      ? etiquetas.map(e => String(e).trim()).filter(Boolean)
      : (etiquetas ? [String(etiquetas).trim()] : []);

    this.externalId = externalId ?? null;
    this.lastSync = lastSync ?? null; 
  }

  get isOutOfStock() { return this.stock <= 0; }
  get stockLabel() {
    if (this.stock <= 0) return "Agotado";
    if (this.stock === 1) return "¡Último!";
    if (this.stock < 4) return `Quedan ${this.stock}`;
    return "";
  }
}
