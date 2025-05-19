const venom = require('venom-bot');
const dotenv = require('dotenv');
dotenv.config();

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
    puppeteerOptions: {
      headless: 'new' // 👈 Evita la advertencia futura de deprecación
    },
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
      await client.sendText(message.from, 'Hola! Soy un bot en la nube con Puppeteer actualizado.');
    }
  });
}
