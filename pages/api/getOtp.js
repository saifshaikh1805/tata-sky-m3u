// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    let requestOptions = {
        method: 'GET',
    };

    return new Promise((resolve, reject) => {
        fetch("https://kong-tatasky.videoready.tv/rest-api/pub/api/v1/rmn/" + req.query.rmn + "/otp", requestOptions)
            .then(response => response.text())
            .then(result => {
                const data = JSON.parse(result);
                console.log(data);
                res.status(200).json(data);
            })
            .catch(error => {
                console.log('error: ', error);
                res.status(500).json(error);
            });
    })
    // res.status(200).json({ name: 'John Doe' })
}
