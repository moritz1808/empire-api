module.exports = (sockets) => {
    const express = require('express');
    const app = express();
  
    app.use(express.json());
    app.use(express.static(__dirname + '/public'));
  
    // === 🔍 STATUS API ===
    app.get('/api/status', (req, res) => {
      const result = {};
      for (const [serverHeader, socket] of Object.entries(sockets)) {
        result[serverHeader] = socket.socket ? "connected" : "disconnected";
      }
      res.json(result);
    });
  
    // === 🛰️ SEND MESSAGE TO SERVER ===
    app.post('/api/send', (req, res) => {
      const { server, message } = req.body;
      if (!sockets[server] || !sockets[server].socket) {
        return res.status(400).json({ error: "Socket nicht verbunden" });
      }
  
      try {
        sockets[server].send(message);
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  
    return app;
  };