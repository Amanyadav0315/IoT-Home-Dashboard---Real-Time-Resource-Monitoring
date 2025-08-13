const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Environment variables for API keys
const NEST_API_KEY = process.env.NEST_API_KEY || 'demo_key';
const SENSE_API_KEY = process.env.SENSE_API_KEY || 'demo_key';

// Mock data for demonstration (replace with real API calls)
let mockData = {
  energy: {
    total: 0,
    appliances: {
      refrigerator: { power: 0, status: 'off' },
      washing_machine: { power: 0, status: 'off' },
      dishwasher: { power: 0, status: 'off' },
      oven: { power: 0, status: 'off' },
      tv: { power: 0, status: 'off' }
    }
  },
  water: {
    total: 0,
    flow: 0,
    temperature: 20
  },
  environment: {
    temperature: 22,
    humidity: 45,
    air_quality: 'good'
  }
};

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send initial data
  socket.emit('initialData', mockData);
  
  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  // Handle appliance control
  socket.on('toggleAppliance', (data) => {
    const { appliance, status } = data;
    if (mockData.energy.appliances[appliance]) {
      mockData.energy.appliances[appliance].status = status;
      mockData.energy.appliances[appliance].power = status === 'on' ? 
        Math.floor(Math.random() * 2000) + 500 : 0;
      
      // Broadcast update to all clients
      io.emit('applianceUpdate', {
        appliance,
        data: mockData.energy.appliances[appliance]
      });
    }
  });
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json(mockData);
});

app.get('/api/appliances', (req, res) => {
  res.json(mockData.energy.appliances);
});

app.get('/api/energy/current', (req, res) => {
  res.json({
    total: mockData.energy.total,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/water/current', (req, res) => {
  res.json({
    total: mockData.energy.total,
    flow: mockData.water.flow,
    temperature: mockData.water.temperature,
    timestamp: new Date().toISOString()
  });
});

// Nest API integration (mock implementation)
app.get('/api/nest/thermostat', async (req, res) => {
  try {
    // In real implementation, this would call Nest API
    const nestData = {
      temperature: mockData.environment.temperature,
      humidity: mockData.environment.humidity,
      mode: 'heat',
      target: 22
    };
    res.json(nestData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Nest data' });
  }
});

// Sense API integration (mock implementation)
app.get('/api/sense/energy', async (req, res) => {
  try {
    // In real implementation, this would call Sense API
    const senseData = {
      current_power: mockData.energy.total,
      daily_usage: mockData.energy.total * 24,
      monthly_usage: mockData.energy.total * 24 * 30
    };
    res.json(senseData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Sense data' });
  }
});

// Simulate real-time data updates
setInterval(() => {
  // Update energy consumption
  Object.keys(mockData.energy.appliances).forEach(appliance => {
    if (mockData.energy.appliances[appliance].status === 'on') {
      mockData.energy.appliances[appliance].power += Math.floor(Math.random() * 50) - 25;
      mockData.energy.appliances[appliance].power = Math.max(0, mockData.energy.appliances[appliance].power);
    }
  });
  
  // Calculate total energy
  mockData.energy.total = Object.values(mockData.energy.appliances)
    .reduce((sum, app) => sum + app.power, 0);
  
  // Update water flow
  if (Math.random() > 0.7) {
    mockData.water.flow = Math.floor(Math.random() * 10);
    mockData.water.total += mockData.water.flow;
  } else {
    mockData.water.flow = 0;
  }
  
  // Update environment data
  mockData.environment.temperature += (Math.random() - 0.5) * 0.5;
  mockData.environment.humidity += (Math.random() - 0.5) * 2;
  mockData.environment.temperature = Math.max(18, Math.min(28, mockData.environment.temperature));
  mockData.environment.humidity = Math.max(30, Math.min(70, mockData.environment.humidity));
  
  // Broadcast updates to all connected clients
  io.emit('dataUpdate', mockData);
}, 2000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`IoT Dashboard server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
