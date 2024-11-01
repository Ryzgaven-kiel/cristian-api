const express = require('express');
const axios = require('axios');

class BlackboxAI {
  constructor(model = 'blackboxai') {
    this.apiUrl = 'https://www.blackbox.ai/api/chat';
    this.headers = {
      'Content-Type': 'application/json',
      // Add any necessary headers here, like Authorization if needed
    };
    this.conversationHistory = {}; // Use an object to manage conversation histories by ID
    this.defaultModel = 'blackboxai'; // Default model selection
  }

  async sendMessage(conversationId, content) {
    // Create conversation history if it does not exist
    if (!this.conversationHistory[conversationId]) {
      this.conversationHistory[conversationId] = [];
    }
    
    const message = { id: conversationId, content, role: 'user' };
    this.conversationHistory[conversationId].push(message);

    const payload = {
      messages: this.conversationHistory[conversationId],
      id: conversationId,
      userSelectedModel: this.model // Dynamic model selection
    };

    try {
      const response = await axios.post(this.apiUrl, payload, { headers: this.headers });
      const assistantMessage = { id: `response-${Date.now()}`, content: response.data, role: 'assistant' };
      this.conversationHistory[conversationId].push(assistantMessage);
      return assistantMessage.content;
    } catch (error) {
      console.error('Error communicating with Blackbox.ai:', error.message);
      throw new Error('Failed to communicate with Blackbox.ai');
    }
  }

  async continueConversation(conversationId, content) {
    // Check if conversation history exists
    if (!this.conversationHistory[conversationId]) {
      throw new Error('Conversation not found');
    }
    
    const userMessage = { id: conversationId, content, role: 'user' };
    this.conversationHistory[conversationId].push(userMessage);

    const payload = {
      messages: this.conversationHistory[conversationId],
      id: conversationId,
      userSelectedModel: this.model // Dynamic model selection
    };

    try {
      const response = await axios.post(this.apiUrl, payload, { headers: this.headers });
      const assistantMessage = { id: `response-${Date.now()}`, content: response.data, role: 'assistant' };
      this.conversationHistory[conversationId].push(assistantMessage);
      return assistantMessage.content;
    } catch (error) {
      console.error('Error in continuing conversation with Blackbox.ai:', error.message);
      throw new Error('Failed to continue conversation with Blackbox.ai');
    }
  }
}

// Create Express app
const app = express();
const port = process.env.PORT || 3000; // Use environment port for hosting

// Initialize BlackboxAI
const blackboxAI = new BlackboxAI();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the API endpoint
app.get('/api/blackbox', async (req, res) => {
  const { text, conversationId, model } = req.query;

  if (!text || !conversationId) {
    return res.status(400).json({ error: 'Text and conversationId are required' });
  }

  // Use provided model or default
  const selectedModel = model || blackboxAI.defaultModel;
  blackboxAI.model = selectedModel;

  try {
    // Send or continue conversation based on the existence of previous messages
    let response;
    if (!blackboxAI.conversationHistory[conversationId]) {
      response = await blackboxAI.sendMessage(conversationId, text);
    } else {
      response = await blackboxAI.continueConversation(conversationId, text);
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API Endpoint: /api/blackbox?text=<your_text>&conversationId=<your_id>&model=<optional_model>`);
});
  
