// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    console.log('inside handler');
    const body = JSON.parse(req.body);
    const { longUrl } = body;

    var myHeaders = new Headers();
        myHeaders.append("authority", "www.shorturl.at");
        myHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
        myHeaders.append("accept-language", "en-GB,en;q=0.9");
        myHeaders.append("cache-control", "max-age=0");
        myHeaders.append("content-type", "application/x-www-form-urlencoded");
        myHeaders.append("cookie", "cf_clearance=BaxFE5LNDz88jlV1a4p4pbf7TbARk3WJ5yRT_Ixmzcg-1696149306-0-1-e9d87316.ef33a229.f0f23cff-0.2.1696149306; _ga=GA1.1.1384799428.1696149306; PHPSESSID=87d7ac940f5fbb6c8281a6aa9422f73b; _ga_BNKRJHP2R5=GS1.1.1696149306.1.1.1696149345.0.0.0");
        myHeaders.append("origin", "https://www.shorturl.at");
        myHeaders.append("referer", "https://www.shorturl.at/");
        myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Linux\"");
        myHeaders.append("sec-fetch-dest", "document");
        myHeaders.append("sec-fetch-mode", "navigate");
        myHeaders.append("sec-fetch-site", "same-origin");
        myHeaders.append("sec-fetch-user", "?1");
        myHeaders.append("upgrade-insecure-requests", "1");
        myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36");

        var urlencoded = new URLSearchParams();
        urlencoded.append("u", longUrl);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };

        try {
            const fetchResponse = await fetch("https://www.shorturl.at/shortener.php", requestOptions);
            const data = await fetchResponse.text();
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ error });
        }
  }
  