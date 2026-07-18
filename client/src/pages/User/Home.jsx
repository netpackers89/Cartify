import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiPackage,
  FiRotateCcw,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Hero } from "../../components/Hero";

import "./Home.css";

const api = "http://localhost:3000";
const imageSrc = (image) => (image?.startsWith("/") ? `${api}${image}` : image);
const reveal = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } };
export const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  
  useEffect(() => {
    Promise.all([
      fetch(`${api}/api/products`).then((res) => res.json()),
      fetch(`${api}/api/categories`).then((res) => res.json()),
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData.slice(0, 4));
        setCategories(categoryData.slice(0, 3));
      })
      .catch(() => {});
  }, []);
  return (
    <main className="home-page">
      <Hero />
      <motion.section
        className="home-section"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <header className="home-section-head">
          <div>
            <span>CURATED FOR YOU</span>
            <h2>Best sellers</h2>
            <p>Pieces people keep coming back for.</p>
          </div>
          <Link to="/products">
            Shop all <FiArrowRight />
          </Link>
        </header>
        <div className="home-product-grid">
          {products.length ? (
            products.map((product, index) => (
              <motion.article
                key={product._id}
                className="home-product"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.09 }}
                whileHover={{ y: -8 }}
              >
                <Link to={`/products/${product._id}`}>
                  <div>
                    <img
                      src={
                        imageSrc(product.image) ||
                        "https://via.placeholder.com/450"
                      }
                      alt={product.name}
                    />
                    {!product.countInStock && <b>Sold out</b>}
                  </div>
                  <small>
                    {product.category?.name || "Cartify collection"}
                  </small>
                  <h3>{product.name}</h3>
                  <strong>${Number(product.price).toFixed(2)}</strong>
                </Link>
              </motion.article>
            ))
          ) : (
            <p className="home-empty">
              New arrivals are being selected for you.
            </p>
          )}
        </div>
      </motion.section>
      <motion.section
        className="home-categories"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <div>
          <span>SHOP BY CATEGORY</span>
          <h2>Find your next favourite.</h2>
          <p>Explore our considered selection across every collection.</p>
          <Link to="/products">
            Explore products <FiArrowRight />
          </Link>
        </div>
        <div className="category-list">
          {(categories.length
            ? categories
            : [
                { name: "New collection" },
                { name: "Everyday essentials" },
                { name: "Trending now" },
              ]
          ).map((category, index) => (
            <Link to="/products" key={category._id || category.name}>
              <b>0{index + 1}</b>
              <span>{category.name}</span>
              <FiArrowRight />
            </Link>
          ))}
        </div>
      </motion.section>
      <motion.section
        className="home-perks"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.12 }}
      >
        {[
          [FiTruck, "Free delivery", "On orders over $100"],
          [FiShield, "Secure checkout", "Protected payments"],
          [FiRotateCcw, "Easy returns", "Simple 14-day returns"],
          [FiPackage, "Carefully packed", "Delivered with care"],
        ].map(([Icon, title, text]) => (
          <motion.article variants={reveal} key={title}>
            <i>
              <Icon />
            </i>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </motion.article>
        ))}
      </motion.section>
    </main>
  );
};
