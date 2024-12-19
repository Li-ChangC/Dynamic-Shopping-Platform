import './Controls.css';

function Controls({ show, showHistory, onShowHistory, onLogout, onShowCart, isAdmin }) {
  return (
    <div className="controls">
      {!isAdmin && (
        <>
          {!showHistory ? (
            <>
              <button onClick={onShowHistory} className="controls__history">
                Orders
              </button>
              <button onClick={onShowCart} className="controls__cart">
                {show ? "Hide Cart" : "Show Cart"}
              </button>
            </>
          ) : (
            <button onClick={onShowHistory} className="controls__history">
              Home
            </button>
          )}
        </>
      )}
      <button onClick={onLogout} className="controls__logout">Logout</button>
    </div>
  );
}


export default Controls;
