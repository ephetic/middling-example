var http = require('http')
var router = require('http-hash-router')()

var middling = require('middling')

function rando(req, res) {
  if (Math.random() < 0.5) 
    req.user = 'admin'
}

function auth(req, res, next) {
  if (!req.user) 
    return next('No user')
  next()
}

function logger (req, res) {
  if (req.user === 'admin') {
    console.log('ADMIN', req.method, req.url)
  }
}

router.set('/admin', 
  abdc(middling(rando, auth, logger, function (req, res) {
    res.end('OK');
  }))
)

function abdc (fn) {
  return function (a, b, c, d) {
    fn.call(null, a, b, d, c)
  }
}

var server = http.createServer(function handler(req, res) {
    router(req, res, {}, onError);

    function onError(err) {
      if (err) {
        console.log('onError', err)
        // use your own custom error serialization.
        res.statusCode = err.statusCode || 500;
        res.end(err.message);
      }
    }
});
server.listen(3000);

