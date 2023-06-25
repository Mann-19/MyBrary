const mongoose = require('mongoose');
const Book = require('./book');
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// authorSchema.pre mongo allows to execute some code (.pre) means before certain action occurs
// authorSchema.pre('deleteOne',{ document: true, query: false}, function(next) {
//     Book.find({ author: this._id }, (err, books) => {
//       if (err) {
//         next(err)
//       } else if (books.length > 0) {
//         next(new Error('This author has books still'))
//       } else {
//         next()
//       }
//     })
// });
authorSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
      const books = await Book.find({ author: this._id });
      if (books.length > 0) {
        const error = new Error('This author has books still');
        error.name = 'AuthorHasBooksError';
        throw error;
      }
      next();
    } catch (err) {
      next(err);
    }
  });
//   authorSchema.pre("deleteOne", async function (next) {
//     try {
//         const query = this.getFilter();
//         const hasBook = await Book.exists({ author: query._id });
  
//         if (hasBook) {
//             next(new Error("This author still has books."));
//         } else {
//             next();
//         }
//     } catch (err) {
//         next(err);
//     }
// });  

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;