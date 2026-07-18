import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiInstagram, FiMail, FiMapPin, FiTwitter  } from "react-icons/fi";
import { FaGithub } from "react-icons/fa6";
import "./Footer.css";

export const Footer = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link className="footer-brand" to="/">
            Cartify
          </Link>
          <p>Thoughtfully selected products, delivered with care.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/products">All products</Link>
          <Link to="/cart?tab=tracking">My orders</Link>
          <Link to="/about">About</Link>
        </div>
        <div>
          <h3>Help</h3>
          <a href="mailto:hello@cartify.store">
            <FiMail /> hello@cartify.store
          </a>
          <span>
            <FiMapPin /> Addis Ababa, Ethiopia
          </span>
        </div>
        <div>
          <h3>Stay connected</h3>
          <div className="social-links">
            <a href="https://www.instagram.com/netsanet_dest?igsh=MWN6bDY5bHJ3bDVuMA==" >
              <FiInstagram />
            </a>
            <a href="#twitter" >
              <FiTwitter />
            </a>
            <a href="https://github.com/netpackers89"><FaGithub /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Cartify. All rights reserved.</span>
        <span>Secure checkout · Order tracking</span>
      </div>
    </footer>
  );
};
