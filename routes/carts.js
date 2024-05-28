const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const router = express.Router();

const CARTS_FILE = 'carts.json';

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const carts = await readJSONFile(CARTS_FILE);
    const newCart = {
        id: uuidv4(),
        products: []
    };

    carts.push(newCart);
    await writeJSONFile(CARTS_FILE, carts);
    res.status(201).json(newCart);
});

// Listar productos de un carrito por id
router.get('/:cid', async (req, res) => {
    const carts = await readJSONFile(CARTS_FILE);
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart.products);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await readJSONFile(CARTS_FILE);
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    const product = cart.products.find(p => p.product === req.params.pid);
    if (product) {
        product.quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await writeJSONFile(CARTS_FILE, carts);
    res.status(201).json(cart);
});

module.exports = router;
