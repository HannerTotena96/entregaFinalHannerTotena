const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductManager {
  constructor() {
    this.filePath = productsFilePath;
  }

  // Leer productos
  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  // Agregar producto
  async addProduct(productData) {
    const products = await this.getProducts();
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      status: true,
      ...productData
    };

    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  // Actualizar producto
  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...updatedFields,
      id: products[index].id  // No se debe cambiar el ID
    };

    products[index] = updatedProduct;
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return updatedProduct;
  }

  // Eliminar producto
  async deleteProduct(id) {
    let products = await this.getProducts();
    const productToDelete = products.find(p => p.id == id);
    if (!productToDelete) return null;

    products = products.filter(p => p.id != id);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return productToDelete;
  }
}

module.exports = ProductManager;