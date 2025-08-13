# IoT Home Dashboard - Real-Time Resource Monitoring

A modern, real-time IoT dashboard for monitoring home appliance energy and water usage with WebSocket updates and API integrations.

## 🚀 Features

- **Real-time Monitoring**: Live updates of energy consumption and water usage
- **WebSocket Communication**: Instant data synchronization across all connected clients
- **Smart Appliance Control**: Toggle appliances on/off with real-time status updates
- **API Integrations**: 
  - Nest Thermostat integration for environment monitoring
  - Sense Energy API for detailed power consumption data
- **Responsive Design**: Modern, mobile-friendly interface
- **Secure Connections**: SSL-ready with helmet security middleware
- **Real-time Notifications**: User-friendly alerts and status updates

## 🏗️ Architecture

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO for WebSocket connections
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Security**: Helmet.js for security headers, CORS support
- **API Integration**: Axios for HTTP requests to external services

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser with WebSocket support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iot-home-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your API keys:
   ```env
   NEST_API_KEY=your_nest_api_key_here
   SENSE_API_KEY=your_sense_api_key_here
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### API Keys Setup

#### Nest API
1. Visit [Nest Developers](https://developers.nest.com/)
2. Create a new application
3. Get your API key
4. Add it to your `.env` file

#### Sense Energy API
1. Visit [Sense Developers](https://developers.sense.com/)
2. Register for API access
3. Get your API key
4. Add it to your `.env` file

### SSL Configuration (Production)
For production deployment with HTTPS:

```env
SSL_KEY_PATH=/path/to/private.key
SSL_CERT_PATH=/path/to/certificate.crt
```

## 📱 Usage

### Dashboard Overview
- **Energy Section**: Monitor power consumption of individual appliances
- **Water Section**: Track water flow, temperature, and total usage
- **Environment Section**: Monitor temperature, humidity, and air quality
- **API Status**: Check connection status of integrated services

### Appliance Control
- Click the power button on any appliance card to toggle it on/off
- Real-time power consumption updates
- Visual status indicators

### Real-time Updates
- All data updates automatically every 2 seconds
- WebSocket ensures instant synchronization
- Connection status indicator shows server connectivity

## 🏗️ Project Structure

```
iot-home-dashboard/
├── server.js              # Main Node.js server
├── package.json           # Dependencies and scripts
├── env.example            # Environment variables template
├── README.md              # This file
└── public/                # Frontend assets
    ├── index.html         # Main dashboard HTML
    ├── styles.css         # CSS styling
    └── script.js          # Frontend JavaScript
```

## 🔌 API Endpoints

### GET Endpoints
- `/api/status` - Overall system status
- `/api/appliances` - All appliance data
- `/api/energy/current` - Current energy consumption
- `/api/water/current` - Current water usage
- `/api/nest/thermostat` - Nest thermostat data
- `/api/sense/energy` - Sense energy data

### WebSocket Events
- `initialData` - Initial dashboard data
- `dataUpdate` - Real-time data updates
- `applianceUpdate` - Appliance status changes
- `toggleAppliance` - Appliance control commands

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security Features

- **Helmet.js**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side data validation
- **Rate Limiting**: Built-in request throttling
- **SSL Ready**: HTTPS support for production

## 📊 Monitoring & Analytics

The dashboard provides:
- Real-time power consumption metrics
- Water usage tracking
- Environmental monitoring
- Historical data trends (mock data)
- API integration status

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if server is running
   - Verify port configuration
   - Check firewall settings

2. **API Integration Errors**
   - Verify API keys in `.env` file
   - Check API service status
   - Review network connectivity

3. **WebSocket Issues**
   - Ensure browser supports WebSockets
   - Check server logs for errors
   - Verify CORS configuration

### Debug Mode
Enable debug logging:
```bash
DEBUG=socket.io* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Font Awesome for icons
- Express.js community
- IoT and home automation enthusiasts

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for smart home monitoring**
