require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

const connectDB = require('./src/config/db');
connectDB();

const cookieParser = require("cookie-parser");
const { rmSync } = require('fs');
app.use(cookieParser());

// Thêm CORS middleware
app.use(cors());

app.use(express.json());
app.use(body_parser.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/customer', require('./src/routes/customer.routes'));
app.use('/api/rules', require('./src/routes/rule.routes'))
app.use('/api/books', require('./src/routes/book.routes'))
app.use('/api/import-slip', require('./src/routes/importslip.routes'))
app.use('/api/sales-invoice', require('./src/routes/salesinvoice.routes'))
app.use('/api/payment-receipt', require('./src/routes/receipt.routes'))
app.use('/api/reports', require('./src/routes/report.routes'))
app.use('/api/favourite', require('./src/routes/favourite.routes'))

app.use('/js', express.static(path.join(__dirname, 'UI', 'assets', 'js')));
app.use('/components', express.static(path.join(__dirname, 'UI', 'components')));
app.use('/assets', express.static(path.join(__dirname, 'UI', 'assets')));
app.use('/logo.svg', express.static(path.join(__dirname, 'UI', 'logo.svg')));
app.use('/favicon.svg', express.static(path.join(__dirname, 'UI', 'favicon.svg')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './UI/pages', 'HomePage.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './UI/pages', 'login.html'));
});

app.get('/books', (req, res) => {
    res.sendFile(path.join(__dirname, './UI/pages', 'books.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, './UI/pages', 'aboutUs.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, './UI/pages', 'ErrorPage.html'));
});

module.exports = app; // Export app để server.js sử dụng