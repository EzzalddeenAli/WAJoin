const http = require('http');

async function getQRCode(req, res) {
  try {
    const now = new Date()

    await qrcodeSSE(req, res)
  }
  catch (e) {
    res.status(500).send('Something broke!')
    console.error(e)
  }
}

async function qrcodeSSE(req, res) {
  const options = {
    host: 'joiner',
    port: 3000,
    path: '/api/qrcode',
    method: 'GET',
    headers: req.headers,
  };

  const creq = http
    .request(options, joiner_res => {
      joiner_res.setEncoding('utf8');

      res.writeHead(joiner_res.statusCode);

      joiner_res.on('data', chunk => {
        res.write(chunk);
      });

      joiner_res.on('close', () => {
        res.end();
      });

      joiner_res.on('end', () => {
        res.end();
      });
    })
    .on('error', e => {
      console.log(e.message);
      try {
        res.writeHead(500);
        res.write(e.message);
      } catch (e) {
        // ignore
      }
      res.end();
    });

  creq.end();

  req.on('close', () => {
    console.log('Client closed the connection unexpectedly.');
    creq.end();
  });

  req.on('end', () => {
    console.log('Client ended the connection normally.');
    creq.end();
  });
}

DELETE_SESSION_SQL = `
DELETE FROM public."Session"
	WHERE user_id=$1
`

function createSession(client) {
  return async function (req, res) {
    try {
      session = req.body
    }
    catch (e) {

    }
  }
}

SELECT_JOIN_JOBS_SQL = `
  SELECT id, created, last_run, invite_code, state
  	FROM public."JoinJob"
    WHERE user_id=$1;
`

function getJoinJobs(client) {
  return async function (req, res) {
    try {
      jobs_result = await client.query(SELECT_JOIN_JOBS_SQL, [1])
      res.header('Access-Control-Expose-Headers', 'Content-Range');
      const length = jobs_result.rows.length
      res.header('Content-Range',`jobs : 0-${length}/${length}`);
      res.json(jobs_result.rows)
    }
    catch (e) {
      res.status(500).send('Something broke!')
      console.error(e)
    }
  }
}

module.exports = {
  getQRCode,
  createSession,
  getJoinJobs
}
