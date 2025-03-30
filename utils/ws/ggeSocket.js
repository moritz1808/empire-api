const { BaseSocket } = require('../../core/baseSocket');

module.exports = (account) => {
  const url = `wss://${account.server}`;
  const socket = new BaseSocket(
    url,
    "EmpireEx_2",

    // onSend
    (data) => {
      console.log(`[📤] Sende: ${data.slice(0, 80)}...`);
    },

    // onOpen
    () => {
      console.log(`[🟢] Verbunden mit ${account.server}`);
      console.log(`[🔐] Logging in as ${account.username}...`);

      // Vor-Login senden
      socket.sendJsonCommand("vln", { NOM: account.username });
    },

    // onMessage
    (message) => {
      const clean = message.replace(/\s+/g, '').trim();
      console.log(`[📩] ${account.server} → ${message}`);

      // Warte auf Vor-Login-Bestätigung
      if (clean.includes('%xt%vln%1%0%')) {
        console.log(`[✅] Vor-Login bestätigt für ${account.username}`);

        const loginPayload = {
          CONM: 217,
          RTM: 34,
          ID: 0,
          PL: 0,
          NOM: account.username,
          PW: account.password,
          LT: null,
          LANG: "de",
          DID: "0",
          AID: `${Date.now()}`,
          KID: "",
          REF: "https://goodgamestudios.com",
          GCI: "",
          SID: 9,
          PLFID: 1
        };
        socket.sendJsonCommand("lli", loginPayload);
      }

      // Login-Erfolg
      if (clean.includes('%xt%EmpireEx_2%core_gic%1%')) {
        console.log(`[✅] Login erfolgreich für ${account.username}`);
      }

      // Login-Fehler
      if (clean.includes("login_error") || clean.includes("r='-1'")) {
        console.log(`[❌] Login fehlgeschlagen für ${account.username}`);
      }
    },

    // onError
    (err) => {
      console.error(`[⛔] Fehler bei ${account.server}:`, err.message);
    },

    // onClose
    () => {
      console.log(`[🔴] Verbindung zu ${account.server} getrennt`);
    }
  );

  return socket;
};

