const products = {
    Nyancat: { price: 2.73, stock: 10 },
    Jorts: { price: 0.99, stock: 5 },
    Jean: { price: 3.14, stock: 7 },
};

function addProduct(cat, price, stock = 0) {
    products[cat] = { price, stock }; 
    return products;
};

function removeProduct(cat) {
    delete products[cat]; 
    return products;
}

function changePrice(cat, price) {
    products[cat].price = price;
    return products;
};

function changeStock(cat, stock) {
    if (products[cat]) {
        products[cat].stock = stock;
    }
    return products;
}

function adjustStock(cat, amount) {
    if (products[cat]) {
        if (products[cat].stock + amount < 0) {
            throw new Error('insufficient-stock');
        }
        products[cat].stock += amount; 
    }
    return products;
}

function getPrice(cat) {
    return products[cat] ? products[cat].price : null;
};

function getStock(cat) {
    return products[cat] ? products[cat].stock : null;
};

function getProducts() {
    return products;
}

export default {
    addProduct,
    removeProduct,
    changePrice,
    getPrice,
    getProducts,
    changeStock,
    adjustStock,
    getStock,
};