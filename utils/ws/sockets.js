// empire/utils/ws/sockets.js

const fs = require("fs");
const path = require("path");
const GgeSocket = require("./ggeSocket");

const accounts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../accounts.json"), "utf-8")
).accounts;

async function getSockets() {
    const sockets = {};
  
    for (const account of accounts) {
      const socket = GgeSocket(account); // ← Verbindung passiert sofort
      sockets[account.server] = socket;
  
      socket.username = account.username; // optional für GUI
    }
  
    return sockets;
  }  

module.exports = {
  getSockets
};

