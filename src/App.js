//import logo from './logo.svg';
import './App.css';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireStorage } from './firebaseConfig';

function App() {
  // debugger;
  const [rmn, setRmn] = useState("");
  const [sid, setSid] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [theUser, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [m3uMeta, setM3uMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firebaseValid, setFirebaseValid] = useState(false);
  const [err, setError] = useState("");

  var corsUrl = process.env.REACT_APP_CORSANYWHERE;
  if (corsUrl === "" || corsUrl === undefined)
    corsUrl = "https://cors.bridged.cc/";

  useEffect(() => {
    if (fireStorage.app.options.projectId !== undefined)
      setFirebaseValid(true);
    else
      setFirebaseValid(false);
    let tok = localStorage.getItem("token");
    let userd = localStorage.getItem("userDetails");
    if (tok !== undefined && userd !== undefined) {
      setToken(tok);
      setUser(JSON.parse(userd));
    }
    let localm3uMeta = localStorage.getItem("m3uMeta");
    if (localm3uMeta !== undefined)
      setM3uMeta(JSON.parse(localm3uMeta));
  }, []);

  useEffect(() => {
    localStorage.setItem("m3uMeta", JSON.stringify(m3uMeta));
  }, [m3uMeta]);

  const getOTP = () => {
    setLoading(true);
    let requestOptions = {
      method: 'GET',
    };

    let res = {};

    fetch(corsUrl + "https://kong-tatasky.videoready.tv/rest-api/pub/api/v1/rmn/" + rmn + "/otp", requestOptions)
      .then(response => response.text())
      .then(result => {
        res = JSON.parse(result);
        setLoading(false);
        console.log(res);
        if (res.message.indexOf("OTP generated successfully") === 0) {
          setOtpSent(true);
          setError("");
        }
        else
          setError(res.message);
      })
      .catch(error => {
        console.log('error', error);
        setError(error.toString());
      });
  }

  const authenticateUser = () => {
    setLoading(true);
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

    var raw = JSON.stringify({
      "rmn": rmn,
      "sid": sid,
      "authorization": otp,
      "loginOption": "OTP"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    let res = {};

    fetch(corsUrl + "https://kong-tatasky.videoready.tv/rest-api/pub/api/v2/login/ott", requestOptions)
      .then(response => response.text())
      .then(result => {
        res = JSON.parse(result);
        console.log(res);
        if (res.code === 0) {
          let userDetails = res.data.userDetails;
          let token = res.data.accessToken;
          setUser(userDetails);
          setToken(token);
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
          localStorage.setItem("token", token);
          setError("");
        }
        else
          setError(res.message);
        setLoading(false);
      })
      .catch(error => {
        console.log('error', error);
        setError(error.toString());
        setLoading(false);
      });
  }

  const getAllChans = async () => {
    var requestOptions = {
      method: 'GET'
    };

    let err = null;
    let res = null;

    await fetch(corsUrl + "https://ts-api.videoready.tv/content-detail/pub/api/v1/channels?limit=534", requestOptions)
      .then(response => response.text())
      .then(result => res = JSON.parse(result))
      .then(r => r)
      .catch(error => console.log('error', error));

    let obj = { err };
    if (err === null)
      obj.list = res.data.list;
    return obj;
  }

  const getJWT = async (params) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "bearer " + token);
    myHeaders.append("x-subscriber-id", theUser.sid);
    myHeaders.append("x-app-id", "ott-app");
    myHeaders.append("x-app-key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImR2ci11aSIsImtleSI6IiJ9.XUQUYRo82fD_6yZ9ZEWcJkc0Os1IKbpzynLzSRtQJ-E");
    myHeaders.append("x-subscriber-name", theUser.sName);
    myHeaders.append("x-api-key", "YVJNVFZWVlZ7S01UZmRZTWNNQ3lHe0RvS0VYS0NHSwA");
    myHeaders.append("x-device-platform", "MOBILE");
    myHeaders.append("x-device-type", "ANDROID");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(params);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    let err = null;
    let res = null;

    await fetch(corsUrl + "https://kong-tatasky.videoready.tv/auth-service/v1/oauth/token-service/token", requestOptions)
      .then(response => response.text())
      .then(result => res = JSON.parse(result))
      .catch(error => err = error);

    let obj = { err };
    if (err === null)
      obj.token = res.data.token;
    return obj;
  }

  const getUserChanDetails = async (userChannels) => {
    var requestOptions = {
      method: 'GET'
    };

    let err = null;
    let res = null;

    await Promise.all(
      userChannels.map(x =>
        fetch(corsUrl + "https://kong-tatasky.videoready.tv/content-detail/pub/api/v1/channels/" + x.id, requestOptions)
          .then(r => r.json())
          .catch(error => err = error)
      )
    ).then(response => Promise.resolve(response))
      .then(result => res = result.filter(c => c.data.meta.length > 0).map(cd => cd.data))
      .catch(error => err = error);

    let obj = { err };
    if (err === null)
      obj.list = res;
    return obj;
  }

  const generateM3u = async (reqType) => {
    // debugger;
    setLoading(true);
    let errs = [];
    let userEnt = theUser.entitlements.map(x => x.pkgId);
    let userChans = [];
    let allChans = await getAllChans();
    if (allChans.err === null) {
      userChans = allChans.list.filter(x => x.entitlements.some(y => userEnt.includes(y)));
      console.log(userChans);
    }
    else
      errs.push(allChans.err);
    if (errs.length === 0) {
      let paramsForJwt = { action: "stream" };
      paramsForJwt.epids = userEnt.map(x => { return { epid: "Subscription", bid: x } });
      let jwt = await getJWT(paramsForJwt);
      if (jwt.err === null) {
        console.log(jwt);
        localStorage.setItem("jwt", jwt.token);
      }
      else
        errs.push(jwt.err);
    }
    if (errs.length === 0) {
      let userChanDetails = await getUserChanDetails(userChans);
      let chansList = userChanDetails.list;
      console.log(chansList);
      let m3uStr = '#EXTM3U    x-tvg-url="http://botallen.live/epg.xml.gz"\n\n';
      for (let i = 0; i < chansList.length; i++) {
        m3uStr += '#EXTINF:-1  tvg-id=' + chansList[i].meta[0].channelId.toString() + '  ';
        m3uStr += 'tvg-logo=' + chansList[i].meta[0].channelLogo + '   ';
        m3uStr += 'group-title=' + chansList[i].meta[0].primaryGenre + ',   ' + chansList[i].meta[0].channelName + '\n';
        m3uStr += '#KODIPROP:inputstream.adaptive.license_type=com.widevine.alpha' + '\n';
        m3uStr += '#KODIPROP:inputstream.adaptive.license_key=' + chansList[i].detail.dashWidewineLicenseUrl + '&ls_session=';
        m3uStr += localStorage.getItem("jwt") + '\n';
        m3uStr += chansList[i].detail.dashWidewinePlayUrl + '\n\n';
      }

      if (reqType === "file") {
        // download m3u file
        let fileA = document.createElement('a');
        let blob = new Blob([m3uStr]);
        fileA.href = URL.createObjectURL(blob);
        fileA.download = theUser.sid + '.m3u';
        fileA.click();
        setLoading(false);
      }
      else {
        //store m3u on firebase storage and get download URL
        let newM3uMeta = null;
        let blobObj = new Blob([m3uStr]);
        const storageRef = ref(fireStorage, theUser.sid + ".m3u");
        uploadBytes(storageRef, blobObj)
          .then(snapshot => {
            // debugger;
            console.log('Uploaded test file!');
            newM3uMeta = { updated: snapshot.metadata.updated };
            return snapshot.ref
          })
          .then(r => getDownloadURL(r).then(d => {
            newM3uMeta.url = d;
            setM3uMeta(newM3uMeta);
            setLoading(false);
          }))
      }
    }
  }

  const testUpload = () => {
    //debugger;
    let blobObj = new Blob(["testing 1"]);
    const storageRef = ref(fireStorage, "test.txt");
    uploadBytes(storageRef, blobObj)
      .then(snapshot => {
        //  debugger;
        console.log('Uploaded test file!');
        setM3uMeta({ updated: snapshot.metadata.updated });
        return snapshot.ref
      })
      .then(r => getDownloadURL(r).then(d => setM3uMeta({ ...m3uMeta, url: d })))
  }

  const logout = () => {
    localStorage.clear();
    setRmn("");
    setSid("");
    setOtpSent(false);
    setOtp("");
    setUser(null);
    setToken("");
    setM3uMeta(null);
    setLoading(false);
  }

  return (
    <div>
      {
        <Grid columns='equal' padded centered>
          {
            token === "" || theUser === null ?
              <Grid.Row>
                <Grid.Column></Grid.Column>
                <Grid.Column computer={8} tablet={12} mobile={16}>
                  <Segment loading={loading}>
                    <Form>
                      <Form.Field disabled={otpSent}>
                        <label>RMN</label>
                        <input value={rmn} placeholder='Registered Mobile Number' onChange={(e) => setRmn(e.currentTarget.value)} />
                      </Form.Field>
                      <Form.Field disabled={otpSent}>
                        <label>Subscriber ID</label>
                        <input value={sid} placeholder='Subscriber ID' onChange={(e) => setSid(e.currentTarget.value)} />
                      </Form.Field>
                      <Form.Field disabled={!otpSent}>
                        <label>OTP</label>
                        <input value={otp} placeholder='OTP' onChange={(e) => setOtp(e.currentTarget.value)} />
                      </Form.Field>
                      {
                        otpSent ? <Button primary onClick={authenticateUser}>Login</Button> :
                          <Button primary onClick={getOTP}>Get OTP</Button>
                      }
                    </Form>
                  </Segment>
                </Grid.Column>
                <Grid.Column></Grid.Column>
              </Grid.Row> :
              <Grid.Row>
                <Grid.Column></Grid.Column>
                <Grid.Column computer={8} tablet={12} mobile={16}>
                  <Segment loading={loading}>
                    <Header as="h1">Welcome, {theUser.sName}</Header>
                    {
                      firebaseValid ?
                        <Button primary onClick={(rt) => generateM3u('url')}>Generate m3u URL</Button>
                        : <></>
                    }
                    <Button primary onClick={(rt) => generateM3u('file')}>Download m3u file</Button>
                    <Button negative onClick={logout}>Logout</Button>
                    {
                      m3uMeta !== null ?
                        <Message >
                          <Message.Header>Last generated on {new Date(m3uMeta.updated).toLocaleString()}</Message.Header>
                          <Image centered src={'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(m3uMeta.url)} size='small' />
                          <p>
                            <a href={m3uMeta.url}>{m3uMeta.url}</a>
                          </p>
                        </Message> : <></>
                    }
                  </Segment>
                </Grid.Column>
                <Grid.Column></Grid.Column>
              </Grid.Row>
          }
          <Grid.Row style={{ display: err === '' ? 'none' : 'block' }}>
            <Grid.Column></Grid.Column>
            <Grid.Column computer={8} tablet={12} mobile={16}>
              <Message color='red'>
                <Message.Header>Error</Message.Header>
                <p>
                  {err}
                </p>
              </Message>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>
        </Grid>
      }
    </div>
  );
}

export default App;
