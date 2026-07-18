import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiAlertCircle } from 'react-icons/fi';
import { CategoryModal } from './CategoryModal';
import './AdminCategories.css';

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token || JSON.parse(localStorage.getItem('user') || 'null')?._id || ''}` }
  };
};

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  // 1. GET all categories (Public route, reverted to /api/categories)
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/categories');
      setCategories(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. POST (Add) or PUT (Update) category (Protected Admin route)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = editingId 
        ? 'http://localhost:3000/admin/category/' + editingId 
        : 'http://localhost:3000/admin/category';
      
      const method = editingId ? 'put' : 'post';
      await axios[method](url, formData, getAuthHeaders());
      
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', description: '' });
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  // 3. DELETE category (Protected Admin route)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete('http://localhost:3000/admin/category/' + id, getAuthHeaders());
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id || cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  return (
    <div className="admin-categories">
      <div className="page-header">
        <div>
          <h1>Category Management</h1>
          <p>Create, update, and organize product categories</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <FiPlus /> Add Category
        </button>
      </div>

      {error && (
        <motion.div className="error-banner" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <FiAlertCircle /> {error}
        </motion.div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading categories...</div>
      ) : (
        <div className="categories-grid">
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => (
              <motion.div
                key={cat._id || cat.id}
                className="category-card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card-icon"><FiTag /></div>
                <div className="card-content">
                  <h3>{cat.name}</h3>
                  {cat.description && <p>{cat.description}</p>}
                </div>
                <div className="card-actions">
                  <button className="btn-icon edit" onClick={() => openEditModal(cat)} title="Edit">
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(cat._id || cat.id)} title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {categories.length === 0 && !loading && (
            <div className="empty-state">
              <FiTag size={48} />
              <p>No categories found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>{showModal && <CategoryModal editing={editingId} form={formData} error={error} onChange={(key, value) => setFormData({ ...formData, [key]: value })} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}</AnimatePresence>
    </div>
  );
};
