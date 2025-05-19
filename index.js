
const venom = require('venom-bot');
require('dotenv').config();

venom.create({
  session: 'bot-session',
  headless: true,
  disableWelcome: true
}).then(client => start(client));

function start(client) {
  console.log("🤖 Bot conectado.");
  client.onMessage(async message => {
    if (!message.isGroupMsg && message.body) {
      const res = await fetch(`${process.env.GPT_CHAT_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: message.body })
      });
      const data = await res.json();
      await client.sendText(message.from, data.respuesta || "🤖 Sin respuesta");
    }
  });
}
