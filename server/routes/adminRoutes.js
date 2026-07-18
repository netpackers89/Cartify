const router = require('express').Router();
const pCtrl = require('../controllers/productController');
const oCtrl = require('../controllers/orderController');
const uCtrl = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadPath, { recursive: true });
const upload = multer({ storage: multer.diskStorage({
  destination: uploadPath,
  filename: (_, file, done) => done(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
}), fileFilter: (_, file, done) => done(null, file.mimetype.startsWith('image/')) });

// Image upload (file field name: "image")
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Return the public path for the uploaded file
    res.json({ url: `/uploads/${req.file.filename}` });
});

// Product Management
router.post('/product', upload.single('image'), pCtrl.addProduct);
router.put('/product/:id', upload.single('image'), pCtrl.updateProduct);
router.delete('/product/:id', pCtrl.deletProduct);

// Sales & User Reports
router.get('/users', uCtrl.getAllUsers);
router.put('/users/:id', uCtrl.updateUser);
router.delete('/users/:id', uCtrl.deleteUser);
router.get('/sales-graph', oCtrl.getSalesGraphData);
router.get('/orders', oCtrl.getAllOrders);
router.put('/orders/:id/status', oCtrl.updateStatus);

router.post('/category', pCtrl.addCategory);
router.get('/categories', pCtrl.getCategories); // If needed in admin context
router.put('/category/:id', pCtrl.updateCategory);
router.delete('/category/:id', pCtrl.deleteCategory);

module.exports = router;
