const venom = require('venom-bot');
const fetch = require('node-fetch');
require('dotenv').config();

venom
  .create({
    session: 'venom-railway',
    headless: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    disableWelcome: true
  })
  .then((client) => start(client))
  .catch((error) => {
    console.error('❌ Error al iniciar Venom:', error);
    process.exit(1);
  });

function start(client) {
  console.log('🤖 Bot conectado en Railway');

  client.onMessage(async (message) => {
    if (!message.isGroupMsg && message.body) {
      try {
        const respuesta = await enviarPreguntaAGPT(message.body);
        await client.sendText(message.from, respuesta);
      } catch (err) {
        console.error('❌ Error con GPT:', err);
        await client.sendText(message.from, '❌ Error al contactar con la IA.');
      }
    }
  });
}

async function enviarPreguntaAGPT(pregunta) {
  const res = await fetch(process.env.GPT_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pregunta })
  });
  const data = await res.json();
  return data.respuesta || 'Sin respuesta';
}