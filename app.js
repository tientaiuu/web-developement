require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

// Sử dụng đúng đường dẫn tới connectDB
const connectDB = require('./Backend/src/config/db');
connectDB();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Thêm CORS middleware
app.use(cors());

app.use(express.json());
app.use(body_parser.json());
app.use(express.urlencoded({ extended: true }));

// Đăng ký các route API
app.use('/api/auth', require('./Backend/src/routes/auth.routes'));
app.use('/api/customer', require('./Backend/src/routes/customer.routes'));
app.use('/api/rules', require('./Backend/src/routes/rule.routes'));
app.use('/api/books', require('./Backend/src/routes/book.routes'));
app.use('/api/import-slip', require('./Backend/src/routes/importslip.routes'));
app.use('/api/sales-invoice', require('./Backend/src/routes/salesinvoice.routes'));
app.use('/api/payment-receipt', require('./Backend/src/routes/receipt.routes'));
app.use('/api/reports', require('./Backend/src/routes/report.routes'));
app.use('/api/favourite', require('./Backend/src/routes/favourite.routes'));

// Phục vụ tĩnh các thư mục con của Frontend
app.use('/assets', express.static(path.resolve(__dirname, 'Frontend/assets')));
app.use('/components', express.static(path.resolve(__dirname, 'Frontend/components')));
app.use('/pages', express.static(path.resolve(__dirname, 'Frontend/pages')));

// Route cho các trang chính
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend/pages/HomePage.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend/pages/login.html'));
});

app.get('/books', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend/pages/books.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend/pages/aboutUs.html'));
});

// Route động cho chi tiết sách
app.get('/books/:id-:slug', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend/pages/bookDetail.html'));
});

app.get('/books/:slug', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend/pages/bookDetail.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/pages/settingA.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/pages/payment.html'));
});


app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/pages/myOrder.html'));
});

app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/pages/reviews.html'));
});

// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, './UI/pages', 'erorr.html'));
// });



module.exports = app; // Export app để server.js sử dụng