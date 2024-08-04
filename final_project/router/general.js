const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Promise-based approach
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      axios.get(`/books?title=${title}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  // Async/await approach
  async function getBooksByTitleAsync(title) {
    try {
      const response = await axios.get(`/books?title=${title}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Use the getBooksByTitle or getBooksByTitleAsync function in your routes
  regd_users.get('/books', (req, res) => {
    const title = req.query.title;
  
    if (title) {
      getBooksByTitle(title)
        .then(books => {
          res.status(200).json(books);
        })
        .catch(error => {
          res.status(500).json({ message: 'Error fetching books by title', error: error.message });
        });
    } else {
      res.status(200).json(books);
    }
  });
  
  regd_users.get('/books-async', async (req, res) => {
    const title = req.query.title;
  
    if (title) {
      try {
        const books = await getBooksByTitleAsync(title);
        res.status(200).json(books);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching books by title', error: error.message });
      }
    } else {
      res.status(200).json(books);
    }
  });

  
// Promise-based approach
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      axios.get(`/books?author=${author}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  // Async/await approach
  async function getBooksByAuthorAsync(author) {
    try {
      const response = await axios.get(`/books?author=${author}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Use the getBooksByAuthor or getBooksByAuthorAsync function in your routes
  regd_users.get('/books', (req, res) => {
    const author = req.query.author;
  
    if (author) {
      getBooksByAuthor(author)
        .then(books => {
          res.status(200).json(books);
        })
        .catch(error => {
          res.status(500).json({ message: 'Error fetching books by author', error: error.message });
        });
    } else {
      res.status(200).json(books);
    }
  });
  
  regd_users.get('/books-async', async (req, res) => {
    const author = req.query.author;
  
    if (author) {
      try {
        const books = await getBooksByAuthorAsync(author);
        res.status(200).json(books);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching books by author', error: error.message });
      }
    } else {
      res.status(200).json(books);
    }
  });

// Async/await approach
async function getBookByISBNAsync(isbn) {
    try {
      const response = await axios.get(`/books/${isbn}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Use the getBookByISBN or getBookByISBNAsync function in your routes
  regd_users.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    getBookByISBN(isbn)
      .then(book => {
        res.status(200).json(book);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details', error: error.message });
      });
  });
  
  regd_users.get('/books-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const book = await getBookByISBNAsync(isbn);
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details', error: error.message });
    }
  });

// Async/await approach
async function getBookListAsync() {
    try {
      const response = await axios.get('/books');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Use the getBookList or getBookListAsync function in your routes
  regd_users.get('/books', (req, res) => {
    getBookList()
      .then(bookList => {
        res.status(200).json(bookList);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book list', error: error.message });
      });
  });
  
  regd_users.get('/books-async', async (req, res) => {
    try {
      const bookList = await getBookListAsync();
      res.status(200).json(bookList);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book list', error: error.message });
    }
  });

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming you have set the username in the request object during authentication
  
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Filter the reviews for the given ISBN to find the ones belonging to the current user
    const updatedReviews = reviews[isbn].filter(review => review.username !== username);
  
    // Update the reviews for the given ISBN
    reviews[isbn] = updatedReviews;
  
    return res.status(200).json({ message: "Review deleted" });
  });

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Create a new user object
    const newUser = {
      username,
      password,
      reviews: []
    };
  
    // Add the new user to the users object
    users[username] = newUser;
    // Send a success response
    return res.status(201).json({ message: "User registered successfully" });
});

public_users.post("/customer/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
  
    // Check if the user exists and the password is correct
    if (!users[username] || users[username].password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // Generate a JWT token
    const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" });
  
    // Send the token in the response
    return res.status(200).json({ token });
  });

  public_users.post("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.query;
    const username = req.user.username; // Assuming you have set the username in the request object during authentication
  
    // Check if the review is provided
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already posted a review for this book
    const existingReview = reviews[isbn].find(r => r.username === username);
  
    if (existingReview) {
      // Update the existing review
      existingReview.review = review;
      return res.status(200).json({ message: "Review updated" });
    } else {
      // Add a new review
      reviews[isbn].push({ username, review });
      return res.status(201).json({ message: "Review added" });
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  // Convert the books object to an array
  const booksList = Object.values(books);

  // Send the book list as the response
  return res.status(200).json(booksList);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  
  // Check if the book with the given ISBN exists in the books object
  if (books[isbn]) {
    // If the book exists, send the book details as the response
    return res.status(200).json(books[isbn]);
  } else {
    // If the book doesn't exist, send a 404 Not Found response
    return res.status(404).json({ message: 'Book not found' });
  }

  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksList = [];
  
    // Iterate through the books object and find the books by the given author
    Object.keys(books).forEach(isbn => {
      if (books[isbn].author === author) {
        booksList.push(books[isbn]);
      }
    });
  
    // If there are books by the given author, send the book list as the response
    if (booksList.length > 0) {
      return res.status(200).json(booksList);
    } else {
      // If there are no books by the given author, send a 404 Not Found response
      return res.status(404).json({ message: 'No books found by the given author' });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksList = [];
  
    // Iterate through the books object and find the books with the given title
    Object.keys(books).forEach(isbn => {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        booksList.push(books[isbn]);
      }
    });
  
    // If there are books with the given title, send the book list as the response
    if (booksList.length > 0) {
      return res.status(200).json(booksList);
    } else {
      // If there are no books with the given title, send a 404 Not Found response
      return res.status(404).json({ message: 'No books found with the given title' });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Check if the book with the given ISBN exists in the books object
    if (books[isbn]) {
      // If the book exists, get the reviews for the book
      const bookReviews = reviews[isbn] || [];
  
      // Send the book reviews as the response
      return res.status(200).json(bookReviews);
    } else {
      // If the book doesn't exist, send a 404 Not Found response
      return res.status(404).json({ message: 'Book not found' });
    }});

module.exports.general = public_users;
