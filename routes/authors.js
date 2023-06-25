const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require('../models/book');

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  // req.query for getting info req.body sends info
  if (req.query.name != null && req.query.name !== "") {
    // RegExp is just some terms to search by
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    // res.redirect(`/authors/${newAuthor.id}`);
    res.redirect('/authors');
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error Creating Author",
    });
  }
});

// Show Authors
router.get('/:id',async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id}).limit(6).exec();
    res.render('authors/show', {
      author: author,
      books: books
    });
  } catch {
    res.redirect('/');
  }
})

// Edit Authors
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

// Update Author
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    // res.redirect(`/authors/${author.id}`);
    res.redirect("/authors");
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error Updating Author",
      });
    }
  }
});

// Delete Author
router.delete("/:id", async (req, res) => {
  let author;
  try {
    // const response = await Author.deleteOne({_id: req.params.id});
    author = await Author.findById(req.params.id);
    await author.deleteOne();
    res.redirect("/authors");
  } catch (err) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
      console.error(err);
    }
  }
});

module.exports = router;
