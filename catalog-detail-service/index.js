const express = require('express');
const morgan = require('morgan');
const data = require('./data.json');

const app = express();

const { PORT = 4001 } = process.env;

// body parser
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req, res) => {
  res.send('Catalog Detail Service API');
});

app.get('/healthz', (req, res) => res.json({ healthy: 'ok' }).status(200));
app.get('/api/v1/details', async (req, res) => {
  const { name } = req.query;
  if (!name || (name && String(name).length <= 0)) {
    return res.json(null).status(404);
  }

  const item = data.find(item => item.name === name);
  if (item) {
    return res.json(item).status(200);
  } else {
    return res.json({ message: 'Item not found' }).status(404);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
