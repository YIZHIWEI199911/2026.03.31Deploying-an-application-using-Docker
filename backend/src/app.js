const express = require('express');

const app = express();
require('./user/user.js')(app);

app.get('/', (req, res) => res.send('GET method'));
app.post('/', (req, res) => res.send('POST method'));
app.delete('/', (req, res) => res.send('DELETE method'));
app.put('/', (req, res) => res.send('PUT method'));

app.get('/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ]
  });
});

module.exports = app;
