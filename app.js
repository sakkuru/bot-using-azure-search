var restify = require('restify');
var builder = require('botbuilder');
var Cognitive = require('./cognitive.js');
var request = require('request');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function(session) {
        var keys = [];
        //cognitive.js 内 cognitive クラス内の keyPhrases メソッドを呼び出し 
        Cognitive.keyPhrases(session.message.text, (result) => {
            for (let doc of result.documents) {
                for (let key of doc.keyPhrases) {
                    keys.push(key);
                }
            }

            session.send('keywords: ' + keys.join(','));

            var searchURL = process.env.SEARCH_URL;

            var params = {
                "api-version": '2016-09-01',
                search: keys.join(',')
            };

            var options = {
                url: searchURL,
                headers: {
                    'Accept': 'application/json',
                    'api-key': process.env.SEARCH_API_KEY
                },
                qs: params
            };

            request.get(options, function(err, response, body) {
                if (err) { console.log(err); return; }
                var res = JSON.parse(response.body);
                session.send(res.value[0].Answer);
            });
        })
    },
]);