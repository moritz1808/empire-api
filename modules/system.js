module.exports = class System {
    constructor(socket, account) {
        this.socket = socket;
        this.account = account;
    }

    sendXml(type, action, id, data) {
        const xml = `<msg t='sys'><body action='${action}' r='${id}'><${data}></${data}></body></msg>`;
        const payload = `@${type}@${action}@${id}@${xml}`;
        this.socket.send(payload);
    }

    sendJson(ext, cmd, id, obj) {
        const payload = `%xt%${ext}%${cmd}%${id}%${JSON.stringify(obj)}%`;
        this.socket.send(payload);
    }

    async login() {
        console.log(`🔐 Logging in as ${this.account.username}...`);

        // Schritt 1: Versionscheck
        this.sendXml("sys", "verChk", "0", `ver v='166'`);
        await this.sleep(500);

        // Schritt 2: Login XML
        const encodedPw = `${this.account.password}%de%0`;
        const loginXML = `login z='${this.account.server}'><nick><![CDATA[${this.account.username}]]></nick><pword><![CDATA[${encodedPw}]]></pword>`;
        this.sendXml("sys", "login", "0", loginXML);
        await this.sleep(500);

        // Schritt 3: JSON Vor-Login
        this.sendJson("EmpireEx_2", "vln", "1", { NOM: this.account.username });
        await this.sleep(500);

        // Schritt 4: JSON Login
        const loginData = {
            CONM: 217,
            RTM: 34,
            ID: 0,
            PL: 0,
            NOM: this.account.username,
            PW: this.account.password,
            LT: null,
            LANG: "de",
            DID: "0",
            AID: Date.now().toString(),
            KID: "",
            REF: "https://goodgamestudios.com",
            GCI: "",
            SID: 9,
            PLFID: 1
        };
        this.sendJson("EmpireEx_2", "lli", "1", loginData);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
