const { Client } = require('whatsapp-web.js');

class Worker {
  constructor(inviteCode) {
    console.log('Creating client.')
    this.client = new Client()

    this.inviteCode = inviteCode
    this.qrCode = null
    this.connected = false
    this.success = false
    this.stopped = false

    this.client.on('qr', (qrCode) => {
      console.log('qr code!')
      this.qrCode = qrCode
    })

    this.client.on('ready', () => {
      console.log('Client is ready. Starting to try to join the group.')
      this.connected = true
      this.run()
    })

    this.client.initialize()
  }

  async run() {
    while (!this.stopped) {
      try {
        console.log('Trying to join group with invite code ' + this.inviteCode)
        let acceptPromise = this.client.acceptInvite(this.inviteCode)
          .then(result => {
            console.log('The result of the join is ' + result)
          })
        await Promise.race([acceptPromise, sleep(2000)])

        this.success = true
      }
      catch(err) {
        console.log('Failed in one of the tries to join a group', err)
      }

      await sleep(Math.random() * (120000 - 60000) + 60000)
    }
  }

  stop() {
    this.stopped = true
    this.client.destroy()
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports.Worker = Worker
