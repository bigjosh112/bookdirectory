const mongoose = require('mongoose');
const express = require('express');
const Post = require('../models/book');
const jwt = require('jsonwebtoken');
const { post } = require('./book');

const router = express.Router();

// endpoint to dislike a book
router.post('/dislike_book', async (req, res) => {
    const {token, post_id} = req.body;

    try{
        if(!token || !post_id)
          return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne(
            {_id: post_id, dislikes: user._id}
        )
        if(!found)
          res.status(400).send({staus: 'error', msg: "You've disliked this book before" });

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$push": {dislikes: user._id},
                "$inc": {dislike_count: 1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Book disliked successfully', post});
    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred'});
    }
})
// endpoint to dislike a review on a book
router.post('/dislike_review', async (req, res) => {
    const { token, _id } = req.body;
    if(!token || !_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        let review = await Review.findOne({_id, dislikes: user._id});

        if(review)
          return res.status(400).send({status: 'error', msg: 'You have disliked this review before'});

        review = await Review.findOneAndUpdate(
            {_id, dislikes: user._id},
            {
                '$push': {dislikes: user._id},
                '$inc': {dislike_count: 1},
            },
            {new: true}
        );
        return res.status(200).send({status: 'ok', msg: 'Review disliked successfully', review});

    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred', e});
    }
});
// endpoint to undislike a book
router.post('/undislike_book', async (req, res) => {
    const {token, post_id} = req.body;

    if(!token || !post_id)
      res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    
    try{
        const user = jwt.verify(token, JWT_SECRET);

        const found = await Post.findOne({_id: post_id, dislikes: user._id});
        if(!found)
          res.status(400).send({status: 'error', msg: "Haven't disliked this book before"});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$pull": {dislikes: user.id},
                "$inc": {dislike_count: -1}
            },
            {new: true}
        ).lean();

        res.status(200).send({status: 'ok', msg: 'Book un_disliked successfully', post});
    }catch(e) {
        console.log(e);
        res.status(400).send({status: 'error', msg: 'Some error occurred'});
    }
});

// endpoint to undislike a rerview on a book
router.post('/dislike_review', async (req, res) => {
    const { token, _id } = req.body;
    if(!token || !_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        let review = await Review.findOne({_id, dislikes: user._id});

        if(!review)
          return res.status(400).send({status: 'error', msg: 'You have not disliked this review before'});

        review = await Review.findOneAndUpdate(
            {_id, dislikes: user._id},
            {
                '$pull': {dislikes: user._id},
                '$inc': {dislike_count: -1},
            },
            {new: true}
        );
        return res.status(200).send({status: 'ok', msg: 'Review undisliked successfully', review});

    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred', e});
    }
});
module.exports = router;