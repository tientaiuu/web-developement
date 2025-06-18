const mongoose = require('mongoose');

const Book_Schema = mongoose.Schema(
    {
        id:{
            type:String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        authors: {
            type: String,
            required: true
        },
        original_price: {
            type: Number,
            required: true
        },
        current_price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        n_review: {
            type: Number,
            default: 0
        },
        avg_rating: {
            type: Number,
            default: 0
        },
        pages: {
            type: Number,
            default: 0
        },
        manufacturer: {
            type: String,
            default: ''
        },
        cover_link: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

Book_Schema.index({ title: 1 });
Book_Schema.index({ authors: 1 });
Book_Schema.index({ category: 1 });

module.exports = mongoose.model('Book', Book_Schema);