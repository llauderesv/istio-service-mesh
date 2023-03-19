const express = require('express');
const morgan = require('morgan');
const data = require('./data.json');

const app = express();

const { PORT = 4000 } = process.env;

// body parser
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req, res) => {
  res.send('Catalog Service API');
});

app.get('/healthz', (req, res) => res.json({ healthy: 'ok' }).status(200));
app.get('/api/v1/products', (req, res) => {
  res.json(data).status(200);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
