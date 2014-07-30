var express = require('express');
var http = require('http');
var router = express.Router();
var config = require('../config.js');

router.get('/', function(req, res) {
	console.log('serve / '+ req.query.code);
	if(req.query.code) {
		resolveTokens(req.query.code, function(tokens) {
			console.log('tokens: '+ tokens);
			makeDemoAPICall(tokens.access_token, function(accountInfo) {
				res.render('oauth_success', { token : tokens.access_token, accountInfo: accountInfo});
			});
		});

	} else {
			res.send(400,'Bad Request');	
	}

});

function resolveTokens(code, callback) {
	var reqOptions = {
		hostname : config.host,
		port: config.port,
		path: config.proxyRootPath + '/auth/token',
		method: 'POST',
		auth: config.authId +':abc123',
		headers: {
			"Accept" : "application/json",
			"Content-Type" : "application/x-www-form-urlencoded"
		}
	};

	var clientReq = http.request(reqOptions, function(clientRes) {
		clientRes.setEncoding('utf8');
		clientRes.on('data', function(data) {
			console.log('Got: ' + data);

			var tokens = JSON.parse(data);
			console.log(tokens.access_token);
			callback(tokens);				
		});
	});
	clientReq.on('error', function(e) {
			console.log(e);
	  console.log('problem with resolveTokens: ' + e.message);
	});
	clientReq.write('grant_type=authorization_code&code=' + code);
	clientReq.end();
}

function makeDemoAPICall(accessToken, callback) {
	var reqOptions = {
		hostname : config.host,
		port: config.port,
		path: config.proxyRootPath + '/rest/external/account/info',
		headers: {
			"Accept" : "application/json",
			"Authorization" : "Bearer " + accessToken
		}
	};

	http.get(reqOptions, function(res) {
		res.on('data', function(data) {
			console.log('makeDemoAPICall response: '+ data);
			var accountInfo = JSON.parse(data);
			console.log("API response: " + accountInfo.CompanyName);
			callback(accountInfo);
		});
	}).on('error', function(e) {
			console.log(e);
			console.log('problem with makeDemoAPICall: ' + e.message);
	});;
}

module.exports = router;