const express = require('express')
const qr = require('qr-image');

const { create_qrcode } = require('./qrcode')

main()

async function main() {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  app.get('/api/qrcode', create_qrcode)

  app.listen(3000, () =>
    console.log('Listening on port 3000'),
  );
}
