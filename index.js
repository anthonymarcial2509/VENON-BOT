const venom = require('venom-bot');
const dotenv = require('dotenv');
dotenv.config();

venom
  .create({
    session: 'bot-session',
    headless: true,
    useChrome: false, // Usa Chromium de Puppeteer
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    logQR: false, // true si quieres ver el QR por consola
    disableWelcome: true
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
        await client.sendText(message.from, 'Hola! Soy un bot en la nube con Puppeteer.');
      } catch (err) {
        console.error('❌ Error enviando mensaje:', err);
      }
    }
  });
}
