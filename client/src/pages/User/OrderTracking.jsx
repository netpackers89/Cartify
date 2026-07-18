import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import { OrderReceipt } from '../../components/OrderReceipt';
import './OrderTracking.css';

export const OrderTracking = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [orders, setOrders] = useState([]); const [selected, setSelected] = useState(null); const [loading, setLoading] = useState(Boolean(user));
  useEffect(() => { if (!user) return; axios.get(`http://localhost:3000/orders/${user._id}`).then(response => setOrders(response.data)).finally(() => setLoading(false)); }, []);
  if (!user) return <main className="tracking-page tracking-empty"><FiPackage /><h1>Track your orders</h1><p>Log in to see receipts and delivery progress.</p><Link to="/login">Log in</Link></main>;
  return <main className="tracking-page"><header><span>MY PURCHASES</span><h1>Order tracking</h1><p>View your order status and open a receipt anytime.</p></header>{loading ? <p className="tracking-loading">Loading your orders…</p> : orders.length ? <section className="tracking-order-list">{orders.map(order => <article key={order._id} className="tracking-order-card"><div className="tracking-order-icon"><FiPackage /></div><div><small>ORDER #{order._id.slice(-7).toUpperCase()}</small><h2>{order.items.length} item{order.items.length === 1 ? '' : 's'} · ${order.totalAmount.toFixed(2)}</h2><p>Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className={`order-state ${order.status.toLowerCase().replaceAll(' ', '-')}`}>{order.status}</span><button onClick={() => setSelected(order)}>View receipt <FiArrowRight /></button></article>)}</section> : <section className="tracking-empty"><FiPackage /><h2>No orders yet</h2><p>When you checkout, your orders and delivery progress appear here.</p><Link to="/products">Start shopping</Link></section>}<AnimatePresence>{selected && <OrderReceipt order={selected} onClose={() => setSelected(null)} />}</AnimatePresence></main>;
};
