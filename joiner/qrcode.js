const { Client } = require('whatsapp-web.js');
const qr = require('qr-image');

async function create_qrcode(req, res) {
  res.setHeader('Cache-Control', 'no-cacfhe');
  res.setHeader('Content-Type', 'text/event-stream');
  res.flushHeaders();

  const client = new Client();

  client.on('qr', qrCode => {
    console.log('Got QR code.')
    const image = qr.imageSync(qrCode, { type: 'png' })
    const encodedImage = Buffer.from(image).toString('base64')
    res.write(`data: ${encodedImage}\n\n`)
  })

  client.on('authenticated', async function (session) {
    console.log('Authenticated.');
    try {
      console.log('Sending the session to the api to store for later use.');
      await axios.post('http://api:3000/api/session', session, {
        headers: req.headers
      })
    }
    catch (e) {
      console.log('Got an error while updating the session in the api.', e)
    }
  });

  client.on('auth_failure', msg => {
    console.error('Failed to authenticate.', msg);
  });

  client.on('disconnected', reason => {
    console.log('Client was logged out.', reason);
  });

  client.initialize();

  req.on('close', () => {
    console.log('Client closed the connection unexpectedly.');
    client.destroy()
    res.end();
  });

  req.on('end', () => {
    console.log('Client ended the connection normally.');
    client.destroy()
    res.end();
  });

  setTimeout(() => {
    console.log('Timeout was passed.')
    client.destroy()
    res.end()
  }, 20000)
}

module.exports = {
  create_qrcode
}
