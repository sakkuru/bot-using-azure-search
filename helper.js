const request = require('request');

class Helper {
    static xhr(argUrl, callBack, method = 'GET',
        headers = { 'Content-Type': 'application/json' }, postData) {

        if (!postData) postData = '';
        let options = {
            'url': argUrl,
            'method': method,
            'headers': headers,
            'body': postData,
            'json': true
        };

        if (method === 'GET') {
            request.get(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    callBack(body);
                } else {
                    console.log('error: ' + response.statusCode); 
                }
            });
        } else if (method === 'POST') {
            request.post(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    callBack(body);
                } else {
                    console.log('error: ' + response.statusCode); 
                }
            });
        }
    }
}

module.exports = Helper;