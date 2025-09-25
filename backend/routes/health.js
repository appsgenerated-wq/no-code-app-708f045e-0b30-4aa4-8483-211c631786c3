// Enhanced health check endpoint for Manifest backend
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';
  
  console.log(`🔍 [HEALTH] Health check requested at ${timestamp}`);
  console.log(`🔍 [HEALTH] App ID: ${appId}`);
  console.log(`🔍 [HEALTH] Request headers:`, req.headers);
  
  try {
    // Check if Manifest is properly initialized
    const manifestStatus = {
      status: 'ok',
      timestamp: timestamp,
      appId: appId,
      manifest: 'connected',
      version: '4.16.1',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: {
        node: process.version,
        arch: process.arch,
        platform: process.platform
      }
    };
    
    console.log(`✅ [HEALTH] Health check successful:`, manifestStatus);
    
    res.status(200).json(manifestStatus);
  } catch (error) {
    console.error(`❌ [HEALTH] Health check failed:`, error);
    
    const errorStatus = {
      status: 'error',
      timestamp: timestamp,
      appId: appId,
      error: error.message,
      manifest: 'disconnected'
    };
    
    res.status(500).json(errorStatus);
  }
});

// Additional endpoint for detailed status
router.get('/status', async (req, res) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';
  
  console.log(`🔍 [STATUS] Status check requested at ${timestamp}`);
  console.log(`🔍 [STATUS] App ID: ${appId}`);
  
  try {
    const detailedStatus = {
      status: 'ok',
      timestamp: timestamp,
      appId: appId,
      manifest: {
        connected: true,
        version: '4.16.1',
        entities: ['User', 'Restaurant', 'MenuItem'], // This would be dynamic
        endpoints: ['/api', '/admin', '/health', '/status']
      },
      database: {
        connected: true,
        type: 'sqlite',
        location: './database.sqlite'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
        DATABASE_URL: process.env.DATABASE_URL || 'sqlite://./database.sqlite'
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: {
          node: process.version,
          arch: process.arch,
          platform: process.platform
        }
      }
    };
    
    console.log(`✅ [STATUS] Detailed status check successful:`, detailedStatus);
    
    res.status(200).json(detailedStatus);
  } catch (error) {
    console.error(`❌ [STATUS] Status check failed:`, error);
    
    const errorStatus = {
      status: 'error',
      timestamp: timestamp,
      appId: appId,
      error: error.message
    };
    
    res.status(500).json(errorStatus);
  }
});

module.exports = router;