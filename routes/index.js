var express = require('express');
var router = express.Router();
var config = require('../config.js');
var util = require('util');
/* GET home page. */
router.get('/', function(req, res) {
	var url = util.format('http://%s:%s%s/auth/login?response_type=code&client_id=%s&redirect_uri=http://%s:%s/service&scope=openid',
  	  config.host, config.port, config.proxyRootPath, config.authId, config.thirdPartyHost, config.thirdPartyPort);
  	console.log('redirect to '+ url);
  res.redirect(url);
});

module.exports = router;