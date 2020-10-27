const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const got = require('got');

const vgmUrl = 'https://web.whatsapp.com/';
const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0"

const headers = {
    'user-agent': userAgent
}

try {

  got(vgmUrl, { headers: headers }).then(response => {
    const dom = new JSDOM(response.body, {
        resources: "usable",
        runScripts: "dangerously",
        userAgent: userAgent,
        url: vgmUrl,
        referrer: vgmUrl,
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000
    });

    console.log(dom.window.document.body.innerHTML)

    setTimeout(() => console.log(dom.window.document.body.innerHTML), 10000);

  }).catch(err => {
    console.log(err);
  });

}
catch (e) {
  console.log(e)
}
