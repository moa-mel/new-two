const asyncHandler = require('express-async-handler');
const requestIp = require('request-ip');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getGeo = asyncHandler(async (req, res) => {
    const visitorName = req.query.visitor_name;
    let clientIp = requestIp.getClientIp(req);
  
    // Input validation
    if (!visitorName) {
      return res.status(400).send({ error: 'visitor_name query parameter is required' });
    }
  
    // Handle local testing IP
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
      // Replace with a reliable IP from a service like ipinfo.io
      clientIp = await getPublicIP();
    }
  
    if (!clientIp) {
      return res.status(400).send({ error: 'Client IP address not found' });
    }
  
    try {
      // Fetch location data using ip-api.com
      const ipApiUrl = `http://ip-api.com/json/${clientIp}`;
      const ipApiResponse = await axios.get(ipApiUrl);
  
      if (ipApiResponse.data && ipApiResponse.data.status === 'success') {
        const { city, country } = ipApiResponse.data;
  
        // Example: Assuming you have temperature data available
        const temp_c = 25; // Example temperature
  
        const response = {
          client_ip: clientIp,
          greeting: `Hello, ${visitorName}! Your current temperature is ${temp_c}°C.`,
          location: `${city}, ${country}`
        };
        res.json(response);
      } else {
        console.error('Error fetching location data:', ipApiResponse.data ? ipApiResponse.data.message : 'Unknown error');
        res.status(500).json({ error: 'Failed to fetch location data' });
      }
    } catch (error) {
      console.error('Error retrieving data:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  async function getPublicIP() {
    try {
      const response = await axios.get('https://ipinfo.io/ip');
      return response.data.trim();
    } catch (error) {
      console.error('Error fetching public IP:', error.message);
      return '105.112.178.91'; // Fallback to a default IP for testing
    }
  }



module.exports = getGeo;
