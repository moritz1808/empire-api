const express = require("express");
const path = require("path");
const { getSockets } = require('./utils/ws/sockets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // GUI-Ordner

// 📡 Load & Connect WebSocket Accounts
getSockets().then(async (sockets) => {
  // 🧠 Optional: kannst du hier weiterreichen
  app.locals.sockets = sockets;

  // ✅ Status API
  app.get("/api/status", (req, res) => {
    const result = {};
    for (const [server, socket] of Object.entries(sockets)) {
      result[server] = socket.connected ? "connected" : "disconnected";
    }
    res.json(result);
  });

  // 📡 Kommando von extern (z. B. später Python) senden
  app.post("/api/send", (req, res) => {
    const { server, message } = req.body;

    const socket = app.locals.sockets?.[server];
    if (!socket || !socket.connected) {
      return res.status(400).send("❌ Nicht verbunden mit " + server);
    }

    try {
      socket.send(message);
      res.send("✅ Gesendet");
    } catch (err) {
      console.error("❌ Fehler beim Senden:", err);
      res.status(500).send("Fehler beim Senden");
    }
  });

  // 🧠 Start API Server
  app.listen(PORT, () => {
    console.log(`🧠 GUI läuft auf http://localhost:${PORT}`);
  });
});
