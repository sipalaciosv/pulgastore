const DUMMY_BASE = "https://dummyjson.com";

export const ExternalAPI = {
  async searchProductByName(name) {
    const url = `${DUMMY_BASE}/products/search?q=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`DummyJSON HTTP ${res.status}`);
    const data = await res.json();
    return data.products || [];
  },

  async getProductById(id) {
    const res = await fetch(`${DUMMY_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`DummyJSON HTTP ${res.status}`);
    return res.json();
  },

  async getTopProducts(limit = 6) {
    const res = await fetch(`${DUMMY_BASE}/products?limit=${limit}`);
    if (!res.ok) throw new Error(`DummyJSON HTTP ${res.status}`);
    const data = await res.json(); 
    return data.products || [];
  }
};
