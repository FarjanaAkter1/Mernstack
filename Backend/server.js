const express = require('express');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// MongoDB setup
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  // Set up routes
  app.get('/api/food', async (req, res) => {
    try {
      const db = client.db('foodhub');
      const foodItems = await db.collection('food').find().toArray();
      res.json(foodItems);
    } catch (err) {
      console.error('Error retrieving food items:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/food', async (req, res) => {
    try {
      const db = client.db('foodhub');
      const newFoodItem = req.body;
      const result = await db.collection('food').insertOne(newFoodItem);
      res.json(result.ops[0]);
    } catch (err) {
      console.error('Error adding food item:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
