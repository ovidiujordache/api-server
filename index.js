const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); 

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;


let products = [
  { id: uuidv4(), name: "iPhone" },
  { id: uuidv4(), name: "AirPods" },
  { id: uuidv4(), name: "MacBook" }
];

app.get('/', (req, res) => {
  res.send('Welcome to the in-memory product API!');
});

// Fetch all products
app.get('/api/products', (req, res) => {
  res.json({ products });
});

// Fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((prod) => prod.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});


app.post('/api/products', (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((prod) => prod.id === id);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  
  products[productIndex] = { id, ...req.body }; // replace product data
  res.json({ product: products[productIndex] });
});

app.patch('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((prod) => prod.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  Object.assign(product, req.body); 
  res.json({ product });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((prod) => prod.id === id);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  
  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
