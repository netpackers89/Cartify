import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Products.css";


const api = "http://localhost:3000";
const imageSrc = (image) => (image?.startsWith("/") ? `${api}${image}` : image);
const user = () => JSON.parse(localStorage.getItem("user") || "null");
export const Products = () => {
  const [products, setProducts] = useState([]),
    [categories, setCategories] = useState(["All"]),
    [selected, setSelected] = useState("All"),
    [favorites, setFavorites] = useState(() =>
      JSON.parse(localStorage.getItem("favorites") || "[]"),
    ),
    [feedback, setFeedback] = useState("");



    
  const navigate = useNavigate();
  useEffect(() => {
    Promise.all([
      axios.get(`${api}/api/products`),
      axios.get(`${api}/api/categories`),
    ])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(["All", ...c.data.map((x) => x.name)]);
      })
      .catch(console.error);
  }, []);
  const add = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const current = cart.find((item) => item._id === product._id);
    if ((current?.quantity || 0) >= product.countInStock) return;
    localStorage.setItem(
      "cart",
      JSON.stringify(
        current
          ? cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...cart, { ...product, quantity: 1 }],
      ),
    );
    window.dispatchEvent(new Event("cartChanged"));
    setFeedback(product._id);
    setTimeout(() => setFeedback(""), 1200);
  };
  const favorite = async (event, id) => {
    event.stopPropagation();
    if (!user()) return alert("Please log in to add favorites.");
    try {
      await axios.put(`${api}/api/${id}/favorite`, { userId: user()._id });
      const next = favorites.includes(id)
        ? favorites.filter((x) => x !== id)
        : [...favorites, id];
      setFavorites(next);
      localStorage.setItem("favorites", JSON.stringify(next));
    } catch {
      alert("Unable to update favorite.");
    }
  };
  const visible =
    selected === "All"
      ? products
      : products.filter((product) => product.category?.name === selected);
  return (
    <main className="products-page">
      <header className="products-header">
        <h1>Explore our collection</h1>
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selected === category ? "active" : ""}`}
              onClick={() => setSelected(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
      <motion.section className="products-grid" layout>
        <AnimatePresence>
          {visible.map((product) => (
            <motion.article
              className="product-card"
              key={product._id}
              layout
              whileHover={{ y: -7 }}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <div className="card-image-wrapper">
                <img
                  src={
                    imageSrc(product.image) || "https://via.placeholder.com/500"
                  }
                  alt={product.name}
                />
                <button
                  className={`favorite-btn ${favorites.includes(product._id) ? "is-favorite" : ""}`}
                  onClick={(event) => favorite(event, product._id)}
                >
                  <FiHeart />
                </button>
                {!product.countInStock && (
                  <span className="stock-badge">Out of stock</span>
                )}
              </div>
              <div className="card-details">
                <div className="card-header">
                  <h2>{product.name}</h2>
                  <span className="rating">
                    <FiStar /> 4.8
                  </span>
                </div>
                <p className="category">
                  {product.category?.name || "General"} ·{" "}
                  {product.countInStock || 0} left
                </p>
                <div className="card-footer">
                  <b className="price">${Number(product.price).toFixed(2)}</b>
                  <button
                    className="add-to-cart-btn"
                    disabled={!product.countInStock}
                    onClick={(event) => {
                      event.stopPropagation();
                      add(product);
                    }}
                  >
                    <FiShoppingCart />
                    {!product.countInStock
                      ? "Sold out"
                      : feedback === product._id
                        ? "Added!"
                        : "Add"}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.section>
    </main>
  );
};
