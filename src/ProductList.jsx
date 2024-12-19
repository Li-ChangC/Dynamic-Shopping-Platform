import React from 'react';
import './ProductList.css';
import AddProductForm from './AddProductForm';

function ProductList({ isAdmin, products, onAddACat, onAddProduct, onRemoveProduct, onChangePrice, onChangeStock }) {
    const productList = Object.keys(products).map(cat => ({
        cat,
        price: products[cat].price,
        stock: products[cat].stock,
    }));

    return (
        <div className="product-list">
            <h1>Products</h1>
            <div className="products">
                {productList.map((product) => (
                    <div key={product.cat} className="product">
                        <img
                            src={`https://placehold.co/100x100?text=${product.cat}`}
                            alt={product.cat}
                            className="product-image"
                        />
                        <h2 className="product-title">{product.cat}</h2>
                        <p className="product-price">Price: ${product.price}</p>
                        <p className="product-stock">Stock: {product.stock}</p>
                        {isAdmin ? (
                            <div className="product-admin-actions">                                
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const newPrice = parseFloat(e.target.elements['newPrice'].value);
                                        onChangePrice(product.cat, newPrice);
                                    }}
                                >
                                    <input
                                        type="number"
                                        name="newPrice"
                                        placeholder="New Price"
                                        step="0.01"
                                        min="0"
                                    />
                                    <button type="submit">Update Price</button>
                                </form>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const newStock = parseInt(e.target.elements['newStock'].value, 10);
                                        onChangeStock(product.cat, newStock);
                                    }}
                                >
                                    <input
                                        type="number"
                                        name="newStock"
                                        placeholder="New Stock"
                                        step="1"
                                        min="0"
                                    />
                                    <button type="submit">Update Stock</button>
                                </form>
                                <button onClick={() => onRemoveProduct(product.cat)}>Remove</button>
                            </div>
                        ) : (
                            <div className="product-user-actions">
                                {product.stock > 0 ? (
                                    <button onClick={() => onAddACat(product.cat)}>+</button>
                                ) : (
                                    <p className="out-stock-msg">Out of Stock</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isAdmin && (
                <div className="add-product">
                    <h3>Add Products</h3>
                    <AddProductForm onAddProduct={onAddProduct} />
                </div>
            )}
        </div>
    );
}

export default ProductList;