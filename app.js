const restify = require('restify');
const builder = require('botbuilder');
const Cognitive = require('./cognitive.js');
const request = require('request');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector, [
    session => {
        const keys = [];
        //cognitive.js 内 cognitive クラス内の keyPhrases メソッドを呼び出し 
        Cognitive.keyPhrases(session.message.text, (result) => {
            for (let doc of result.documents) {
                for (let key of doc.keyPhrases) {
                    keys.push(key);
                }
            }

            session.send('keywords: ' + keys.join(','));

            const searchURL = process.env.SEARCH_URL;

            const params = {
                "api-version": '2016-09-01',
                search: keys.join(',')
            };

            const options = {
                url: searchURL,
                headers: {
                    'Accept': 'application/json',
                    'api-key': process.env.SEARCH_API_KEY
                },
                qs: params
            };

            request.get(options, function(err, response, body) {
                if (err) { console.log(err); return; }
                const res = JSON.parse(response.body);
                session.send(res.value[0].Answer);
            });
        })
    },
]);