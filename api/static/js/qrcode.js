main()

function main() {
  let uniqueCode = localStorage.getItem('uniqueCode')
  if (!uniqueCode) {
    location.replace('/')
    return
  }

  monitorState(uniqueCode)
}

async function monitorState(uniqueCode) {
  let lastStateType = null
  while (true) {
    let state = await getState(uniqueCode)
    if (!state) {
      localStorage.removeItem('uniqueCode')
      location.replace('/')
      return
    }

    if (lastStateType !== state.constructor.name) {
      state.initialize()
    }

    state.handle()
    await sleep(state.sleepTime)

    lastStateType = state.constructor.name
  }
}

async function getState(uniqueCode) {
  responseData = await fetch(`/state?uniqueCode=${uniqueCode}`)
    .then(response => response.json())

  if (responseData === null) {
    return null
  }

  console.log('Current state type is ' + responseData.type);
  if (responseData.type === 'waitingForQRCode') {
    return new WaitingForQRCodeState()
  }
  else if (responseData.type === 'qRCode') {
    return new QRCodeState(responseData.qrCode)
  }
  else if (responseData.type === 'connected') {
    return new ConnectedState()
  }
  else if (responseData.type === 'success') {
    return new SuccessState()
  }
  else {
    throw new Error(`Received an unknown state type ${responseData.type}`)
  }
}

class WaitingForQRCodeState {
  get sleepTime() {
    return 500
  }

  initialize() {}

  handle() {}
}

class QRCodeState {
  get sleepTime() {
    return 500
  }

  constructor(qrCode) {
    this.qrCode = qrCode
  }

  initialize() {
    console.log('Got QR Code ' + this.qrCode.toString())
    hideAllQRContainer()
    showQRCode(this.qrCode)
    unhideElement('qr-code-container')
  }

  handle() {
    showQRCode(this.qrCode)
  }
}

class ConnectedState {
  get sleepTime() {
    return 5000
  }

  initialize() {
    hideAllQRContainer()
    unhideElement('running-container')
  }

  handle() {}
}

class SuccessState {
  get sleepTime() {
    return 100000
  }

  initialize() {
    hideAllQRContainer()
    unhideElement('success-container')
  }

  handle() {}
}

function showQRCode(qrCode) {
  document.getElementById('qr-code').src = 'data:image/png;base64,' + qrCode;
}

function hideAllQRContainer() {
  let children = document.getElementById('qr-container').children
  for (let child of children) {
    child.hidden = true
  }
}

function unhideElement(id) {
  document.getElementById(id).hidden = false
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function closesuccess() {
  localStorage.removeItem('uniqueCode')
  location.replace('/')
}
