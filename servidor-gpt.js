const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🟢 Servidor GPT está activo');
});

app.post('/preguntar', async (req, res) => {
  const pregunta = req.body.pregunta;
  if (!pregunta) return res.status(400).json({ error: 'Falta el campo pregunta' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(process.env.GPT_CHAT_URL);

    await page.waitForSelector('textarea');
    await page.type('textarea', pregunta);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(5000);

    const respuesta = await page.evaluate(() => {
      const elements = document.querySelectorAll('.markdown.prose');
      return elements.length ? elements[elements.length - 1].innerText : 'Sin respuesta';
    });

    await browser.close();
    res.json({ respuesta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar con Puppeteer' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});