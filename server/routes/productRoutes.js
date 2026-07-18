const router = require('express').Router();
const ctrl = require('../controllers/productController');
const pCtrl = require('../controllers/productController');

router.get('/products', ctrl.getProducts);
router.get('/products/:id', ctrl.getProduct);
router.get('/products/:id', ctrl.getProductById);
router.get('/categories', ctrl.getCategories);
router.get('/favorites/:userId', ctrl.getFavorites);
router.put('/:productId/favorite', pCtrl.toggleFavorite);
module.exports = router;
