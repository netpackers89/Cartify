import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

// Smooth spring animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 80, damping: 20 } 
  }
};

export const Hero = () => {
  const { scrollY } = useScroll();
  const heroOffset = useTransform(scrollY, [0, 650], [0, 80]);
  return (
    <motion.div 
      className="hero-parent"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ y: heroOffset }}
    >
      {/* Main Image Block */}
      <motion.div 
        className="div1"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="content">
          <motion.span 
            className="badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            New Collection 2024
          </motion.span>
          <h1>Elevate Your <br/> Everyday Style.</h1>
          <motion.button 
            className="hero-btn"
            whileHover={{ scale: 1.05, backgroundColor: "#d3d3d3", color: "#000000" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Collection
          </motion.button>
        </div>
      </motion.div>

      {/* Side Block (Trending) */}
      <motion.div 
        className="div2"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="div2-content">
          <div className="floating-icon">✦</div>
          <h3>Trending Now</h3>
          <p>Curated picks just for you.</p>
        </div>
      </motion.div>

      {/* Bottom Banner */}
      <motion.div 
        className="div3"
        variants={itemVariants}
      >
        <div className="marquee-content">
          <span>✦ Free Shipping on First Order</span>
          <span>✦ Premium Quality Guaranteed</span>
          <span>✦ 24/7 Customer Support</span>
          <span>✦ Easy Returns</span>
          <span>✦ Secure Payment</span>

        </div>
      </motion.div>
    </motion.div>
  );
}
