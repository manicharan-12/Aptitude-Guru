const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require("mongoose");

const User = require("./models/user");
const Ticket = require("./models/ticket");
const Conversation = require("./models/conversation");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://gademanicharan12:AptitudeGuru@cluster0.aiker0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const initializeDbAndServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    app.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post('/register', async (req, res) => {
  const { name, password } = req.body;

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ name: user.name }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.status(200).json({ token, id:user.id });
  } catch (error) {
    console.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/ticket', async (req, res) => {
  const { userId, message } = req.body;

  try {
    const newTicket = new Ticket({ userId, message });
    await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully'});
  } catch (error) {
    console.error(`Error creating ticket: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/conversation', async (req, res) => {
  const { userId, messages } = req.body;

  try {
    let conversation = await Conversation.findOne({ userId });
    if (conversation) {
      conversation.messages = messages;
    } else {
      conversation = new Conversation({ userId, messages });
    }
    await conversation.save();
    res.status(201).json({ message: 'Conversation stored successfully' });
  } catch (error) {
    console.error(`Error storing conversation: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/conversation/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(`Error fetching conversation: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});