const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3001;
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      imgSrc: ["'self'", 'data:'],
    },
  })
);

// Define the quote schema
const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  quoteFor: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Create a Quote model from the schema
const Quote = mongoose.model('Quote', quoteSchema);
const mongoDBURL = process.env.DATABASE;
// Connect to the MongoDB database
async function connectToDatabase() {
  try {
   
    await mongoose.connect(mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
connectToDatabase();

// Define the POST route for the quote request
app.post('/api/quote', async (req, res) => {
  try {
    // Retrieve data from the request body
    const { name, email, contactNumber, quoteFor, message } = req.body;

    // Create a new quote object
    const quote = new Quote({
      name,
      email,
      contactNumber,
      quoteFor,
      message,
    });

    // Save the quote to the database
    await quote.save();

    // Send a response back to the client
    res.status(200).json({ message: 'Quote request saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving the quote request.' });
  }
});
if(process.env.NODE_ENV==="production"){
app.use(express.static("client/build"))
}


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
