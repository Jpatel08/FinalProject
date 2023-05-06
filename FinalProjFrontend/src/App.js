import logo from './logo.svg';
import './App.css';
// import { Products } from './products';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';

const Navbar = ({ cartItemsCount, onViewChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light"
         style={{backgroundColor: "#ff6150"}}>
     
     <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{color: "white"}} 
        onClick={()=> onViewChange('home')}>  My Store  </a>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#"
                 onClick={() => onViewChange('products')}
                 style={{color: "white"}}>Products</a>
            </li>
          </ul>
         
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#" id="navCheckout"
                 onClick={() => onViewChange('cart')}
                 style={{color: "white"}}>Checkout</a>
            </li>
          </ul>
        
        </div>
      </div>
    </nav>
  );
};

const ProductGrid = ({ onAddToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleIncrement = (productId) => {
    setQuantities({
      ...quantities,
      [productId]: (quantities[productId] || 0) + 1
    });
  };

  const handleDecrement = (productId) => {
    const newQuantities = { ...quantities };
    newQuantities[productId]--;
    if (newQuantities[productId] < 0) {
      newQuantities[productId] = 0;
    }
    setQuantities(newQuantities);
  };

  const filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  

  return (
    <div>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search products"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button className="btn btn-primary searchBar">Search</button>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredProducts.map((product) => (
          <div className="col" key={product._id}>
            <div className="card">
              <img src={product.image} className="card-img-top" alt={product.title} />
              <div className="cardBG">
                <h5 className="card-title w">{product.title}</h5>
                <p className="card-text w">{product.description}</p>
                <p className="card-text w">${product.price}</p>
                <p className="card-text w"><small className="text-muted w">{product.rating.rate} ({product.rating.count})</small></p>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <button className="btn btn-primary me-2 btn-custom" onClick={() => onAddToCart({ ...product, quantity: quantities[product._id] || 0 })}>Add to Cart</button>
                    <span className="fs-5">{quantities[product._id] || 0}</span>
                  </div>
                  <div>
                    <button className="btn btn-secondary me-2" onClick={() => handleDecrement(product._id)}>-</button>
                    <button className="btn btn-secondary" onClick={() => handleIncrement(product._id)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const ShoppingCart = ({ cartItems, onRemoveFromCart, total }) => {
  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => onRemoveFromCart(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-price">Total: ${total}</div>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};


const Cart = ({ cartItems, onRemoveFromCart, total, onViewChange, handleFormChange}) => {

  // const addInfo = () => {
  //   console.log(userInfo);
  //   setUserInfo({...userInfo, fullName: document.getElementById('inputName').value});
  //   console.log(userInfo);
  //   console.log(document.getElementById('inputName').value);
  //   setUserInfo({...userInfo, email: document.getElementById('inputEmail4').value});
  //   console.log(document.getElementById('inputEmail4').value);
  //   setUserInfo({ cardInfo: document.getElementById('inputCard').value});
  //   console.log(document.getElementById('inputCard').value);
  //   console.log(userInfo);
  //   setUserInfo({...userInfo, address: document.getElementById('inputAddress').value + document.getElementById('inputAddress2').value});
  //   console.log(document.getElementById('inputAddress').value + document.getElementById('inputAddress2').value)
    
  //   console.log('yo');
  //   console.log(userInfo);
  // }

  // Form validation stuff
  let validate = function () {
    let val = true;
    let email = document.getElementById('inputEmail4')
    let name = document.getElementById('inputName')
    let card = document.getElementById('inputCard')
    let form = document.getElementById('form')
    if (!email.value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9] {1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      email.setAttribute("class", "form-control is-invalid");
      val = false;
    }
    else {
      email.setAttribute("class", "form-control is-valid");
    }
    if (name.value.length == 0) {
      name.setAttribute("class", "form-control is-invalid")
      val = false
    }
    else {
      name.setAttribute("class", "form-control is-valid");
    }
    if (!card.value.match(/^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/)) {
      card.setAttribute("class", "form-control is-invalid")
      val = false
    }
    else {
      card.setAttribute("class", "form-control is-valid");
    }
    if (val) {
      form.classList.add("collapse")
      alert('You have made an order!', 'success')
    }
    return val;
  }


  return (
    <div className="container mt-3">
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => onRemoveFromCart(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-price">Total: ${total}</div>
          <div>
            <form id="form">

            <><h1>Payment Information</h1><div id="liveAlertPlaceholder"></div><form class="row g-3" id="checkout-form">
      <div class="col-md-6">
        <label for="inputName" class="form-label">
          Full Name
        </label>
        <input type="text" class="form-control" id="inputName" onChange={handleFormChange}/>
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">
          Must be like, "John Doe"
        </div>
      </div>

      <div class="col-md-6">
        <label for="inputEmail4" class="form-label">
          Email
        </label>
        <input
          type="email"
          class="form-control"
          id="inputEmail4"
          onChange={handleFormChange} />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">
          Must be like, "abc@xyz.efg"
        </div>
      </div>

      <div class="col-12">
        <label for="inputCard" class="form-label">
          Card
        </label>
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">
            <i class="bi-credit-card-fill"></i>
          </span>
          <input
            type="text"
            id="inputCard"
            onChange={handleFormChange}
            class="form-control"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            aria-label="Username"
            aria-describedby="basic-addon1" />
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">
            Must be like, "7777-7777-7777-7777"
          </div>
        </div>
      </div>

      <div class="col-12">
        <label for="inputAddress" class="form-label">
          Address
        </label>
        <input
          type="text"
          class="form-control"
          id="inputAddress"
          onChange={handleFormChange}
          placeholder="1234 Main St" />
      </div>
      <div class="col-12">
        <label for="inputAddress2" class="form-label">
          Address 2
        </label>
        <input
          type="text"
          class="form-control"
          id="inputAddress2"
          placeholder="Apartment, studio, or floor" />
      </div>
      <div class="col-md-6">
        <label for="inputCity" class="form-label">
          City
        </label>
        <input type="text" class="form-control" id="inputCity" />
      </div>
      <div class="col-md-6">
        <label for="inputCity" class="form-label">
          State
        </label>
        <input type="text" class="form-control" id="inputCity" />
      </div>
      <div class="col-md-2">
        <label for="inputZip" class="form-label">
          Zip
        </label>
        <input type="text" class="form-control" id="inputZip" onChange={handleFormChange} />
      </div>
      <div class="col-12"></div>
      <div class="col-12">
        <button type="submit" class="btn btn-success" onClick={() => {if(validate())onViewChange('confirmation')}}>
          {" "}
          <i class="bi-bag-check"></i> Order
        </button>
      </div>
    </form></>
              
    </form>
    </div>
     </>
     ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};


const Confimation = ({cartItems, total, userInfo, onViewChange}) => {
  return(
    <div className="container mt-3">
      <h1>Thank you! Your order has been recieved!</h1>
      <br></br>
      <h3 style={{textAlign:'center'}}>{userInfo.inputName}'s Order:</h3>
      <>
      <table className="table">
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Image</th>
          <th scope="col"></th>
        </tr>
      </thead>
      {cartItems.map((item) => (
        <tr key={item.id}>
          <td>{item.title}</td>
          <td>${item.price}</td>
          <td>{item.quantity}</td>
          <td><img src={item.image} alt={item.title} className="img-thumbnail" width="115px" height="115px"></img></td>
        </tr>
      ))}
      </table>
      <div className="total-price" style={{fontSize:24}}><b>Total:</b> ${total}</div>
      <br></br>
      <div>
        <>
        <h2>Shipping Info</h2>
        <p>Full Name:{userInfo.inputName} <br></br> Email Address: {userInfo.inputEmail4} <br></br>Card Info: {userInfo.inputCard} <br></br>Given Address: {userInfo.inputAddress}</p></>
        <a href="/"><button type="submit" class="btn btn-success" onClick={() => {onViewChange('products')}}>
          {" "}
          <i class="bi-bag-check"></i> Return
        </button></a>
      </div>
      </>
    </div>
  )
}
const App = () => {
  const [view, setView] = useState('products');
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({})


  const handleUserChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.id]:event.target.value});
    console.log(userInfo);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };
  const handleAddToCart = (newItem) => {
    const existingItem = cartItems.findIndex((item) => item.id === newItem.id);
    if (existingItem !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItem].quantity += newItem.quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, newItem]);
    }
  };
  

  const handleRemoveFromCart = (productId) => {
    const newCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCartItems);
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((total, item) => (total + item.price * item.quantity * 1.07), 0);
    return total.toFixed(2);
  };
  
  console.log(userInfo);
  return (
    <div class="pageBG">
      <Navbar onViewChange={handleViewChange} cartItems={cartItems} />
      <div className="container">
        {view === 'products' && <ProductGrid onAddToCart={handleAddToCart} />}
        {view === 'cart' && <Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} total={calculateTotal()} onViewChange={handleViewChange} handleFormChange={handleUserChange} />}
        {view === 'confirmation' && <Confimation cartItems={cartItems} total={calculateTotal()} userInfo={userInfo} onViewChange={handleViewChange} />} 
      </div>
    </div>
  );
};


export default App;