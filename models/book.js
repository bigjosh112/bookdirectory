const mongoose = require ('mongoose');

const postSchema = mongoose.Schema(
    {
        title:{type: String, require: true},
        author:{type: String, require: true},
        summary: String,
        number_of_pages: String,
        date_released: String,
        book: [String],
        book_ids: [String],
        description: String,
        timestamp: Date,
        edited: {type: Boolean, default: false},
        edited_at: Date,
        owner_id: String,
        owner_name: String,
        review_count: {type: Number, default: 0},
        like_count: {type: Number, default: 0},
        dislike_count: {type: Number, default: 0},
        dislikes: [String],
        likes: [String],
         stats: {
            post_count: { type: Number, default: 0 }
         }
    },
    { collection: 'posts'}

);

const model = mongoose.model('Post', postSchema);

module.exports = model;