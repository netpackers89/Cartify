import React from 'react';
import './About.css';

export const About = () => (
  <main className="about-page">
    <section className="about-hero">
      <h1>Cartify</h1>
      <p>We build smart shopping with real stock, fast delivery, and a warm community.</p>
    </section>

    <section className="story-card">
      <h2>Our story</h2>
      <p>Cartify started as a small idea: make buying easy and honest. Every product has real stock, every order is checked in real time, and every customer gets a clear status from pending to delivered.</p>
    </section>

    <section className="values-grid">
      <article>
        <h3>Fast stock checks</h3>
        <p>We reserve items as soon as a customer orders, so nothing sells twice. If stock runs out, the order is rejected cleanly and users can try again.</p>
      </article>
      <article>
        <h3>Modern cart flow</h3>
        <p>Search products, see details, and shop with confidence. If something is out of stock, the app shows a clear badge and disables checkout.</p>
      </article>
      <article>
        <h3>Easy support</h3>
        <p>Our goal is simple: the best experience for buyers and sellers. The design is clean, the code is short, and the shopping flow stays smooth.</p>
      </article>
    </section>
  </main>
);
