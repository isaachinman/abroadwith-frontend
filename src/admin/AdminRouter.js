var express = require('express');
var nunjucks = require('nunjucks');
var braintree = require("braintree");

var router = express.Router();

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "yvwms9fyxtbh2tj5",
  publicKey: "gbjh79rgxxycz924",
  privateKey: "67cac4edce0889eb24f7eec6ee3e7df1"
});

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No admin context.');
  
  gateway.clientToken.generate({}, function (err, response) {
    if(err) {
      res.status(500).send('There was an error with braintree.');
      return;
    }
    req.context.tokens = {
      braintree: response.clientToken
    }
    res.send(nunjucks.render('admin/admin.html',req.context));
  });
});

module.exports = router;
