const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const Stripe = require('stripe');
const stripe = Stripe('your-stripe-secret-key');  // قم بتغيير هذا مع مفتاحك السري

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// اتصال MongoDB
mongoose.connect('mongodb://localhost:27017/dietStore', { useNewUrlParser: true, useUnifiedTopology: true });

// تعريف المخطط للمنتجات
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  imageUrl: String
});
const Product = mongoose.model('Product', productSchema);

// إعداد multer لتحميل الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// API لرفع المنتجات
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const imageUrl = req.file.path;
  const newProduct = new Product({ name, description, price, imageUrl });
  newProduct.save()
    .then(() => res.status(201).send('تم رفع المنتج بنجاح'))
    .catch(err => res.status(500).send('فشل في رفع المنتج'));
});

// API لاسترجاع المنتجات
app.get('/api/products', (req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch(err => res.status(500).send('فشل في استرجاع المنتجات'));
});

// إعداد Stripe لدفع الأموال
app.post('/api/checkout', (req, res) => {
  const { amount } = req.body;
  stripe.paymentIntents.create({
    amount: amount,
    currency: 'egp',
  })
    .then(intent => res.json({ clientSecret: intent.client_secret }))
    .catch(err => res.status(500).send('خطأ في الدفع'));
});

// بدء الخادم
app.listen(5000, () => console.log('Server started on port 5000'));
