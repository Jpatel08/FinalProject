import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select'//import axios from 'axios';

const sizes = [
  { value: '7', label: 'Size 7' },
  { value: '7.5', label: 'Size 7.5' },
  { value: '8', label: 'Size 8' },
  { value: '8.5', label: 'Size 8.5' },
  { value: '9', label: 'Size 9' },
  { value: '9.5', label: 'Size 9.5' },
  { value: '10', label: 'Size 10' },
  { value: '10.5', label: 'Size 10.5' },
  { value: '11', label: 'Size 11' },
  { value: '12', label: 'Size 12' },
  { value: '13', label: 'Size 13' },
]

const Navbar = ({ cartItemsCount, onViewChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#ff6150" }}>
      <div className="container-fluid">
        <button className="navbar-brand btn" style={{ color: "white" }} onClick={() => onViewChange('home')}>
          Home
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => onViewChange('products')} style={{ color: "white" }}>
                Shoes
              </button>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => onViewChange('cart')} style={{ color: "white" }}>
                Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Home = ({ cartItemsCount, handleViewChange }) => {
  return (
    <div class="homepage">
      <body class="homepage">
      <div class="container">
    <h1 class="Heading">Run faster.  Go Farther.</h1>
    <h2 class="subtext"> View our selection of performance sneakers to<br></br>help you go the distance.</h2>
  </div>
      </body>
    </div>

  );
};


const ProductGrid = ({ onAddToCart },cartItems) => {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
 const [selection,setSelection] = useState([null]);
  useEffect(() => {
    fetch('http://localhost:4000/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);
  const handleAddToCart = (product, quantity,selection) => {
    fetch('http://localhost:4000/cart/all')
      .then(res => res.json())
      .then(data => {
        const cartItems = Array.isArray(data) ? data : [];
        const existingCartItem = cartItems.find(item => item._id === product._id);
        if (existingCartItem) {
          const updatedCartItem = { ...existingCartItem, quantity: existingCartItem.quantity + quantity };
          fetch(`http://localhost:4000/cart/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCartItem)
          })
            .then(res => res.json())
            .catch(err => console.error(err));
        } else {
          fetch('http://localhost:4000/cart/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "_id":product._id,
              "title": product.title,
              "description":product.description,
              "price": product.price,
              "image":product.image,
              "rating":product.rating,
              "quantity": quantity,
              "size": selection,
            })
          })
            .then(res => res.json())
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  };
  

  const handleSelectChange = (option) => {
    setSelection(option ? option.value : null);
  };
  
  
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

  const deleteItem = (productid) => {
    console.log("Deleting product:", productid);
    console.log(productid);
    fetch("http://localhost:4000/delete", {
      method: "DELETE",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ _id: productid}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete a product completed :", productid);
        console.log(data);
        if (data) {
          const value = Object.values(data);
          alert(value);
        }
      });
  }
  


  return (
    <div>
        <br></br>
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
      <label> Select a size
      <Select
            options={sizes}
            value={selection}
            onChange={handleSelectChange}
              />
              </label>
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
                  <button className="btn btn-primary me-2 btn-custom" onClick={() => handleAddToCart(product, quantities[product._id], selection || 0)}>Add to Cart</button>

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






const Cart = ({ onRemoveFromCart, onViewChange, handleFormChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('http://localhost:4000/cart/all')
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        const totalPrice = data.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(totalPrice);
      })
      .catch(err => console.error(err));
  })

  const deleteFromCart = (productid) => {
    console.log("Deleting product:", productid);
    console.log(productid);
    fetch("http://localhost:4000/cart/delete", {
      method: "DELETE",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ _id: productid}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete a product completed :", productid);
        console.log(data);
        if (data) {
          const value = Object.values(data);
          alert(value);
        }
      });
}

  // Form validation stuff
  let validate = function () {
    let val = true;
    let email = document.getElementById("inputEmail4");
    let name = document.getElementById("inputName");
    let card = document.getElementById("inputCard");
    let form = document.getElementById("form");
    if (
      !email.value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9] {1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      email.setAttribute("class", "form-control is-invalid");
      val = false;
    } else {
      email.setAttribute("class", "form-control is-valid");
    }
    if (name.value.length == 0) {
      name.setAttribute("class", "form-control is-invalid");
      val = false;
    } else {
      name.setAttribute("class", "form-control is-valid");
    }
    if (
      !card.value.match(/^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/)
    ) {
      card.setAttribute("class", "form-control is-invalid");
      val = false;
    } else {
      card.setAttribute("class", "form-control is-valid");
    }
    if (val) {
      form.classList.add("collapse");
      alert("You have made an order!", "success");
    }
    return val;
  };


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
                <th scope="col">Size</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.size}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteFromCart(item._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-price">Total: ${total}</div>
          <div>
            <form id="form">
                <br></br>
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
      <h1>Confimation</h1>
      <>
      <br></br>
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
      <div className="total-price"><b>Total:</b> ${total}</div>
      <div>
        <br></br>
        <h2>User Info</h2>
        <>
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
  const [view, setView] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [userInfo, setUserInfo] = useState({})
  useEffect(() => {
    fetch('http://localhost:4000/cart/all')
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        const totalPrice = data.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(totalPrice);
      })
      .catch(err => console.error(err));
  })


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
      {view === 'home' && <Home onViewChange={handleViewChange} />}
      {view === 'products' && <ProductGrid onAddToCart={handleAddToCart} />}
      {view === 'cart' && <Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} total={calculateTotal()} onViewChange={handleViewChange} handleFormChange={handleUserChange} />}
      {view === 'confirmation' && <Confimation cartItems={cartItems} total={calculateTotal()} userInfo={userInfo} onViewChange={handleViewChange} />} 
      </div>
    </div>
  );
};


export default App;