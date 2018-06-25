const express = require('express');
const compression = require('compression');
const serve = express();
const app = express();
const gzipStatic = require('connect-gzip-static');
const fs = require('fs');
const cors = require('cors');
const config = require('./config');
const path = require('path');

const dir = './dist';
const port = config.build.portServer;
const appName = config.build.assetsPublicPath;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

serve.use(appName, app);

app.use(compression());
app.use(gzipStatic(path.join(__dirname, 'dist')));

// Begin Fake auth
serve.use(cors());
serve.post('/auth', (req, res) => {
  let data = JSON.parse(fs.readFileSync('data-auth.sample.json', 'utf8'));
  res.send(data);
});
// End Fake auth

serve.listen(port, function () {
  console.log('Frontend app listening on port: ' + port);
});
