import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = () => {
    alert('إتمام الدفع');
  };

  return (
    <div className="app-container">
      <header>
        <h1>متجر التخسيس</h1>
      </header>

      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <span>{product.price} جنيه</span>
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              إضافة إلى السلة
            </button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>السلة</h2>
        {cart.length === 0 ? <p>لا يوجد منتجات في السلة</p> : (
          <ul>
            {cart.map((product, index) => (
              <li key={index}>{product.name} - {product.price} جنيه</li>
            ))}
          </ul>
        )}
        <button onClick={handleCheckout} className="checkout-button">إتمام الدفع</button>
      </div>
    </div>
  );
}

export default App;
