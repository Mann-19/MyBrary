const express = require("express");
const { route } = require(".");
const router = express.Router();
const Author = require('../models/author');

// All Authors Route
router.get('/', async (req, res) => {
    const searchOptions = {};
    // req.query for getting info req.body sends info
    if(req.query.name != null && req.query.name !== '') {
    // RegExp is just some terms to search by
        searchOptions.name = new RegExp(req.query.name, 'i')  
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
})

// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save();
        res.redirect('authors');
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }
});


module.exports = router;