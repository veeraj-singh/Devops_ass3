// Import required modules
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample data
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user' }
];

const products = [
    { id: 1, name: 'Laptop', price: 999.99, inStock: true },
    { id: 2, name: 'Smartphone', price: 499.99, inStock: true },
    { id: 3, name: 'Headphones', price: 99.99, inStock: false }
];

// Routes
// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
        endpoints: [
            '/api/status',
            '/api/users',
            '/api/users/:id',
            '/api/products',
            '/api/products/:id'
        ]
    });
});

// System status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        timestamp: new Date(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Search products
app.get('/api/products/search', (req, res) => {
    const { minPrice, maxPrice, inStock } = req.query;
    let filteredProducts = [...products];

    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (inStock) {
        filteredProducts = filteredProducts.filter(p => p.inStock === (inStock === 'true'));
    }

    res.json(filteredProducts);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});