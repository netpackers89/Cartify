import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiX, FiUser } from 'react-icons/fi';
import './AdminUsers.css';

const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || 'null')?._id || ''}` } });

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/admin/users', auth());
      setUsers(data);
    } catch (err) { setError(err.response?.data?.message || 'Unable to load users'); }
  };
  useEffect(() => { loadUsers(); }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/users/${editing._id}`, form, auth());
      setEditing(null); setError(''); loadUsers();
    } catch (err) { setError(err.response?.data?.message || 'Unable to update customer'); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this customer? This cannot be undone.')) return;
    try { await axios.delete(`http://localhost:3000/admin/users/${id}`, auth()); loadUsers(); }
    catch (err) { setError(err.response?.data?.message || 'Unable to delete customer'); }
  };

  return <div className="admin-users">
    <div className="users-header"><h1>Customers ({users.length})</h1><p>View, update, or remove customer accounts.</p></div>
    {error && <p className="form-error">{error}</p>}
    <div className="users-grid">
      {users.map((u, i) => <motion.div key={u._id} className="user-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
        <div className="user-avatar">{u.name?.[0]?.toUpperCase() || 'U'}</div>
        <div className="user-info"><h3>{u.name}</h3><p className="user-email">{u.email}</p><span className="role-badge customer"><FiUser /> Customer</span></div>
        <div className="action-buttons"><button className="edit-btn" aria-label="Edit customer" onClick={() => { setEditing(u); setForm({ name: u.name, email: u.email }); }}><FiEdit2 /></button><button className="delete-btn" aria-label="Delete customer" onClick={() => remove(u._id)}><FiTrash2 /></button></div>
      </motion.div>)}
    </div>
    <AnimatePresence>{editing && <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)}>
      <motion.form className="modal" onClick={e => e.stopPropagation()} onSubmit={save} initial={{ scale: .95 }} animate={{ scale: 1 }}>
        <div className="modal-header"><h2>Edit customer</h2><button className="close-btn" type="button" onClick={() => setEditing(null)}><FiX /></button></div>
        <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
        <div className="modal-actions"><button className="cancel-btn" type="button" onClick={() => setEditing(null)}>Cancel</button><button className="save-btn" type="submit">Save changes</button></div>
      </motion.form>
    </motion.div>}</AnimatePresence>
  </div>;
};
