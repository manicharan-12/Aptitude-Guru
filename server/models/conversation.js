const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      text: { type: String, required: true },
      isBot: { type: Boolean, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
