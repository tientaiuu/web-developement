const Book = require('../models/Book');
const BookService = require('../services/book.service');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const BookController = {
    // Thêm một sách
    async createBook(req, res) {
        try {
            const book = await BookService.findOrCreateBook(req.body);
            console.log(book);
            res.status(201).json(book);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Nhập từ file CSV
    async importBooksFromCSV(req, res) {
        try {
            const file = req.file; // file CSV gửi từ frontend (sử dụng multer)
            const result = await BookService.importFromCSV(file.path);
            res.status(200).json({ message: "Imported successfully", result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async searchBook(req, res) {
        try {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            const { keyword } = req.query; // Sử dụng query thay vì body cho GET request
            const results = await BookService.searchBook({ keyword });
            res.status(200).json({
                success: true,
                books: results.Books,
                total: results.total
            });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Lấy sách theo ID
    async getBookById(req, res) {
        try {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            const { id } = req.params;
            const book = await BookService.getBookById(id);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }
            res.status(200).json({
                success: true,
                book: book
            });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Lấy all sách
    getAllBook: (req, res) => {
        const results = [];
        fs.createReadStream(path.join(__dirname, '../../uploads/book_data.csv'))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.json(results);
            })
            .on('error', (err) => {
                res.status(500).json({ error: 'Lỗi đọc file CSV' });
            });
    },

    // Lấy tất cả category từ file CSV
    getAllCategories: (req, res) => {
        const results = new Set();
        fs.createReadStream(path.join(__dirname, '../../uploads/book_data.csv'), { encoding: 'utf8' })
            .pipe(csv())
            .on('data', (data) => {
                if (data.category) results.add(data.category);
            })
            .on('end', () => {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.json({ categories: Array.from(results) });
            })
            .on('error', (err) => {
                res.status(500).json({ error: 'Lỗi đọc file CSV' });
            });
    },

    // Cập nhật sách
    async updateBook(req, res) {
        try {
            const { id } = req.params;
            const updatedBook = await BookService.updateBook(id, req.body);
            if (!updatedBook) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }
            res.status(200).json({
                success: true,
                book: updatedBook
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Xóa sách
    async deleteBook(req, res) {
        try {
            const { id } = req.params;
            const deletedBook = await BookService.deleteBook(id);
            if (!deletedBook) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Book deleted successfully"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = BookController;