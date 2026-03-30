const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/users', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users from backend' });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
});