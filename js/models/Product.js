export class Product {
  constructor({id, nombre, precio, imagen, categoria, stock, descripcion}) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen || "";
    this.categoria = categoria || "";
    this.stock = Number(stock) || 0;
    this.descripcion = descripcion || "";
  }
  get isOutOfStock() { return this.stock <= 0; }
  get stockLabel() {
    if (this.stock <= 0) return "Agotado";
    if (this.stock === 1) return "¡Último!";
    if (this.stock < 4) return `Quedan ${this.stock}`;
    return "";
  }
}
