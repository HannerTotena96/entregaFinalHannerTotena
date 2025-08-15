const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Products');

// Crear un carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', cart: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al crear carrito' });
  }
});

// Ver un carrito con populate
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al obtener el carrito' });
  }
});

// Agregar producto al carrito (suma si ya existe)
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);

    if (!cart || !product) return res.status(404).json({ status: 'error', error: 'Carrito o producto no encontrado' });

    const existingProduct = cart.products.find(p => p.product.equals(pid));
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al agregar producto' });
  }
});

// Eliminar UNA UNIDAD del producto (o todo si hay solo una)
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1)
      return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    return res.json({ status: 'success', message: 'Producto actualizado', cart });
  } catch (error) {
    console.error("❌ Error al eliminar producto del carrito:", error);
    res.status(500).json({ status: 'error', message: 'Error del servidor' });
  }
});

// Actualizar todo el carrito (reemplaza por completo la lista)
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al actualizar carrito' });
  }
});

// Actualizar cantidad de un solo producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

    const productInCart = cart.products.find(p => p.product.equals(pid));
    if (!productInCart)
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });

    productInCart.quantity = quantity;
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al actualizar cantidad' });
  }
});

module.exports = router;
