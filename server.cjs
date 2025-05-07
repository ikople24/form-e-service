const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config(); // ✅ โหลด env ก่อน

const app = express();
const PORT = 3002;

// ✅ connect mongoDB แค่ครั้งเดียว
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/requestsDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Schema
const RequestSchema = new mongoose.Schema({
  type: String,
  fullname: String,
  address: String,
  phone: String,
  signature: String,
  createdAt: { type: Date, default: Date.now }
});

const RequestModel = mongoose.model('Request', RequestSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/request', async (req, res) => {
  console.log('Received body:', req.body);

  const { type, fullname, address, phone, signature } = req.body;

  try {
    const newRequest = new RequestModel({ type, fullname, address, phone, signature });
    await newRequest.save();
    res.status(201).json({ success: true, message: 'Request saved successfully' });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await RequestModel.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
