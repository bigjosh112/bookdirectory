const express = require('express');
const Post = require('../models/book');
const Comment = require('../models/review');
const jwt = require('jsonwebtoken');

const router = express.Router();

// endpoint to like a book
router.post('/like_book', async (req, res) => {
    const {token, post_id} = req.body;

    if(!token || !post_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne({_id: post_id, likes: user._id});
        if(found)
            return res.status(400).send({status: 'error', msg: 'You already liked this book'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$push": {likes: user._id},
                "$inc": {like_count: 1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Success', post});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured', e});
    }
});

// endpoint to like a review on a book
router.post('/review_like', async (req, res) => {
    const { token, _id } = req.body;

    if(!token || !_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwy.verify(token, process.env.JWT_SECRET);

        let review = await Review.findOne({_id, likes: user._id}).lean();
        if(review)
          return res.status(400).send({status: 'error', msg: "You've already liked this review"});

        review = await Review.findOneAndUpdate(
            {_id},
            {
                '$push': {likes: user._id},
                '$inc': {like_count: 1}
            },
            {new: true}
        );
        return res.status(200).send({status: 'ok', msg: 'review liked successfully', review});
    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred', e});
    }
})

// endpoint to unlike a book
router.post('/unlike_book', async (req, res) => {
    const {token, post_id} = req.body;

    if(!token || !post_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne({_id: post_id, likes: user._id});

        if(!found)
            return res.status(400).send({status: 'error', msg: 'You haven\'t liked this post before'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$pull": {likes: user._id},
                "$inc": {like_count: -1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Success', post});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured', e});
    }
});

// endpoint to unlike a review on a book
router.post('/unlike_review', async (req, res) => {
    const { _id, token } = req.body;

    if(!_id || !token) 
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);

        let review = Review.findOne({_id, likes: user._id}).lean();
        if(!review) 
          return res.status(400).send({status: 'error', msg: 'You have not liked this comment before'});

        review = await Review.findOneAndUpdate(
            {_id, likes: user._id},
            {
                '$pull': {likes: user._id},
                '$inc': {like_count: -1}
            }
        ).lean();
        return res.status(200).send({status: 'ok', msg: 'Comment liked successfully', review});
    }catch(e) {
        console.log(e);
        return res(400).send({status: 'error', msg: 'Some error occurred', e})
    }
})
module.exports = router;