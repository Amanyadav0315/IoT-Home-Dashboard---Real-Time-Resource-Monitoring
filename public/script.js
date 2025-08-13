// IoT Dashboard JavaScript - Real-time monitoring and control

// Initialize Socket.IO connection
const socket = io();

// DOM elements
const connectionStatus = document.getElementById('connectionStatus');
const totalPower = document.getElementById('totalPower');

// Appliance elements
const appliances = {
    refrigerator: {
        power: document.getElementById('refrigerator-power'),
        status: document.getElementById('refrigerator-status'),
        card: document.querySelector('[data-appliance="refrigerator"]')
    },
    washing_machine: {
        power: document.getElementById('washing_machine-power'),
        status: document.getElementById('washing_machine-status'),
        card: document.querySelector('[data-appliance="washing_machine"]')
    },
    dishwasher: {
        power: document.getElementById('dishwasher-power'),
        status: document.getElementById('dishwasher-power'),
        status: document.getElementById('dishwasher-status'),
        card: document.querySelector('[data-appliance="dishwasher"]')
    },
    oven: {
        power: document.getElementById('oven-power'),
        status: document.getElementById('oven-status'),
        card: document.querySelector('[data-appliance="oven"]')
    },
    tv: {
        power: document.getElementById('tv-power'),
        status: document.getElementById('tv-status'),
        card: document.querySelector('[data-appliance="tv"]')
    }
};

// Water and environment elements
const waterFlow = document.getElementById('waterFlow');
const waterTemp = document.getElementById('waterTemp');
const waterTotal = document.getElementById('waterTotal');
const envTemp = document.getElementById('envTemp');
const envHumidity = document.getElementById('envHumidity');
const airQuality = document.getElementById('airQuality');

// API integration elements
const nestTarget = document.getElementById('nest-target');
const senseDaily = document.getElementById('sense-daily');

// Connection status management
let isConnected = false;

// Socket.IO event handlers
socket.on('connect', () => {
    console.log('Connected to server');
    isConnected = true;
    updateConnectionStatus(true);
    
    // Request initial data
    socket.emit('requestInitialData');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    isConnected = false;
    updateConnectionStatus(false);
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    isConnected = false;
    updateConnectionStatus(false);
});

// Data update handlers
socket.on('initialData', (data) => {
    console.log('Received initial data:', data);
    updateDashboard(data);
});

socket.on('dataUpdate', (data) => {
    updateDashboard(data);
});

socket.on('applianceUpdate', (update) => {
    const { appliance, data } = update;
    if (appliances[appliance]) {
        updateApplianceDisplay(appliance, data);
    }
});

// Update connection status display
function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.className = 'status-online';
        connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Online';
    } else {
        connectionStatus.className = 'status-offline';
        connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Offline';
    }
}

// Update entire dashboard with new data
function updateDashboard(data) {
    // Update total power
    totalPower.textContent = data.energy.total;
    
    // Update appliances
    Object.keys(data.energy.appliances).forEach(appliance => {
        updateApplianceDisplay(appliance, data.energy.appliances[appliance]);
    });
    
    // Update water metrics
    waterFlow.textContent = data.water.flow;
    waterTemp.textContent = data.water.temperature;
    waterTotal.textContent = data.water.total;
    
    // Update environment metrics
    envTemp.textContent = data.environment.temperature.toFixed(1);
    envHumidity.textContent = data.environment.humidity.toFixed(0);
    airQuality.textContent = data.environment.air_quality;
    
    // Update API data
    nestTarget.textContent = '22'; // Mock data
    senseDaily.textContent = (data.energy.total * 24 / 1000).toFixed(2);
}

// Update individual appliance display
function updateApplianceDisplay(applianceName, applianceData) {
    const appliance = appliances[applianceName];
    if (!appliance) return;
    
    // Update power display with animation
    const powerElement = appliance.power;
    const newPower = applianceData.power;
    
    // Add updating animation
    powerElement.classList.add('updating');
    
    // Update value
    powerElement.textContent = newPower;
    
    // Remove animation class after transition
    setTimeout(() => {
        powerElement.classList.remove('updating');
    }, 300);
    
    // Update status
    const statusElement = appliance.status;
    statusElement.textContent = applianceData.status === 'on' ? 'On' : 'Off';
    statusElement.className = `status-indicator ${applianceData.status}`;
    
    // Update card appearance
    if (applianceData.status === 'on') {
        appliance.card.style.borderColor = '#48bb78';
    } else {
        appliance.card.style.borderColor = 'transparent';
    }
}

// Toggle appliance on/off
function toggleAppliance(applianceName) {
    if (!isConnected) {
        showNotification('Not connected to server', 'error');
        return;
    }
    
    const appliance = appliances[applianceName];
    if (!appliance) return;
    
    const currentStatus = appliance.status.textContent.toLowerCase();
    const newStatus = currentStatus === 'on' ? 'off' : 'on';
    
    // Send toggle command to server
    socket.emit('toggleAppliance', {
        appliance: applianceName,
        status: newStatus
    });
    
    // Show notification
    const action = newStatus === 'on' ? 'turned on' : 'turned off';
    showNotification(`${applianceName.replace('_', ' ')} ${action}`, 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #48bb78;
        color: #22543d;
    }
    
    .notification-error {
        border-left: 4px solid #e53e3e;
        color: #742a2a;
    }
    
    .notification-info {
        border-left: 4px solid #667eea;
        color: #4a5568;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: #48bb78;
    }
    
    .notification-error i {
        color: #e53e3e;
    }
    
    .notification-info i {
        color: #667eea;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Periodic API data refresh (every 30 seconds)
setInterval(() => {
    if (isConnected) {
        // Refresh Nest thermostat data
        fetch('/api/nest/thermostat')
            .then(response => response.json())
            .then(data => {
                nestTarget.textContent = data.target;
            })
            .catch(error => console.error('Failed to fetch Nest data:', error));
        
        // Refresh Sense energy data
        fetch('/api/sense/energy')
            .then(response => response.json())
            .then(data => {
                senseDaily.textContent = (data.daily_usage / 1000).toFixed(2);
            })
            .catch(error => console.error('Failed to fetch Sense data:', error));
    }
}, 30000);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, reduce update frequency
        console.log('Page hidden, reducing update frequency');
    } else {
        // Page is visible, restore normal update frequency
        console.log('Page visible, restoring update frequency');
        if (isConnected) {
            socket.emit('requestInitialData');
        }
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Adjust layout if needed
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('IoT Dashboard initialized');
    
    // Add click event listeners for appliance cards
    Object.keys(appliances).forEach(applianceName => {
        const card = appliances[applianceName].card;
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on toggle button
            if (!e.target.closest('.toggle-btn')) {
                // Could add detailed view functionality here
                console.log(`Clicked on ${applianceName} card`);
            }
        });
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('IoT Dashboard loaded successfully!', 'success');
    }, 1000);
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification('An error occurred', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('Connection error occurred', 'error');
});
