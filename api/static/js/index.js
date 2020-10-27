function submitGroupLink() {
  const groupLink = getGroupLink()
  const inviteCode = getInviteCode(groupLink)
  if (!inviteCode) {
    M.toast({html: 'Not a valid WhatsApp link.'})
    return
  }

  localStorage.setValue('joinInviteCode', inviteCode)
  window.location.href = '/app'
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
