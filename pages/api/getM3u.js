// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    let uData = {
        uAgent: req.headers['user-agent'],
        sid: req.query.sid.split('_')[0],
        id: req.query.id,
        sName: req.query.sname,
        token: req.query.tkn,
        ent: req.query.ent.split('_'),
        tsActive: req.query.sid.split('_')[1] === "D" ? false : true
    };
    if (uData.tsActive) {
        let m3uString = await generateM3u(uData);
        res.status(200).send(m3uString);
    }
    else
        res.status(409).json({ error: "Tata Sky Deactivated" });
}


import fetch, { Headers } from "cross-fetch";
// const baseUrl = "https://kong-tatasky.videoready.tv";
const baseUrl = "https://tm.tapi.videoready.tv";

const getAllChans = async () => {
    var requestOptions = {
        method: 'GET'
    };

    let err = null;
    let res = null;

    await fetch("https://ts-api.videoready.tv/content-detail/pub/api/v1/channels?limit=599", requestOptions)
        .then(response => response.text())
        .then(result => res = JSON.parse(result))
        .then(r => r)
        .catch(error => console.log('error', error));

    let obj = { err };
    if (err === null)
        obj.list = res.data.list;
    return obj;
}

const getJWT = async (params, uDetails) => {
    // console.log('userdetss: ', uDetails);
    let myHeaders = new Headers();
    const headersObj = {
        'authority': 'tm.tapi.videoready.tv',
        'accept': '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'authorization': 'bearer ' + uDetails.token,
        'content-type': 'application/json',
        'device_details': '{"pl":"web","os":"WINDOWS","lo":"en-us","app":"1.36.35","dn":"PC","bv":103,"bn":"CHROME","device_id":"YVJNVFZWVlZ7S01UZmRZTWNNQ3lHe0RvS0VYS0NHSwA","device_type":"WEB","device_platform":"PC","device_category":"open","manufacturer":"WINDOWS_CHROME_103","model":"PC","sname":' + uDetails.sName + '}',
        'kp': 'false',
        'locale': 'ENG',
        'origin': 'https://watch.tataplay.com',
        'platform': 'web',
        'profileid': uDetails.id,
        'referer': 'https://watch.tataplay.com/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36',
        'x-device-id': 'YVJNVFZWVlZ7S01UZmRZTWNNQ3lHe0RvS0VYS0NHSwA',
        'x-device-platform': 'PC',
        'x-device-type': 'WEB',
        'x-subscriber-id': uDetails.sid,
        'x-subscriber-name': uDetails.sName
    };

    Object.entries(headersObj).map(x => {
        myHeaders.append(x[0], x[1]);
    })
    var raw = JSON.stringify(params);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let err = null;
    let result = null;

    try {
        // Promise.all(params.epids.map(x => { return { action: "stream", epids: [ {  } ] } }))
        const response = await fetch(baseUrl + "/auth-service/v1/oauth/token-service/token", requestOptions);
        result = await response.json();
    }
    catch (error) {
        console.log('error: ', error);
        err = error;
    }

    let obj = { err };
    if (err === null)
        obj.token = result.data.token;
    return obj;
}

