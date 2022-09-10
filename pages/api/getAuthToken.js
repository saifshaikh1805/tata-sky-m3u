// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    var myHeaders = new Headers();
    myHeaders.append("authority", "kong-tatasky.videoready.tv");
    myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"");
    myHeaders.append("locale", "ENG");
    myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("device_details", "{\"pl\":\"web\",\"os\":\"Linux\",\"lo\":\"en-us\",\"app\":\"1.35.32\",\"dn\":\"PC\",\"bv\":93,\"bn\":\"CHROME\",\"device_id\":\"1aacfdbadea40d5b350887a4fdd7ed771630761468278\",\"device_type\":\"WEB\",\"device_platform\":\"PC\",\"device_category\":\"open\",\"manufacturer\":\"Linux_CHROME_93\",\"model\":\"PC\",\"sname\":\"\"}");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("platform", "web");
    myHeaders.append("sec-ch-ua-platform", "\"Linux\"");
    myHeaders.append("accept", "*/*");
    myHeaders.append("origin", "https://watch.tatasky.com");
    myHeaders.append("sec-fetch-site", "cross-site");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://watch.tatasky.com/");
    myHeaders.append("accept-language", "en-GB,en;q=0.9");

    var raw = {
        sid: req.query.sid,
        authorization: req.query.loginType === 'OTP' ? req.query.otp : req.query.pwd,
        loginOption: req.query.loginType
    };
    if (req.query.loginType === 'OTP')
        raw.rmn = req.query.rmn;

    raw = JSON.stringify(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    return new Promise((resolve, reject) => {
        fetch("https://kong-tatasky.videoready.tv/rest-api/pub/api/v2/login/ott", requestOptions)
            .then(response => response.text())
            .then(result => {
                // debugger;
                const data = JSON.parse(result);
                // console.log(data);
                res.status(200).json(data)
            })
            .catch(error => {
                console.log('error: ', error);
                res.status(500).json(error)
            });
    })
    // res.status(200).json({ name: 'John Doe' })
}
