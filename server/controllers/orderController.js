const Order = require('../models/Order');
const Product = require('../models/Product');

const completedOrders = () => Order.updateMany({ status: 'On Delivery', deliveryStartedAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) } }, { status: 'Completed' });
const reserveItem = (item) => Product.findOneAndUpdate({ _id: item.productId, countInStock: { $gte: item.quantity } }, { $inc: { countInStock: -item.quantity } }, { new: true });
const restoreItems = (items) => Promise.all(items.map(item => Product.findByIdAndUpdate(item.productId, { $inc: { countInStock: item.quantity } })));
setInterval(() => completedOrders().catch(console.error), 60 * 1000).unref();

exports.createOrder = async (req, res) => {
  const { userId, items = [], totalAmount } = req.body;
  if (!userId || !items.length) return res.status(400).json({ message: 'An order needs a customer and at least one item.' });
  const reserved = [];
  try {
    for (const item of items) {
      const quantity = Number(item.quantity);
      const product = item.productId && quantity > 0 && Number.isInteger(quantity) && await reserveItem({ ...item, quantity });
      if (!product) {
        await restoreItems(reserved);
        const rejected = await Order.create({ user: userId, items, totalAmount, status: 'Rejected', note: 'This order could not be reserved because one or more products are out of stock. Please review availability and order again.' });
        return res.status(201).json(rejected);
      }
      reserved.push({ productId: product._id, name: product.name, price: product.price, quantity });
    }
    const total = reserved.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.status(201).json(await Order.create({ user: userId, items: reserved, totalAmount: total, status: 'Pending', note: 'Stock reserved. Your order is waiting for approval.' }));
  } catch (err) { await restoreItems(reserved); res.status(400).json({ message: err.message }); }
};

exports.getAllOrders = async (_, res) => { try { await completedOrders(); res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); } };

exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status } = req.body;
    if (status === 'Approved') { order.status = 'On Delivery'; order.deliveryStartedAt = new Date(); order.note = 'Approved and on delivery. It will complete automatically in about 30 minutes.'; }
    else if (status === 'Rejected' && !order.status.match(/Rejected|Completed/)) { await restoreItems(order.items); order.status = 'Rejected'; order.note = 'Your order was rejected. Reserved stock has been returned.'; }
    else if (status === 'Pending') order.status = status;
    else return res.status(400).json({ message: 'Invalid status' });
    await order.save();
    if (order.status === 'On Delivery') setTimeout(() => Order.findOneAndUpdate({ _id: order._id, status: 'On Delivery' }, { status: 'Completed' }).catch(console.error), 30 * 60 * 1000);
    res.json(await order.populate('user', 'name email'));
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getSalesReport = async (_, res) => { try { await completedOrders(); const [report] = await Order.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]); res.json(report || { totalRevenue: 0, count: 0 }); } catch (err) { res.status(500).json({ message: err.message }); } };
exports.getSalesGraphData = async (_, res) => { try { await completedOrders(); res.json(await Order.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }])); } catch (err) { res.status(500).json({ message: err.message }); } };
exports.getUserOrders = async (req, res) => { try { await completedOrders(); res.json(await Order.find({ user: req.params.userId }).sort({ createdAt: -1 })); } catch (err) { res.status(400).json({ message: err.message }); } };
