import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminSales.css';

const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || 'null')?._id || ''}` } });

export const AdminSales = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');
  const load = async () => {
    try { const { data } = await axios.get('http://localhost:3000/admin/orders', auth()); setOrders(data); }
    catch (err) { setError(err.response?.data?.message || 'Unable to load orders'); }
  };
  useEffect(() => { load(); }, []);
  const updateStatus = async (id, status) => {
    setSaving(id); setError('');
    try {
      const { data } = await axios.put(`http://localhost:3000/admin/orders/${id}/status`, { status }, auth());
      setOrders(orders.map(order => order._id === id ? data : order));
    } catch (err) { setError(err.response?.data?.message || 'Unable to update order'); }
    finally { setSaving(''); }
  };
  return <div className="admin-sales">
    <div className="page-header"><div><h1>Sales & Orders</h1><p>Review customer orders and update fulfilment status.</p></div><button className="refresh-btn" onClick={load}>Refresh</button></div>
    {error && <p className="form-error">{error}</p>}
    <div className="table-container"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead><tbody>
      {orders.map(order => <tr key={order._id}><td>#{order._id.slice(-6).toUpperCase()}</td><td>{order.user?.name || 'Deleted user'}<br /><small>{order.user?.email}</small></td><td>{order.items.map(item => `${item.quantity}× ${item.name}`).join(', ')}</td><td>${Number(order.totalAmount).toFixed(2)}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td><select value={order.status} disabled={saving === order._id || order.status !== 'Pending'} onChange={e => updateStatus(order._id, e.target.value)}>{(order.status === 'Pending' ? ['Pending', 'Approved', 'Rejected'] : [order.status]).map(status => <option key={status}>{status}</option>)}</select></td></tr>)}
      {!orders.length && <tr><td colSpan="6">No orders yet.</td></tr>}
    </tbody></table></div>
  </div>;
};
