const express = require('express');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Modelos y rutas
const Product = require('./models/Products');
const Cart = require('./models/Cart');
const productsRouter = require('./Routes/products.router');
const cartsRouter = require('./Routes/carts.router');

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Handlebars con helpers
const hbs = exphbs.create({
  helpers: {
    eq: (a, b) => a == b,
    range: (from, to) => {
      const result = [];
      for (let i = from; i <= to; i++) result.push(i);
      return result;
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Página inicial
app.get('/', (req, res) => res.render('categories'));
app.get('/categories', (req, res) => res.render('categories'));

// Vista por categoría
app.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const filtered = await Product.find({ category: { $regex: new RegExp(category, 'i') } }).lean();
    res.render('categoryProducts', { category, products: filtered });
  } catch (error) {
    res.status(500).send('Error al cargar productos por categoría');
  }
});

// Vista en tiempo real con WebSocket
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).send('Error al cargar productos en tiempo real');
  }
});

// Vista del carrito
app.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error al cargar el carrito');
  }
});

// Vista paginada de productos
app.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 6, sort, query } = req.query;

    const baseUrl = `http://localhost:${PORT}/api/products`;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (sort) queryParams.append("sort", sort);
    if (query) queryParams.append("query", query);

    const response = await fetch(`${baseUrl}?${queryParams}`);
    const data = await response.json();

    res.render('products', {
      products: data.payload,
      page: data.page,
      totalPages: data.totalPages,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      query,
      sort
    });
  } catch (error) {
    console.error("❌ Error al renderizar vista paginada", error);
    res.status(500).send("Error al cargar productos");
  }
});

// Ruta para agregar productos al carrito
const fixedCartId = '689d6b56ce1941e33823c12f';
app.post('/add-to-cart/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const cart = await Cart.findById(fixedCartId);
    const index = cart.products.findIndex(p => p.product.toString() === pid);

    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.redirect('back');
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    res.status(500).send('Error al agregar producto al carrito');
  }
});
// Vista individual del producto
app.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render('productDetail', { product });
  } catch (error) {
    console.error("Error al buscar producto:", error);
    res.status(500).send("Error interno");
  }
});
// WebSockets
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado por Socket.io');

  socket.on('new-product', async (product) => {
    await Product.create(product);
    const updatedProducts = await Product.find().lean();
    io.emit('products-updated', updatedProducts);
  });

  socket.on('delete-product', async (id) => {
    await Product.findByIdAndDelete(id);
    const updatedProducts = await Product.find().lean();
    io.emit('products-updated', updatedProducts);
  });
});

// Conexión MongoDB
mongoose.connect('mongodb+srv://hatotenap:admin123@cluster0.pgo8jci.mongodb.net/labstore')
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB', err));

// Levantar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
