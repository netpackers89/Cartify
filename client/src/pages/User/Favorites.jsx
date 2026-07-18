import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import './Favorites.css';

const user = () => JSON.parse(localStorage.getItem('user') || 'null');

export const Favorites = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const currentUser = user();
    if (!currentUser) { setLoading(false); return; }
    try { const { data } = await axios.get(`http://localhost:3000/api/favorites/${currentUser._id}`); setProducts(data); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const remove = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/${id}/favorite`, { userId: user()._id });
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]').filter(favoriteId => favoriteId !== id);
      localStorage.setItem('favorites', JSON.stringify(favorites)); window.dispatchEvent(new Event('favoritesChanged'));
      setProducts(products.filter(product => product._id !== id));
    } catch { /* The item remains visible when the request fails. */ }
  };
  const addToCart = product => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    localStorage.setItem('cart', JSON.stringify(existing ? cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { ...product, quantity: 1 }]));
  };
  if (loading) return <main className="favorites-page"><p>Loading your favorites…</p></main>;
  if (!user()) return <main className="favorites-page empty-favorites"><FiHeart /><h1>Save products you love</h1><p>Log in to build your personal wishlist.</p><Link to="/login">Log in</Link></main>;
  return <main className="favorites-page"><header><span>YOUR WISHLIST</span><h1>Favorites</h1><p>{products.length ? `${products.length} saved item${products.length === 1 ? '' : 's'}` : 'Your wishlist is waiting for something special.'}</p></header>{products.length ? <div className="favorites-grid">{products.map(product => <article className="favorite-card" key={product._id}><img src={product.image || 'https://via.placeholder.com/300'} alt={product.name}/><button className="remove-favorite" onClick={() => remove(product._id)} aria-label="Remove favorite"><FiHeart /></button><div><small>{product.category?.name || 'Collection'}</small><h2>{product.name}</h2><strong>${Number(product.price).toFixed(2)}</strong><div className="favorite-actions"><button onClick={() => addToCart(product)}><FiShoppingCart /> Add to cart</button><button onClick={() => remove(product._id)}><FiTrash2 /></button></div></div></article>)}</div> : <section className="empty-favorites"><FiHeart /><h2>No favorites yet</h2><p>Tap the heart on any product to save it here.</p><Link to="/products">Explore products</Link></section>}</main>;
};
