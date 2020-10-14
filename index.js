const express = require('express')
const qr = require('qr-image');

const Worker = require('./worker').Worker

const workers = {}

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static('static'))
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', {})
})

app.post('/', async function (req, res) {
  if (!req.body.uniqueCode) {
    console.error('uniqueCode wasn\'nt provided')
    return
  }
  if (!req.body.inviteCode) {
    console.error('inviteCode wasn\'nt provided')
    return
  }

  console.log(req.body.uniqueCode)

  if (!(req.body.uniqueCode in workers)) {
    console.log('Creating a new worker.')
    workers[req.body.uniqueCode] = new Worker(req.body.inviteCode)
  }

  res.render('qrcode', {redirectTo: '/qrcode'})
})

app.get('/qrcode', function (req, res) {
  res.render('qrcode')
})

app.get('/state', function (req, res) {
  const uniqueCode = req.query.uniqueCode
  const worker = workers[req.query.uniqueCode]
  if (!worker) {
    res.json(null)
  }
  else if (!worker.qrCode) {
    res.json({
      type: 'waitingForQRCode'
    })
  }
  else if (!worker.connected) {
    const data = worker.qrCode
    const image = qr.imageSync(data, { type: 'png' })
    const encodedImage = Buffer.from(image).toString('base64')
    res.json({
      type: 'qRCode',
      qrCode: encodedImage
    })
  }
  else if (!worker.success) {
    res.json({
      type: 'connected'
    })
  }
  else {
    worker.stop()
    res.json({
      type: 'success'
    })
  }
})

app.listen(3000, () =>
  console.log('Listening on port 3000'),
);
