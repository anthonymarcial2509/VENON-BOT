const venom = require('venom-bot');
const fetch = require('node-fetch');
require('dotenv').config();

venom
  .create({
    session: 'bot-session',
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
        const respuesta = await enviarPreguntaAGPT(message.body);
        await client.sendText(message.from, respuesta);
      } catch (err) {
        console.error('❌ Error al contactar con el servidor GPT:', err);
        await client.sendText(message.from, 'Error al contactar con la IA.');
      }
    }
  });
}

async function enviarPreguntaAGPT(pregunta) {
  const res = await fetch('https://gpt-server-only.onrender.com/preguntar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pregunta })
  });
  const data = await res.json();
  return data.respuesta || 'Sin respuesta del GPT';
}
