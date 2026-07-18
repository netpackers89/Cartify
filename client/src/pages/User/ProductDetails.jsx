import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Products.css';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load product');
        navigate('/products');
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="loading-state">Loading product...</div>;
  if (!product) return null;

  const available = (product.countInStock || 0) - (product.reservedCount || 0);

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)}>Back</button>
      <div className="product-detail">
        <img src={product.image} alt={product.name} />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <p className={`stock ${available <= 0 ? 'out' : 'in'}`}>
            {available <= 0 ? 'Out of Stock' : `${available} available`}
          </p>
        </div>
      </div>
    </div>
  );
};
