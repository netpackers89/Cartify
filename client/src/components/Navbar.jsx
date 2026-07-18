import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiHeart, FiLogOut, FiShield, FiShoppingCart, FiTruck, FiGrid, FiInfo } from "react-icons/fi";
import "./Navbar.css";

export const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [favoriteCount, setFavoriteCount] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]').length);
  const [cartCount, setCartCount] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]').length);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    const updateFavorites = () => setFavoriteCount(JSON.parse(localStorage.getItem('favorites') || '[]').length);
    const updateCart = () => setCartCount(JSON.parse(localStorage.getItem('cart') || '[]').length);
    window.addEventListener('favoritesChanged', updateFavorites);
    window.addEventListener('storage', updateFavorites);
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('favoritesChanged', updateFavorites);
      window.removeEventListener('storage', updateFavorites);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="logo">
        <img
          src="https://i.pinimg.com/1200x/4a/48/ad/4a48ad39b51ad2ee91c315be3108d109.jpg"
          alt="Logo"
        />
        <h1 className="logo-text"><Link to={"/"}>Cartify</Link> </h1>
      </div>

      <ul className="cat">
        <li>
          <Link to="/products" className="nav-link">
            <FiGrid /> 
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            <FiInfo /> 
          </Link>
        </li>
        {cartCount > 0 && (
          <li>
            <Link to="/cart" className="nav-link">
              <FiShoppingCart /> <span className="cart-count">{cartCount}</span>
            </Link>
          </li>
        )}
        {user && (
          <li>
            <Link to="/orders" className="nav-link">
              <FiTruck /> 
            </Link>
          </li>
        )}
       {favoriteCount > 0 && (
  <li>
    <Link to="/favorites" className="nav-link" title="Your liked products">
      <FiHeart /> 
      <span className="favorite-count">{favoriteCount}</span>
    </Link>
  </li>
)}
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            {user.isAdmin && (
              <Link to="/admin">
                <FiShield /> 
              </Link>
            )}
            
       <div>
        
       </div>
            <div className="profile">
              <button
                className="profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FiUser /> {user.name}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  
                  <button onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
