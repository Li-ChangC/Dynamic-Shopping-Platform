import './ShoppingCart.css';

function ShoppingCart({ products, cart, onChangeQty, onRemoveFromCart, onCheckout }) {
  const calculateTotal = () => {
    return cart.reduce((total, { cat, qty }) => {
      const { price = 0 } = products[cat] || {};
      return total + price * qty;
    }, 0).toFixed(2);
  };

  const hasValidItems = () => {
    return cart.some(({ cat }) => products[cat]);
  };

  const renderCartItems = () => {
    return cart.map(item => {
      const { cat, qty } = item;
      const product = products[cat];
      const productExists = product && product.stock > 0;
      const price = product?.price || 0;

      return (
        <li key={cat} className={`cart__item ${productExists ? '' : 'cart__item-unavailable'}`}>
          <div className="cart__item-left">
            <img
              src={`https://placehold.co/50x50?text=${cat}`}
              alt={cat}
              className="cart__item-image"
            />
            <div className="cart__item-actions">
              {productExists && (
                <>
                  <button onClick={() => onChangeQty(cat, qty + 1)} className="cart__button">
                    +
                  </button>
                  <button onClick={() => onChangeQty(cat, qty - 1)} className="cart__button">
                    -
                  </button>
                </>
              )}
              <button onClick={() => onRemoveFromCart(cat)} className="cart__button">
                ×
              </button>
            </div>
          </div>

          <div className="cart__item-right">
            <div className="cart__item-header">
              <span className="cart__item-cat">{cat}</span>
              <span className="cart__item-qty">Quantity: {qty}</span>
              <span className="cart__item-price">Price: ${(price * qty).toFixed(2)}</span>
            </div>
            {productExists ? (
              <form
                className="change-qty-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const newQty = parseInt(e.target.elements['newQty'].value, 10);
                  onChangeQty(cat, newQty);
                }}
              >
                <input
                  type="number"
                  name="newQty"
                  className="change-qty-input"
                  placeholder="New Quantity"
                  min="0"
                />
                <button type="submit" className="cart__button update">Change</button>
              </form>
            ) : (
              <p className="cart__item-unavailable-msg">This product is no longer available.</p>
            )}
          </div>
        </li>
      );
    });
  };

  return (
    <div className="shopping__cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart__list">{renderCartItems()}</ul>
          {hasValidItems() ? (
            <>
              <p className="cart__total">Total: ${calculateTotal()}</p>
              <button className="checkout-button" onClick={onCheckout}>Checkout</button>
            </>
          ) : (
            <p className="cart__no-valid-items">No valid items available for checkout.</p>
          )}
        </>
      )}
    </div>
  );
}

export default ShoppingCart;