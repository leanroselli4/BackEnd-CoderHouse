const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const router = express.Router();

const PRODUCTS_FILE = 'products.json';

// Listar todos los productos
router.get('/', async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const limit = parseInt(req.query.limit, 10);
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Traer un producto por id
router.get('/:pid', async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'All fields except thumbnails are required' });
    }

    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    await writeJSONFile(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { id, ...updates } = req.body; // Prevent updating id
    products[index] = { ...products[index], ...updates };

    await writeJSONFile(PRODUCTS_FILE, products);
    res.json(products[index]);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    let products = await readJSONFile(PRODUCTS_FILE);
    products = products.filter(p => p.id !== req.params.pid);
    await writeJSONFile(PRODUCTS_FILE, products);
    res.status(204).send();
});

module.exports = router;
