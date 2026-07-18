import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiDownload, FiMapPin, FiPackage, FiTruck, FiX } from 'react-icons/fi';
import './OrderReceipt.css';

export const OrderReceipt = ({ order, onClose }) => {
  const steps = [{ title: 'Order placed', icon: FiCheckCircle }, { title: 'Packed', icon: FiPackage }, { title: 'In transit', icon: FiTruck }, { title: 'Delivered', icon: FiMapPin }];
  const progress = order.status === 'Rejected' ? 0 : ({ Pending: 1, Approved: 2, 'On Delivery': 3, Completed: 4 }[order.status] || 1);
  return <motion.div className="receipt-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.article className="receipt-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={event => event.stopPropagation()}>
      <button className="receipt-close" onClick={onClose} aria-label="Close receipt"><FiX /></button>
      <header className="receipt-title"><span>ORDER RECEIPT</span><h2>{order.status === 'Rejected' ? 'Order needs attention' : 'Thanks for your order!'}</h2><p>{order.note || 'Your order is confirmed. You can return here anytime to track it.'}</p></header>
      <div className="receipt-summary"><div><small>Order number</small><strong>#{order._id.slice(-8).toUpperCase()}</strong></div><div><small>Placed</small><strong>{new Date(order.createdAt).toLocaleDateString()}</strong></div><div><small>Items</small><strong>{order.items.length} items</strong></div><div><small>Total</small><strong>${order.totalAmount.toFixed(2)}</strong></div><button onClick={() => window.print()}><FiDownload /> Print</button></div>
      <section className="receipt-progress"><div className="receipt-progress-head"><h3>Order progress</h3><b>{order.status || 'Pending'}</b></div><div className="receipt-timeline">{steps.map((step, index) => { const Icon = step.icon; const active = index < progress; return <div className={active ? 'active' : ''} key={step.title}><i><Icon /></i><strong>{step.title}</strong><small>{active ? (index === progress - 1 ? 'Current status' : 'Complete') : 'Upcoming'}</small></div>; })}</div></section>
      <section className="receipt-items"><h3>Order items</h3>{order.items.map((item, index) => <div className="receipt-item" key={`${item.productId}-${index}`}><i>{item.name?.[0] || 'P'}</i><div><strong>{item.name}</strong><small>Product #{String(item.productId).slice(-8)}</small></div><span>{item.quantity} × ${item.price.toFixed(2)}</span><b>${(item.quantity * item.price).toFixed(2)}</b></div>)}<div className="receipt-total"><span>Total paid</span><b>${order.totalAmount.toFixed(2)}</b></div></section>
    </motion.article>
  </motion.div>;
};
