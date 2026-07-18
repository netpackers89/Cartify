import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiCheck, FiShoppingCart, FiStar } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import './ProductDetail.css';

const api = 'http://localhost:3000'; const imageSrc = image => image?.startsWith('/') ? `${api}${image}` : image;
export const ProductDetail = () => {
  const { id } = useParams(); const [product, setProduct] = useState(null); const [quantity, setQuantity] = useState(1); const [added, setAdded] = useState(false);
  useEffect(() => { axios.get(`${api}/api/products/${id}`).then(res => setProduct(res.data)).catch(() => setProduct(false)); }, [id]);
  const add = () => { const cart = JSON.parse(localStorage.getItem('cart') || '[]'); const existing = cart.find(item => item._id === product._id); const next = existing ? cart.map(item => item._id === product._id ? { ...item, quantity: Math.min(product.countInStock, item.quantity + quantity) } : item) : [...cart, { ...product, quantity }]; localStorage.setItem('cart', JSON.stringify(next)); setAdded(true); };
  if (product === null) return <p className="detail-loading">Loading product…</p>; if (!product) return <main className="detail-loading">Product not found. <Link to="/products">Browse products</Link></main>;
  const available = product.countInStock > 0;
  return <main className="detail-page"><Link className="back-link" to="/products"><FiArrowLeft /> Back to products</Link><section className="detail-layout"><div className="detail-image"><img src={imageSrc(product.image) || 'https://via.placeholder.com/700'} alt={product.name} /></div><article className="detail-info"><span className="detail-category">{product.category?.name || 'Collection'}</span><h1>{product.name}</h1><p className="detail-rating"><FiStar /> 4.8 · Customer favourite</p><p className="detail-price">${Number(product.price).toFixed(2)}</p><p className={`availability ${available ? 'available' : 'unavailable'}`}><FiCheck /> {available ? `${product.countInStock} in stock — ready to ship` : 'Out of stock'}</p><p className="detail-description">{product.description || 'A carefully selected Cartify product, made to fit beautifully into your everyday life.'}</p><div className="detail-actions"><div className="detail-quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><b>{quantity}</b><button disabled={quantity >= product.countInStock} onClick={() => setQuantity(quantity + 1)}>+</button></div><button className="detail-add" disabled={!available} onClick={add}><FiShoppingCart /> {available ? added ? 'Added to cart' : 'Add to cart' : 'Out of stock'}</button></div><p className="delivery-copy">Secure checkout · Reserved at checkout · Delivery tracking included</p></article></section><section className="detail-description-panel"><h2>Description</h2><p>{product.description || 'Quality, thoughtfully selected products delivered with care.'}</p></section></main>;
};
