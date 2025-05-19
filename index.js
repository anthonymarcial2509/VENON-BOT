const venom = require('venom-bot');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
dotenv.config();

venom
  .create({
    session: 'cloud-bot',
    headless: true,
    useChrome: false,
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    logQR: true
  })
  .then((client) => start(client))
  .catch((error) => {
    console.error('❌ Error al iniciar Venom:', error);
    process.exit(1);
  });

function start(client) {
  console.log('🤖 Bot conectado y listo');

  client.onMessage(async (message) => {
    if (!message.isGroupMsg && message.body) {
      try {
        const res = await fetch(`${process.env.GPT_CHAT_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pregunta: message.body })
        });
        const data = await res.json();
        await client.sendText(message.from, data.respuesta || 'Sin respuesta');
      } catch (err) {
        console.error('❌ Error al contactar con el servidor GPT:', err);
        await client.sendText(message.from, 'Error al contactar con el servidor.');
      }
    }
  });
}
