main()

async function main() {
  const uniqueCode = localStorage.getItem('uniqueCode')
  if (uniqueCode) {
    responseData = await fetch(`/state?uniqueCode=${uniqueCode}`)
      .then(response => response.json())

    if (!responseData) {
      localStorage.removeItem('uniqueCode')
      location.replace('/')
      return
    }
    else {
      location.replace('/qrcode')
      return
    }
  }
}

function submitGroupLink() {
  const groupLink = getGroupLink()
  const inviteCode = getInviteCode(groupLink)
  if (!inviteCode) {
    M.toast({html: 'Not a valid WhatsApp link.'})
    return
  }

  const currentUniqueCode = localStorage.getItem('uniqueCode')
  let uniqueCode
  if (currentUniqueCode) {
    uniqueCode = currentUniqueCode
  }
  else {
    uniqueCode = generateUniqueCode()
    saveUniqueCode(uniqueCode)
  }

  postJoinLink(inviteCode, uniqueCode)
}

function getGroupLink() {
  return document.getElementById('link').value
}

function getInviteCode(groupLink) {
  const regular = /^https:\/\/chat.whatsapp.com\/([a-zA-Z0-9]+)$/
  const web = /^https:\/\/web.whatsapp.com\/accept\?code=([a-zA-Z0-9]+)$/
  let inviteCode
  if (regular.test(groupLink)) {
    inviteCode = regular.exec(groupLink)[1]
  }
  else if (web.test(groupLink)) {
    inviteCode = web.exec(groupLink)[1]
  }
  else {
    inviteCode = null
  }

  return inviteCode
}

function generateUniqueCode() {
    let length = 20
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let retVal = ""
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function saveUniqueCode(uniqueCode) {
  localStorage.setItem('uniqueCode', uniqueCode)
}

function postJoinLink(inviteCode, uniqueCode) {
  post('/', {
    inviteCode: inviteCode,
    uniqueCode: uniqueCode
  })
}

function post(path, params, method='post') {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}
