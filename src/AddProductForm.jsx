import { useState } from 'react';
import './AddProductForm.css';

function UpdateProductForm({ onAddProduct }) {

  const [cat, setCat] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    onAddProduct(cat, price, stock);
    setCat('');
    setPrice('');
    setStock('');
  }

  function onCatChange(e) {
    setCat(e.target.value);
  }

  function onPriceChange(e) {
    setPrice(e.target.value);
  }

  function onStockChange(e) {
    setStock(e.target.value);
  }

  return (
    <form className="update__form" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="input-cat" className="form-label">Category</label>
        <input
          id="input-cat"
          className="input__cat"
          placeholder="Enter cat"
          value={cat}
          onChange={onCatChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="input-price" className="form-label">Price</label>
        <input
          id="input-price"
          className="input__price"
          placeholder="Enter price"
          type="number"
          value={price}
          step="0.01"
          min="0"
          onChange={onPriceChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="input-stock" className="form-label">Stock</label>
        <input
          id="input-stock"
          className="input__stock"
          placeholder="Enter stock"
          type="number"
          value={stock}
          step="1"
          min="0"
          onChange={onStockChange}
        />
      </div>

      <button type="submit" className="update__button">Add</button>
    </form>

  );
}

export default UpdateProductForm;