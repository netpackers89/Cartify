const Product = require('../models/Product');
const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (err) {
        const status = err.code === 11000 ? 409 : 400;
        res.status(status).json({ message: err.code === 11000 ? 'Category name already exists' : err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.addProduct = async (req, res) => {
    try {
        const payload = { ...req.body, image: req.file ? `/uploads/${req.file.filename}` : req.body.image };
        const newProduct = await Product.create(payload);
        res.status(201).json(await newProduct.populate('category'));
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category'); 
        res.json(products);
    } catch (err) { res.status(500).json(err); }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getProductById = async (req, res) => {
    try {
        const prod = await Product.findById(req.params.id).populate('category');
        if (!prod) return res.status(404).json({ message: 'Product not found' });
        res.json(prod);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const payload = { ...req.body, ...(req.file && { image: `/uploads/${req.file.filename}` }) };
        const updated = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).populate('category');
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json(updated);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deletProduct= async(req, res)=>{
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: "Product deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

exports.toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId } = req.body;
        if (!userId) return res.status(401).json({ message: 'Please log in to manage favorites' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        // Check if user already favorited it
        const isFavorited = product.favoritedBy.some(id => id.toString() === userId);

        if (isFavorited) {
            // Remove user
            await Product.findByIdAndUpdate(productId, { $pull: { favoritedBy: userId } });
            res.json({ message: "Removed from favorites" });
        } else {
            // Add user
            await Product.findByIdAndUpdate(productId, { $addToSet: { favoritedBy: userId } });
            res.json({ message: "Added to favorites" });
        }
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getFavorites = async (req, res) => {
    try {
        const products = await Product.find({ favoritedBy: req.params.userId }).populate('category');
        res.json(products);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// ✅ ADD THESE TO controllers/productController.js

exports.updateCategory = async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Returns updated doc + validates unique name
        );
        
        if (!updated) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json(updated);
    } catch (err) {
        // Handle duplicate name errors specifically
        if (err.code === 11000) {
            return res.status(409).json({ message: "Category name already exists" });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        // Optional safety check: Prevent deletion if products still use this category
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete: ${productCount} products are still assigned to this category` 
            });
        }

        const deleted = await Category.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
