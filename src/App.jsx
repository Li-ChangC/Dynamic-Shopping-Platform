import { useState, useEffect, useCallback, useRef } from 'react';

import './App.css';
import {
  POLLING_DELAY,
  LOGIN_STATUS,
  CLIENT,
  SERVER,
} from './constants';
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchCart,
  fetchChangeQty,
  fetchCheckout,
  fetchAdminAddCat,
  fetchAdminChangePrice,
  fetchAdminRemoveCat,
  fetchProducts,
  fetchRemoveFromCart,
  fetchAdminChangeStock,
} from './services';

import LoginForm from './LoginForm';
import Loading from './Loading';
import Controls from './Controls';
import Status from './Status';
import ShoppingCart from './ShoppingCart';
import ProductList from './ProductList';
import OrderHistory from './OrderHistory';


function App() {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [show, setShow] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const pollingRef = useRef();

  function onLogin(username) {
    setLoginStatus(LOGIN_STATUS.PENDING);
    setError('');
    fetchLogin(username)
      .then(response => {
        if (response.isAdmin) {
          setIsAdmin(true);
        }
        return fetchProducts();
      })
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
        return fetchCart();
      })
      .then(fetchedCart => {
        const cartArray = Object.keys(fetchedCart)
          .filter(cat => products[cat])
          .map(cat => ({
            cat,
            qty: fetchedCart[cat]
          }));
        setCart(cartArray);
        setError('');
        setUsername(username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
        setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
      });
  }

  function onLogout() {
    setError('');
    setUsername('');
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    setIsAdmin(false);
    setCart([]);
    setShow(false);
    setShowHistory(false);
    fetchLogout()
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function onShowCart() {
    setError('');
    setShow(show => !show);
  }

  function onShowHistory() {
    setError('');
    setShowHistory(showHistory => !showHistory);
  }

  function onChangeQty(cat, qty) {
    setError('');
    fetchChangeQty(cat, qty)
      .then(fetchedCart => {
        const cartArray = Object.keys(fetchedCart).map(cat => ({ cat, qty: fetchedCart[cat] }));
        setCart(cartArray);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function onAddACat(cat) {
    const currentCatCount = cart.find(c => c.cat === cat)?.qty || 0;
    return onChangeQty(cat, currentCatCount + 1);
  }

  function onRemoveFromCart(cat) {
    setError('');
    fetchRemoveFromCart(cat)
      .then(fetchedCart => {
        const cartArray = Object.keys(fetchedCart).map(cat => ({ cat, qty: fetchedCart[cat] }));
        setCart(cartArray);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function onCheckout() {
    setError('');
    fetchCheckout(username)
      .then(() => {
        setError('successfulCheckout');
        setCart([]);
        setShow(false);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  // Admin functions
  function onAddProduct(cat, price, stock) {
    setError('');
    fetchAdminAddCat(cat, price, stock)
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function onRemoveProduct(cat) {
    setError('');
    fetchAdminRemoveCat(cat)
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function onChangePrice(cat, price) {
    setError('');
    fetchAdminChangePrice(cat, price)
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function onChangeStock(cat, stock) {
    setError('');
    fetchAdminChangeStock(cat, stock)
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
      })
      .catch(err => {
        setError(err?.error || 'ERROR');
      });
  }

  function checkForSession() {
    fetchSession()
      .then(session => {
        setUsername(session.username);
        if (session.isAdmin) {
          setIsAdmin(true);
        }
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setShowHistory(false);
        return fetchProducts();
      })
      .catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION })
        }
        return Promise.reject(err);
      })
      .then((fetchedProducts) => {
        setProducts(fetchedProducts);
        return fetchCart();
      })
      .then(fetchedCart => {
        const cartArray = Object.keys(fetchedCart).map(cat => ({ cat, qty: fetchedCart[cat] }));
        setCart(cartArray);
      })
      .catch(err => {
        if (err?.error === CLIENT.NO_SESSION) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
          return;
        }
        setError(err?.error || 'ERROR');
      });
  }

  useEffect(
    () => {
      checkForSession();
    },
    []
  );

  const pollProducts = useCallback(() => {
    fetchProducts()
      .then((fetchedProducts) => {
        setProducts(fetchedProducts);
        pollingRef.current = setTimeout(pollProducts, POLLING_DELAY);
      })
      .catch((err) => {
        setError(err?.error || 'ERROR');
        pollingRef.current = setTimeout(pollProducts, POLLING_DELAY);
      });
  }, []);

  useEffect(
    () => {
      if (loginStatus == LOGIN_STATUS.IS_LOGGED_IN && !showHistory) {
        pollingRef.current = setTimeout(pollProducts, POLLING_DELAY);
      }
      return () => {
        clearTimeout(pollingRef.current);
      };
    },
    [loginStatus, pollProducts]
  );

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">Cat Store</h1>
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <Controls show={show} showHistory={showHistory} onShowHistory={onShowHistory} onLogout={onLogout} onShowCart={onShowCart} isAdmin={isAdmin} />
        )}
      </header>
      <main className={`main ${show ? 'show-cart' : ''}`}>
        {loginStatus === LOGIN_STATUS.PENDING && <Loading className="login__waiting">Loading user...</Loading>}
        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <LoginForm onLogin={onLogin} />}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (<p className="welcome__message">Hello, {username}!</p>)}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div className="content">
            {showHistory ? (
              <OrderHistory
                checkForSession={checkForSession}
              />
            ) : (
              <>
                <ProductList
                  isAdmin={isAdmin}
                  products={products}
                  onAddACat={onAddACat}
                  onAddProduct={onAddProduct}
                  onRemoveProduct={onRemoveProduct}
                  onChangePrice={onChangePrice}
                  onChangeStock={onChangeStock}
                />
                {show && (
                  <ShoppingCart
                    products={products}
                    cart={cart}
                    onChangeQty={onChangeQty}
                    onRemoveFromCart={onRemoveFromCart}
                    onCheckout={onCheckout}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
      {error && <Status error={error} />}
      <footer className="footer">
        <p className="footer__privacy">Privacy Policy: Whatever</p>
      </footer>
    </div>
  );
}

export default App;