const getUserChanDetails = async (userChannels) => {

    var myHeaders = new Headers();
    myHeaders.append("authority", "tm.tapi.videoready.tv");
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-GB,en;q=0.9");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("device_details", "{\"pl\":\"web\",\"os\":\"Linux\",\"lo\":\"en-us\",\"app\":\"1.36.35\",\"dn\":\"PC\",\"bv\":101,\"bn\":\"CHROME\",\"device_id\":\"b70f9d50a3ea9cc7b77d4f1e04c41706\",\"device_type\":\"WEB\",\"device_platform\":\"PC\",\"device_category\":\"open\",\"manufacturer\":\"Linux_CHROME_101\",\"model\":\"PC\",\"sname\":\"\"}");
    myHeaders.append("locale", "ENG");
    myHeaders.append("origin", "https://watch.tataplay.com");
    myHeaders.append("platform", "web");
    myHeaders.append("referer", "https://watch.tataplay.com/");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "cross-site");
    myHeaders.append("sec-gpc", "1");
    myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    let err = null;
    let result = [];

    let chanIds = userChannels.map(x => x.id);
    let chanIdsStr = '';

    while (chanIds.length > 0) {
        chanIdsStr = chanIds.splice(0, 99).join(',');
        await fetch("https://tm.tapi.videoready.tv/content-detail/pub/api/v1/live-tv-genre/channels?genre=&language=&channelIds=" + chanIdsStr, requestOptions)
            .then(response => response.json())
            .then(cData => result.push(...cData.data.liveChannels))
            .catch(error => {
                console.log('error: ', error);
                err = error;
            });
    }

    if (result.length > 0)
        err = null;

    let obj = { err };
    if (err === null)
        obj.list = result;
    return obj;
}

const generateM3u = async (ud) => {
    let errs = [];
    // let userEnt = theUser.entitlements.map(x => x.pkgId);
    let ent = ud.ent;
    let userChans = [];
    let allChans = await getAllChans();
    if (allChans.err === null) {
        userChans = allChans.list.filter(x => x.entitlements.some(y => ent.includes(y)));
        //console.log(userChans);
    }
    else
        errs.push(allChans.err);
    if (errs.length === 0) {
        let userChanDetails = await getUserChanDetails(userChans);
        let m3uStr = '';
        if (userChanDetails.err === null) {
            let chansList = userChanDetails.list;
            //console.log(chansList);
            let jwtTokens = [];
            if (chansList.length > 0) {
                //m3uStr = '#EXTM3U    x-tvg-url="http://botallen.live/epg.xml.gz"\n\n';4
                m3uStr = '#EXTM3U    x-tvg-url="https://www.tsepg.cf/epg.xml.gz"\n\n';
                for (let i = 0; i < chansList.length; i++) {
                    const chanEnts = chansList[i].detail.entitlements.filter(val => ent.includes(val));
                    if (chanEnts.length > 0) {
                        let chanJwt = jwtTokens.find(x => x.ents.sort().toString() === chanEnts.sort().toString())?.token;
                        if (!chanJwt) {
                            let paramsForJwt = { action: "stream" };
                            paramsForJwt.epids = chanEnts.map(x => { return { epid: "Subscription", bid: x } });
                            console.log(paramsForJwt);
                            chanJwt = await getJWT(paramsForJwt, ud);
                            chanJwt = chanJwt.token;
                            jwtTokens.push({
                                ents: chanEnts,
                                token: chanJwt
                            });
                        }
                        m3uStr += '#EXTINF:-1  tvg-id=\"' + chansList[i].channelMeta.id.toString() + '\"  ';
                        m3uStr += 'tvg-logo=\"' + chansList[i].channelMeta.logo + '\"   ';
                        m3uStr += 'group-title=\"' + (chansList[i].channelMeta.genre[0] !== "HD" ? chansList[i].channelMeta.genre[0] : chansList[i].channelMeta.genre[1]) + '\",   ' + chansList[i].channelMeta.channelName + '\n';
                        m3uStr += '#KODIPROP:inputstream.adaptive.license_type=com.widevine.alpha' + '\n';
                        m3uStr += '#KODIPROP:inputstream.adaptive.license_key=' + chansList[i].detail.dashWidewineLicenseUrl + '&ls_session=';
                        m3uStr += chanJwt + '\n';
                        m3uStr += chansList[i].detail.dashWidewinePlayUrl + '\n\n';
                    }
                }
                console.log('all done!');
            }
            else
                m3uStr = "Could not get channels. Try again later.";
        }
        else
            m3uStr = userChanDetails.err.toString();
        return m3uStr;
    }
}