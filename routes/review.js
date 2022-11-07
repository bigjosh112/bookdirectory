const express = require('express');
const Post = require('../models/book');
const Review = require('../models/review')
const jwt = require('jsonwebtoken');

const router = express.Router();

// endpoint to make a review on a post
router.post('/review', async (req, res) => {
    const {token, review, post_id, owner_name} = req.body;

    if(!token || !post_id || !review || !owner_name){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    const timestamp = Date.now();

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        let mReview = await new Review;
        mReview.review = review;
        mReview.post_id = post_id;
        mReview.owner_id = user._id;
        mReview.owner_name = owner_name;
        mReview.timestamp = timestamp;
        mReview = await mReview.save();

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {"$inc": {comment_count: 1}},
            {new: true}
        );
        return res.status(200).send({status: 'ok', msg: 'Success', post, review: mReview});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to get reviews of a post
router.post('/get_reviews', async (req, res) => {
    const {token, post_id, pagec} = req.body;

    if(!token || !post_id || !pagec){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const resultsPerPage = 2;
        let page = pagec >= 1 ? pagec : 1;
        page = page -1;

        const reviews = await Review.find({post_id})
        .sort({timestamp: 'desc'})
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .lean();

        return res.status(200).send({status: 'ok', msg: 'Success', reviews});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to edit a review 
router.post('/edit_review', async (req, res) => {
    const { token, _id, review_body } = req.body;

    if(!token, _id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);

        let review = await Review.findOneAndUpdate(
            {_id},
            {edited: true},
            {review: review_body || review.review},
            {new: true}
        );
        if(!review) 
          return res.status(404).send({status: 'ENOENT', msg: 'review not found'});
    
        return res.status(200).send({status: 'ok', msg: 'review updated successfully', review});
    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred'})
    }
});

// endpoint to delete a review
router.post('/delete_review', async (req, res) => {
    const { token, _id, post_id } = req.body;
    if(!token || !_id || !post_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
      
    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const review = await Review.findOneAndDelete({_id});
        if(!review)
          return res.status(400).send({status: 'error', msg: 'Review not found'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {'$inc': {review_count: -1}},
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Review deleted successfully', post});
    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred'});
    }
});
module.exports = router; 