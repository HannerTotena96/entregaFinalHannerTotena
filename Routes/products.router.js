const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// GET /api/products?limit=10&page=2&sort=asc&query=categoría
router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    // Filtro base (si hay query se busca por categoría o disponibilidad)
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: { $regex: query, $options: 'i' } },
          { availability: { $regex: query, $options: 'i' } }
        ]
      };
    }

    // Opciones de paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };

    // Ordenamiento por precio si se especifica
    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    const result = await Product.paginate(filter, options);

    // Construir prevLink y nextLink
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildLink = (page) =>
      `${baseUrl}?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });

  } catch (error) {
    console.error('❌ Error en GET /api/products:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

module.exports = router;
