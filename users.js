import products from './products.js';

const users = {};

function isValidUsername(username) {
    let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid;
}

function isAdmin(username) {
    return username === 'Admin';
}

function getUserCart(username) {
    if (!users[username]) {
        users[username] = { cart: {} };
    }

    return users[username];
}

function addCat(username, cat) {
    const userCart = getUserCart(username);
    const catCount = userCart.cart[cat] || 0;
    userCart.cart[cat] = catCount + 1;
    return userCart.cart;
}

function removeCat(username, cat) {
    const userCart = getUserCart(username);
    delete userCart.cart[cat];
    return userCart.cart;
}

function changeQty(username, cat, qty) {
    const userCart = getUserCart(username);

    qty = Number(qty);
    if (qty === 0) {
        removeCat(username, cat);
        return userCart.cart;
    }

    userCart.cart[cat] = qty;
    return userCart.cart;
}


function clearCart(username) {
    users[username].cart = {};
    return users[username].cart;
}

function saveHistory(username) {
    const timestamp = new Date().toISOString();
    if (!users[username].history) {
        users[username].history = {};
    }

    const currentProducts = products.getProducts();
    const availableProductsInCart = Object.keys(users[username].cart).filter(cat => currentProducts[cat]);
    
    const formattedCart = availableProductsInCart.map(cat => {
        const qty = users[username].cart[cat]; 
        const price = currentProducts[cat]?.price || 0; 
        products.adjustStock(cat, -qty);
        return { cat, qty, price };
    });

    users[username].history[timestamp] = formattedCart;
    return clearCart(username);
}

function getAllHistory(username) {
    if (!users[username].history) {
        users[username].history = {};
    }
    return users[username].history;
}

function getHistory(username, timestamp) {
    return users[username].history[timestamp];
}

export default {
    isValidUsername,
    isAdmin,
    getUserCart,
    addCat,
    removeCat,
    changeQty,
    clearCart,
    saveHistory,
    getAllHistory,
    getHistory,
};