const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: String,
    post_id: String,
    review_id: String,
    owner_name: String,
    owner_img: String,
    timestamp: Number,
    edited: {type: Boolean, default: false},
    likes: [String],
    like_count: {type: Number, default: 0},
    dislikes: [String],
    dislike_count: {type: Number, default: 0},
}, {collection: 'review'});

const model = mongoose.model('Review', reviewSchema);
module.exports = model; 
