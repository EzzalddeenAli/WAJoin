const express = require('express')
var cors = require('cors')
const qr = require('qr-image');
const { Client } = require('pg')

const workers = require('./workers.js')
const { setupAuthentication } = require('./authentication.js')

const client = new Client()

main()

async function main() {
  await sleep(2000)

  await client.connect()

  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
  app.use('/static', express.static('static'))
  app.set('views', './views')
  app.set('view engine', 'pug')

  setupAuthentication(app, client)

  app.get('/', function (req, res) {
    console.log(req.user)
    res.render('index', {
      user: req.user,
      loggedIn: Boolean(req.user),
      chatName: req.user ? req.user.name : 'Weston'
    })
  })

  app.get('/api/qrcode', workers.getQRCode)

  app.post('/api/session', workers.createSession(client))

  app.get('/api/join_job', workers.getJoinJobs(client))

  app.listen(3000, () =>
    console.log('Listening on port 3000'),
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
