const Helper = require('./Helper');

class Cognitive {

    /**
     * 入力テキストのキーワード示す文字列のリストを返す。
     * @param {string} text 解析する文字列
     * @param {string} callBack  API 呼び出しが完了した際に戻り値を受け取るコールバック関数
     */
    static keyPhrases(text, callBack) {
        const ENDPOINT_URL = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases',
            SUBSCRIPTION_KEY = process.env.COG_SCRIPTION;
        let headers = {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
        };

        //送信するデータ
        let data = {
            "documents": [{
                "language": "ja",
                "id": "1",
                "text": text
            }]
        };

        //API 呼び出し
        Helper.xhr(ENDPOINT_URL, (result) => {
            if (result) {
                callBack(result);
            }
        }, 'POST', headers, data);
    }

}

module.exports = Cognitive;