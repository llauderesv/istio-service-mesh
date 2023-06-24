// @ts-nocheck
const express = require('express');
const morgan = require('morgan');
const fetch = require('node-fetch');
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
app.get('/api/v1/products', async (req, res) => {
  const itemsPromises = data.map(async item => {
    const details = await fetch(
      `http://catalog-detail-service.products.svc.cluster.local:4001/api/v1/details?name=${item.name}`
    ).then(res => res.json());

    item['details'] = details;
    return item;
  });

  const items = await Promise.all(itemsPromises);
  res.json(items).status(200);
});

app.get('/api/v1/products', (req, res) => {
  res.json(data).status(200);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
