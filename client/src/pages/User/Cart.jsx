import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiMinus, FiPackage, FiPlus, FiShoppingBag, FiTrash2, FiTruck } from "react-icons/fi";
import { OrderReceipt } from "../../components/OrderReceipt";
import "./Cart.css";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

export const Cart = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "tracking" ? "tracking" : "cart");
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activeTab !== "tracking" || !user?._id) return;
    setLoadingOrders(true);
    axios.get(`http://localhost:3000/orders/${user._id}`)
      .then((response) => setOrders(response.data))
      .catch(() => setMessage("We couldn't load your orders. Please try again."))
      .finally(() => setLoadingOrders(false));
  }, [activeTab, user?._id]);

  const setTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === "tracking" ? { tab: "tracking" } : {});
    setMessage("");
  };

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartChanged"));
  };

  const updateQuantity = (id, amount) => updateCart(cartItems.map((item) => {
    const stock = Number(item.countInStock); const cap = Number.isFinite(stock) && stock > 0 ? stock : Infinity;
    return item._id === id ? { ...item, quantity: Math.min(cap, Math.max(1, Number(item.quantity || 1) + amount)) } : item;
  }));

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), [cartItems]);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;
  const total = subtotal + shipping;

  const checkout = async () => {
    if (!user?._id) { setMessage("Please log in before checking out."); return; }
    if (!cartItems.length) return;
    setCheckingOut(true); setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/orders", {
        userId: user._id,
        items: cartItems.map((item) => ({ productId: item._id, name: item.name, quantity: Number(item.quantity || 1), price: Number(item.price || 0) })),
        totalAmount: total,
      });
      if (response.data.status === 'Rejected') { setMessage(response.data.note); setSelectedOrder(response.data); return; }
      updateCart([]);
      setSelectedOrder(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Checkout couldn't be completed. Please try again.");
    } finally { setCheckingOut(false); }
  };

  return <main className="cart-page">
    <header className="cart-header">
      <div><span className="cart-eyebrow">YOUR SHOPPING BAG</span><h1>{activeTab === "cart" ? "Shopping cart" : "Order tracking"}</h1><p>{activeTab === "cart" ? "Review your selections before checkout." : "Follow every order from confirmation to delivery."}</p></div>
      <div className="tabs" aria-label="Cart navigation"><button className={`tab-btn ${activeTab === "cart" ? "active" : ""}`} onClick={() => setTab("cart")}>Cart <span>{cartItems.length}</span></button><button className={`tab-btn ${activeTab === "tracking" ? "active" : ""}`} onClick={() => setTab("tracking")}>Track orders</button></div>
    </header>

    {message && <p className="cart-message" role="alert">{message}</p>}
    {activeTab === "cart" ? <section className="cart-view">
      <div className="cart-items-panel">
        <div className="cart-table-head"><span>Product</span><span>Quantity</span><span>Total</span></div>
        {cartItems.length ? cartItems.map((item) => <article className="cart-item" key={item._id}>
          <img src={item.image || "https://via.placeholder.com/160"} alt={item.name} />
          <div className="item-details"><span>{item.category?.name || "Cartify collection"}</span><h2>{item.name}</h2><p>{formatCurrency(item.price)} each</p><button className="remove-btn" onClick={() => updateCart(cartItems.filter((cartItem) => cartItem._id !== item._id))}><FiTrash2 /> Remove</button></div>
          <div className="qty-control" aria-label={`Quantity for ${item.name}`}><button onClick={() => updateQuantity(item._id, -1)} aria-label="Decrease quantity"><FiMinus /></button><strong>{item.quantity || 1}</strong><button onClick={() => updateQuantity(item._id, 1)} aria-label="Increase quantity"><FiPlus /></button></div>
          <strong className="item-total">{formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}</strong>
        </article>) : <div className="empty-state"><FiShoppingBag /><h2>Your cart is empty</h2><p>Find something special and it will appear here.</p><Link to="/products">Browse products <FiArrowRight /></Link></div>}
      </div>
      <aside className="cart-summary"><span>ORDER SUMMARY</span><h2>Ready when you are.</h2><div className="summary-row"><span>Subtotal</span><b>{formatCurrency(subtotal)}</b></div><div className="summary-row"><span>Shipping</span><b>{shipping ? formatCurrency(shipping) : "Free"}</b></div><p className="shipping-note">Free delivery on orders over $100.</p><div className="summary-row total"><span>Total</span><b>{formatCurrency(total)}</b></div><button className="checkout-btn" disabled={!cartItems.length || checkingOut} onClick={checkout}>{checkingOut ? "Processing…" : <>Proceed to checkout <FiArrowRight /></>}</button><p className="secure-note"><FiCheckCircle /> Secure checkout</p></aside>
    </section> : <section className="orders-view">
      {!user ? <div className="empty-state"><FiPackage /><h2>Track your purchases</h2><p>Log in to view orders and delivery updates.</p><Link to="/login">Log in</Link></div> : loadingOrders ? <p className="loading-state">Loading your orders…</p> : orders.length ? orders.map((order) => <article className="order-card" key={order._id}><div className="order-icon"><FiPackage /></div><div><span>ORDER #{order._id.slice(-7).toUpperCase()}</span><h2>{order.items.length} item{order.items.length === 1 ? "" : "s"} · {formatCurrency(order.totalAmount)}</h2><p>Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className={`status ${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span><button onClick={() => setSelectedOrder(order)}>View progress <FiTruck /></button></article>) : <div className="empty-state"><FiPackage /><h2>No orders yet</h2><p>Your completed purchases will be listed here.</p><Link to="/products">Start shopping <FiArrowRight /></Link></div>}
    </section>}
    {selectedOrder && <OrderReceipt order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
  </main>;
};
