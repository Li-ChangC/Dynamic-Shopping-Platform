import express from 'express';
import cookieParser from 'cookie-parser';
import sessions from './sessions.js';
import users from './users.js';
import products from './products.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

function isAuthenticated(req, res, next) {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if (!sid || !users.isValidUsername(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    req.username = username;
    next();
}

// Sessions
app.get('/api/v1/session', isAuthenticated, (req, res) => {
    res.json({
        username: req.username,
        isAdmin: users.isAdmin(req.username), 
    });
});

app.post('/api/v1/session', (req, res) => {
    const { username } = req.body;

    if (!users.isValidUsername(username)) {
        res.status(400).json({ error: 'required-username' });
        return;
    }

    if (username === 'dog') {
        res.status(403).json({ error: 'auth-insufficient' });
        return;
    }

    const sid = sessions.addSession(username);
    const isAdmin = users.isAdmin(username);

    res.cookie('sid', sid);
    res.json({ username, isAdmin });
});

app.delete('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;

    if (sid) {
        res.clearCookie('sid');
    }

    if (req.username) {
        sessions.deleteSession(sid);
    }

    res.json({ username: req.username });
});

// UserCart
app.get('/api/v1/cart', isAuthenticated, (req, res) => {
    const userCart = users.getUserCart(req.username);
    res.json(userCart.cart);
});

app.patch('/api/v1/cart/:cat', isAuthenticated, (req, res) => {
    const { cat } = req.params;
    const { qty } = req.body;

    const availableProducts = products.getProducts();
    if (!availableProducts[cat]) {
        res.status(400).json({ error: 'required-cat' });
        return;
    }

    if (!Number.isInteger(qty) || qty <= 0 || qty > 999) {
        res.status(400).json({ error: 'invalid-qty' });
        return;
    }

    const availableStock = availableProducts[cat].stock;
    if (qty > availableStock) {
        res.status(400).json({ error: 'insufficient-stock' });
        return;
    }

    users.changeQty(req.username, cat, qty);
    res.json(users.getUserCart(req.username).cart);
});

app.delete('/api/v1/cart/:cat', isAuthenticated, (req, res) => {
    const { cat } = req.params;
    users.removeCat(req.username, cat);
    res.json(users.getUserCart(req.username).cart);
});

// Order History
app.get('/api/v1/orders', isAuthenticated, (req, res) => {
    res.json(users.getAllHistory(req.username));
});

app.get('/api/v1/orders/:timestamp', isAuthenticated, (req, res) => {
    const { timestamp } = req.params;
    const history = users.getHistory(req.username, timestamp);
    res.json(history);
});

app.post('/api/v1/orders', isAuthenticated, (req, res) => {
    try {
        return res.json(users.saveHistory(req.username));
    }
    catch (err) {
        res.status(400).json({ error: err.message });
        return;
    }
});

// For admin only
app.get('/api/v1/products', isAuthenticated, (req, res) => {
    res.json(products.getProducts());
});

app.post('/api/v1/products', isAuthenticated, (req, res) => {
    const { cat, price, stock } = req.body;
    const newPrice = Number(price);
    const newStock = Number(stock);

    if (!newPrice || newPrice <= 0) {
        res.status(400).json({ error: 'invalid-price' });
        return;
    }

    if (!newStock || newStock < 0 || !Number.isInteger(newStock)) {
        res.status(400).json({ error: 'invalid-stock' });
        return;
    }

    if (!cat || !/^[A-Za-z]+$/.test(cat)) {
        res.status(400).json({ error: 'invalid-cat' });
        return;
    }

    const existingProduct = products.getProducts()[cat];

    if (existingProduct) {
        res.status(409).json({ error: 'conflict-product' });
        return;
    }

    products.addProduct(cat, newPrice, newStock);
    res.json(products.getProducts());
});

app.patch('/api/v1/products/price', isAuthenticated, (req, res) => {
    const { cat, price } = req.body;
    if (!price || price <= 0) {
        res.status(400).json({ error: 'invalid-price' });
        return;
    }
    products.changePrice(cat, price);
    res.json(products.getProducts());
});

app.patch('/api/v1/products/stock', isAuthenticated, (req, res) => {
    const { cat, stock } = req.body;
    if (!Number.isInteger(stock) || stock < 0) {
        res.status(400).json({ error: 'invalid-stock' });
        return;
    }
    products.changeStock(cat, stock);
    res.json(products.getProducts());
});

app.delete('/api/v1/products', isAuthenticated, (req, res) => {
    const { cat } = req.body;
    products.removeProduct(cat);
    res.json(products.getProducts());
});

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);